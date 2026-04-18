import { Request, Response } from "express";
import { verifyVnpaySignature } from "../services/vnpay.service";
import { verifyMomoSignature } from "../services/momo.service";
import { verifyZaloPayCallback } from "../services/zalopay.service";
import { prisma } from "../config/prisma";

/**
 * Handle VNPay IPN (Asynchronous notification)
 */
export const handleVnpayIPN = async (req: Request, res: Response) => {
  try {
    const vnp_Params = req.query;
    console.log("VNPay IPN Received:", vnp_Params);

    const isValid = verifyVnpaySignature(vnp_Params);
    if (!isValid) {
      console.error("VNPay IPN Signature Mismatch!");
      res.status(200).json({ RspCode: "97", Message: "Checksum failed" });
      return;
    }

    const orderId = vnp_Params["vnp_TxnRef"] as string;
    const responseCode = vnp_Params["vnp_ResponseCode"];

    // 00 means success in VNPay
    if (responseCode === "00") {
      await prisma.order.update({
        where: { id: orderId },
        data: { payment_status: "PAID" },
      });
      console.log(`Order ${orderId} marked as PAID via VNPay IPN`);
      res.status(200).json({ RspCode: "00", Message: "Success" });
    } else {
      console.warn(`Order ${orderId} payment failed with code ${responseCode}`);
      res.status(200).json({ RspCode: "00", Message: "Success (Payment Failed caught)" });
    }
  } catch (error) {
    console.error("VNPay IPN Error:", error);
    res.status(200).json({ RspCode: "99", Message: "Unknow error" });
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
      await prisma.order.update({
        where: { id: orderId },
        data: { payment_status: "PAID" },
      });
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

    await prisma.order.update({
      where: { id: orderId },
      data: { payment_status: "PAID" },
    });

    console.log(`Order ${orderId} marked as PAID via ZaloPay Callback`);
    return res.status(200).json({ return_code: 1, return_message: "OK" });
  } catch (error: any) {
    console.error("ZaloPay Callback Error:", error);
    return res.status(200).json({ return_code: 0, return_message: error.message });
  }
};