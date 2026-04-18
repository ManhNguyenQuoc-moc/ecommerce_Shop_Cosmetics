import express from "express";
import { handleMomoIPN, handleVnpayIPN, handleZaloPayCallback } from "../controllers/payment.controller";

const router = express.Router();

router.post("/ipn/momo", handleMomoIPN);
router.get("/vnpay/ipn", handleVnpayIPN);
router.post("/zalopay/callback", handleZaloPayCallback);

export default router;