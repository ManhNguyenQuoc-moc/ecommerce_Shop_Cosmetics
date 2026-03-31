import { Router } from "express";
import { PurchaseController } from "../controllers/purchase.controller";

const router = Router();
const controller = new PurchaseController();

router.get("/", controller.getPOs);
router.post("/", controller.createPO);
router.get("/:id", controller.getPOById);
router.post("/:id/confirm", controller.confirmPO);

export default router;
