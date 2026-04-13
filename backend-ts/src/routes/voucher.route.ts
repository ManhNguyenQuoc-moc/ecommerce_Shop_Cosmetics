import { Router } from "express";
import { VoucherController } from "../controllers/voucher.controller";
import { DiscountService } from "../services/discount.service";
import { DiscountRepository } from "../repositories/discount.repository";

import { authenticateOptional } from "../middlewares/auth.middleware";

const router = Router();

const discountRepo = new DiscountRepository();
const discountService = new DiscountService(discountRepo);
const voucherController = new VoucherController(discountService);

router.get("/", authenticateOptional, (req, res) => voucherController.getVouchers(req, res));
router.get("/:code", (req, res) => voucherController.getVoucherByCode(req, res));
router.post("/", (req, res) => voucherController.createVoucher(req, res));
router.patch("/:id", (req, res) => voucherController.updateVoucher(req, res));
router.delete("/:id", (req, res) => voucherController.deleteVoucher(req, res));

export default router;
