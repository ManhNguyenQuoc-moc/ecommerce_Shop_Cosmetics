import { Router } from "express";
import { PurchaseController } from "../controllers/purchase.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { permissionGuard } from "../middlewares/rbac-guard.middleware";

const router = Router();
const controller = new PurchaseController();

router.get("/", authenticate, permissionGuard("purchase", "viewPOs"), controller.getPOs.bind(controller));
router.post("/", authenticate, permissionGuard("purchase", "createPO"), controller.createPO.bind(controller));
router.post("/receive-stock", authenticate, permissionGuard("purchase", "receiveStock"), controller.receiveStock.bind(controller));
router.get("/:id", authenticate, permissionGuard("purchase", "viewPOs"), controller.getPOById.bind(controller));
router.get("/:id/items", authenticate, permissionGuard("purchase", "viewPOs"), controller.getPOItems.bind(controller));
router.get("/:id/receipts", authenticate, permissionGuard("purchase", "viewPOs"), controller.getPOReceipts.bind(controller));
router.put("/:id", authenticate, permissionGuard("purchase", "updatePO"), controller.updatePO.bind(controller));
router.post("/:id/confirm", authenticate, permissionGuard("purchase", "confirmPO"), controller.confirmPO.bind(controller));
router.post("/:id/cancel", authenticate, permissionGuard("purchase", "cancelPO"), controller.cancelPO.bind(controller));
router.post("/:id/resubmit", authenticate, permissionGuard("purchase", "updatePO"), controller.resubmitPO.bind(controller));


export default router;
