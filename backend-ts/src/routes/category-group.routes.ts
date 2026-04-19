import { Router } from "express";
import { CategoryGroupController } from "../controllers/category-group.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { permissionGuard } from "../middlewares/rbac-guard.middleware";


const router = Router();
const controller = new CategoryGroupController();

// Create new group
router.post("/", authenticate, permissionGuard("categoryGroup", "create"), controller.createGroup);

// Update group
router.put("/:id", authenticate, permissionGuard("categoryGroup", "update"), controller.updateGroup);

// Delete group
router.delete("/:id", authenticate, permissionGuard("categoryGroup", "delete"), controller.deleteGroup);

// Get all groups
router.get("/", controller.getGroups);

// Get group by id
router.get("/:id", controller.getGroupById);

export default router;
