import { Router } from "express";
import { InventoryController } from "../controllers/inventory.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { permissionGuard } from "../middlewares/rbac-guard.middleware";

const router = Router();

const controller = new InventoryController();

router.post("/receive", authenticate, permissionGuard("inventory", "receiveStock"), controller.receiveStock);
router.get("/batches", authenticate, permissionGuard("inventory", "viewBatches"), controller.getBatches);
router.get("/transactions", authenticate, permissionGuard("inventory", "viewTransactions"), controller.getTransactions);
router.post("/import", authenticate, permissionGuard("inventory", "importExcel"), controller.importExcel);

export default router;
