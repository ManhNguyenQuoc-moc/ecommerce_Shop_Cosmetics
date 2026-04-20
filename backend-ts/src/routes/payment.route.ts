import express from "express";
import { handleMomoIPN, handleSepayIPN, handleZaloPayCallback } from "../controllers/payment.controller";

const router = express.Router();

router.post("/ipn/momo", handleMomoIPN);
router.post("/ipn/sepay", handleSepayIPN);
router.get("/ipn/sepay", handleSepayIPN);
router.post("/zalopay/callback", handleZaloPayCallback);

export default router;