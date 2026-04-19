import { Router } from "express";
import { VoucherController } from "../controllers/voucher.controller";
import { DiscountService } from "../services/discount.service";
import { DiscountRepository } from "../repositories/discount.repository";

import { authenticateOptional } from "../middlewares/auth.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import { permissionGuard } from "../middlewares/rbac-guard.middleware";

const router = Router();

const discountRepo = new DiscountRepository();
const discountService = new DiscountService(discountRepo);
const voucherController = new VoucherController(discountService);

router.get("/", authenticateOptional, (req, res) => voucherController.getVouchers(req, res));
router.get("/:code", authenticateOptional, (req, res) => voucherController.getVoucherByCode(req, res));
router.post("/", authenticate, permissionGuard("voucher", "create"), (req, res) => voucherController.createVoucher(req, res));
router.patch("/:id", authenticate, permissionGuard("voucher", "update"), (req, res) => voucherController.updateVoucher(req, res));
router.delete("/:id", authenticate, permissionGuard("voucher", "delete"), (req, res) => voucherController.deleteVoucher(req, res));

export default router;
