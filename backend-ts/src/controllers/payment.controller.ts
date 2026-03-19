import { Request, Response } from "express";
import { createPaymentUrl } from "../services/vnpay.service";

export const createPayment = (req: Request, res: Response) => {
  try {
    const { amount, orderId } = req.body;

    const paymentUrl = createPaymentUrl({ amount, orderId });

    res.json({ paymentUrl });
  } catch (error) {
    res.status(500).json({ message: "Error creating payment" });
  }
};