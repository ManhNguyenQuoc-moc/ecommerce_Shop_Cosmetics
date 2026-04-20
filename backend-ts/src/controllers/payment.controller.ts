import { Request, Response } from "express";
import { verifyMomoSignature } from "../services/momo.service";
import { verifyZaloPayCallback } from "../services/zalopay.service";
import { verifySepaySignature } from "../services/sepay.service";
import { prisma } from "../config/prisma";
import { InventoryRepository } from "../repositories/inventory.repository";

const inventoryRepository = new InventoryRepository();

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

    const isValid = verifySepaySignature(payload);
    if (!isValid) {
      console.error("SEPay IPN Signature Mismatch!");
      res.status(200).json({ success: false, message: "Invalid signature" });
      return;
    }

    const orderId = String(
      payload.orderId ||
        payload.order_id ||
        payload.order_invoice_number ||
        payload.reference ||
        payload.ref ||
        ""
    );

    const statusRaw = String(
      payload.status || payload.payment_status || payload.order_status || payload.result || payload.code || ""
    ).toUpperCase();

    const successStatuses = new Set(["SUCCESS", "PAID", "COMPLETED", "0", "00", "TRUE", "1"]);
    const isSuccess = successStatuses.has(statusRaw);

    if (!orderId) {
      res.status(200).json({ success: false, message: "Missing order id" });
      return;
    }

    if (isSuccess) {
      await markOrderPaidAndDeductStock(orderId);
      console.log(`Order ${orderId} marked as PAID via SEPay IPN`);
      res.status(200).json({ success: true, message: "Success" });
    } else {
      console.warn(`Order ${orderId} payment failed with status ${statusRaw}`);
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