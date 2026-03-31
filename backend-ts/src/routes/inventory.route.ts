import { Router } from "express";
import { InventoryController } from "../controllers/inventory.controller";

const router = Router();
const controller = new InventoryController();

router.post("/receive", controller.receiveStock);
router.get("/batches", controller.getBatches);
router.get("/transactions", controller.getTransactions);
router.post("/import", controller.importExcel);

export default router;
