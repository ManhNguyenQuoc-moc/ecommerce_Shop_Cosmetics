import { Request, Response } from "express";
import { verifyMomoSignature } from "../services/momo.service";
import { verifyZaloPayCallback } from "../services/zalopay.service";
import { verifySepaySignature } from "../services/sepay.service";
import { prisma } from "../config/prisma";
import { InventoryRepository } from "../repositories/inventory.repository";

const inventoryRepository = new InventoryRepository();

const asNumber = (value: unknown): number => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const getObject = (value: unknown): Record<string, any> => {
  return value && typeof value === "object" ? (value as Record<string, any>) : {};
};

type SePayNormalizedPayload = {
  nestedOrder: Record<string, any>;
  nestedTransaction: Record<string, any>;
  orderCandidates: string[];
  transferAmount: number;
  transferType: string;
  statusRaw: string;
  isSuccess: boolean;
};

const isOfficialSepayIPN = (payload: Record<string, any>): boolean => {
  return Boolean(payload.notification_type && payload.order && payload.transaction);
};

const extractUuidFromText = (value: unknown): string | null => {
  const text = String(value || "");
  const match = text.match(/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i);
  return match ? match[0] : null;
};

const extractSepayOrderCandidates = (payload: Record<string, any>): string[] => {
  const nestedOrder = getObject(payload.order);
  const nestedTransaction = getObject(payload.transaction);
  const nestedCustomData = getObject(payload.custom_data);
  const nestedOrderCustomData = getObject(nestedOrder.custom_data);

  const direct = [
    payload.orderId,
    payload.order_id,
    payload.order_invoice_number,
    payload.reference,
    payload.ref,
    payload.code,
    payload.content,
    nestedOrder.id,
    nestedOrder.order_id,
    nestedOrder.order_invoice_number,
    nestedOrder.custom_data?.orderId,
    nestedOrder.custom_data?.order_id,
    nestedOrderCustomData.orderId,
    nestedOrderCustomData.order_id,
    nestedCustomData.orderId,
    nestedCustomData.order_id,
  ]
    .map((v) => String(v || "").trim())
    .filter(Boolean);

  const textSources = [
    payload.description,
    payload.content,
    payload.code,
    payload.reference,
    payload.ref,
    nestedOrder.order_description,
    nestedOrder.order_invoice_number,
    nestedOrder.order_id,
    nestedTransaction.transaction_id,
  ];
  const uuidInText = textSources.map(extractUuidFromText).filter((v): v is string => Boolean(v));

  return Array.from(new Set([...direct, ...uuidInText]));
};

const normalizeSepayPayload = (payload: Record<string, any>): SePayNormalizedPayload => {
  const nestedOrder = getObject(payload.order);
  const nestedTransaction = getObject(payload.transaction);
  const orderCandidates = extractSepayOrderCandidates(payload);
  const transferAmount = asNumber(
    payload.transferAmount ||
      payload.transfer_amount ||
      payload.amount ||
      nestedTransaction.transaction_amount ||
      nestedOrder.order_amount
  );
  const statusRaw = String(
    payload.status ||
      payload.payment_status ||
      payload.order_status ||
      payload.result ||
      payload.code ||
      nestedOrder.order_status ||
      nestedTransaction.transaction_status ||
      nestedTransaction.authentication_status ||
      ""
  ).toUpperCase();
  const transferType = String(payload.transferType || payload.transfer_type || nestedTransaction.transaction_type || "").toLowerCase();
  const successStatuses = new Set(["SUCCESS", "PAID", "COMPLETED", "CAPTURED", "APPROVED", "ORDER_PAID", "0", "00", "TRUE", "1"]);
  const isSuccess =
    successStatuses.has(statusRaw) ||
    (transferType === "in" && transferAmount > 0) ||
    String(nestedOrder.order_status || "").toUpperCase() === "CAPTURED" ||
    String(nestedTransaction.transaction_status || "").toUpperCase() === "APPROVED";

  return {
    nestedOrder,
    nestedTransaction,
    orderCandidates,
    transferAmount,
    transferType,
    statusRaw,
    isSuccess,
  };
};

