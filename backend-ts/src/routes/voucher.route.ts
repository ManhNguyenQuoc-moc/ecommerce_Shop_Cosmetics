import { Router } from "express";
import { VoucherController } from "../controllers/voucher.controller";
import { DiscountService } from "../services/discount.service";
import { DiscountRepository } from "../repositories/discount.repository";

const router = Router();

const discountRepo = new DiscountRepository();
const discountService = new DiscountService(discountRepo);
const voucherController = new VoucherController(discountService);

router.get("/", (req, res) => voucherController.getVouchers(req, res));
router.get("/:code", (req, res) => voucherController.getVoucherByCode(req, res));

export default router;
