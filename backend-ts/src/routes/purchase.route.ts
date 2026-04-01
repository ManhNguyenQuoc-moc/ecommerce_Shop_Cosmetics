import { Router } from "express";
import { PurchaseController } from "../controllers/purchase.controller";

const router = Router();
const controller = new PurchaseController();

// Bind methods to preserve `this` context
router.get("/", controller.getPOs.bind(controller));
router.post("/", controller.createPO.bind(controller));
router.post("/receive-stock", controller.receiveStock.bind(controller));
router.get("/:id", controller.getPOById.bind(controller));
router.put("/:id", controller.updatePO.bind(controller));
router.post("/:id/confirm", controller.confirmPO.bind(controller));
router.post("/:id/cancel", controller.cancelPO.bind(controller));


export default router;