const resolveSepayOrderId = async (payload: Record<string, any>, normalized: SePayNormalizedPayload): Promise<string> => {
  const { nestedOrder, nestedTransaction, orderCandidates, transferAmount } = normalized;

  for (const candidate of orderCandidates) {
    const found = await prisma.order.findUnique({ where: { id: candidate }, select: { id: true } });
    if (found?.id) {
      return found.id;
    }
  }

  if (transferAmount <= 0) {
    return "";
  }

  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const candidatesByAmount = await prisma.order.findMany({
    where: {
      payment_method: "SEPAY",
      payment_status: "UNPAID",
      createdAt: { gte: oneDayAgo },
    },
    select: { id: true, final_amount: true, total_amount: true },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const matched = candidatesByAmount.filter(
    (o) => Math.abs(Number(o.final_amount || 0) - transferAmount) < 0.5 || Math.abs(Number(o.total_amount || 0) - transferAmount) < 0.5
  );

  console.info("SEPay fallback amount matching", {
    transferAmount,
    scannedCount: candidatesByAmount.length,
    matchedCount: matched.length,
    matchedOrderIds: matched.map((o) => o.id),
    webhookCode: payload.code,
    webhookReferenceCode: payload.referenceCode,
    webhookContent: payload.content,
    webhookOrderId: nestedOrder.order_id,
    webhookOrderInvoiceNumber: nestedOrder.order_invoice_number,
    webhookCustomOrderId: nestedOrder.custom_data?.orderId,
  });

  if (matched.length === 1) {
    console.info("SEPay fallback resolved order", {
      orderId: matched[0].id,
      transferAmount,
    });
    return matched[0].id;
  }

  if (matched.length > 1) {
    console.warn("SEPay fallback is ambiguous", {
      transferAmount,
      matchedOrderIds: matched.map((o) => o.id),
    });
  }

  return "";
};

const markOrderPaidAndDeductStock = async (orderId: string) => {
  await prisma.$transaction(async (tx: any) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    // Idempotency: callback can be retried by gateways.
    if (order.payment_status === "PAID") {
      return;
    }

    if (order.payment_method !== "COD") {
      for (const item of order.items) {
        await inventoryRepository.deductStock(item.variantId, item.quantity, order.id, tx);
      }
    }

    await tx.order.update({
      where: { id: orderId },
      data: { payment_status: "PAID" },
    });
  });
};

/**
 * Handle SEPay IPN/Callback
 */
export const handleSepayIPN = async (req: Request, res: Response) => {
  try {
    const payload = { ...(req.method === "GET" ? req.query : req.body) } as Record<string, any>;
    console.log("SEPay IPN Received:", payload);

    if (!isOfficialSepayIPN(payload)) {
      console.info("SEPay webhook ignored (non-official IPN payload)", {
        hasNotificationType: Boolean(payload.notification_type),
        hasOrder: Boolean(payload.order),
        hasTransaction: Boolean(payload.transaction),
      });
      res.status(200).json({ success: true, message: "Ignored non-official webhook" });
      return;
    }

    if (String(payload.notification_type || "").toUpperCase() !== "ORDER_PAID") {
      console.info("SEPay IPN ignored (unsupported notification type)", {
        notificationType: payload.notification_type,
      });
      res.status(200).json({ success: true, message: "Ignored notification type" });
      return;
    }

    const isValid = verifySepaySignature(payload, req.headers as Record<string, any>);
    if (!isValid) {
      console.error("SEPay IPN Signature Mismatch!");
      res.status(200).json({ success: false, message: "Invalid signature" });
      return;
    }

    const normalized = normalizeSepayPayload(payload);
    const orderId = await resolveSepayOrderId(payload, normalized);

    if (!orderId) {
      const { nestedOrder, nestedTransaction, transferAmount } = normalized;
      console.warn("SEPay IPN cannot resolve order id", {
        code: payload.code,
        content: payload.content,
        referenceCode: payload.referenceCode,
        transferAmount,
        nestedOrderInvoiceNumber: nestedOrder.order_invoice_number,
        nestedOrderId: nestedOrder.order_id,
        nestedCustomOrderId: nestedOrder.custom_data?.orderId,
      });
      res.status(200).json({ success: false, message: "Missing order id" });
      return;
    }

    if (normalized.isSuccess) {
      await markOrderPaidAndDeductStock(orderId);
      console.log(`Order ${orderId} marked as PAID via SEPay IPN`);
      res.status(200).json({ success: true, message: "Success" });
    } else {
      console.warn(`Order ${orderId} payment failed with status ${normalized.statusRaw}`);
      res.status(200).json({ success: true, message: "Payment failed recorded" });
    }
  } catch (error) {
    console.error("SEPay IPN Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Handle MoMo IPN
 */
export const handleMomoIPN = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    console.log("MoMo IPN Received:", body);

    const isValid = verifyMomoSignature(body);
    if (!isValid) {
      console.error("MoMo IPN Signature Mismatch!");
      res.status(400).json({ message: "Invalid signature" });
      return;
    }

    const orderId = body.orderId;
    const resultCode = parseInt(body.resultCode);

    if (resultCode === 0) {
      await markOrderPaidAndDeductStock(orderId);
      console.log(`Order ${orderId} marked as PAID via MoMo IPN`);
    } else {
      console.warn(`Order ${orderId} payment failed with code ${resultCode}`);
    }

    res.status(204).send();
  } catch (error) {
    console.error("MoMo IPN Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Handle ZaloPay Callback
 */
export const handleZaloPayCallback = async (req: Request, res: Response) => {
  try {
    const { data, mac } = req.body;
    console.log("ZaloPay Callback Received:", req.body);

    const isValid = verifyZaloPayCallback(data, mac);
    if (!isValid) {
      console.error("ZaloPay Callback Signature Mismatch!");
      return res.status(200).json({ return_code: -1, return_message: "mac not equal" });
    }

    const parsedData = JSON.parse(data);
    const app_trans_id = parsedData.app_trans_id;
    // Format was YYMMDD_orderId, extract orderId
    const orderId = app_trans_id.split("_")[1];

    await markOrderPaidAndDeductStock(orderId);

    console.log(`Order ${orderId} marked as PAID via ZaloPay Callback`);
    return res.status(200).json({ return_code: 1, return_message: "OK" });
  } catch (error: any) {
    console.error("ZaloPay Callback Error:", error);
    return res.status(200).json({ return_code: 0, return_message: error.message });
  }
};