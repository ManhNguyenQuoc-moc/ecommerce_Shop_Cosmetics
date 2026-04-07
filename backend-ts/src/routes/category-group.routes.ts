import { Router } from "express";
import { CategoryGroupController } from "../controllers/category-group.controller";


const router = Router();
const controller = new CategoryGroupController();

// Create new group
router.post("/", controller.createGroup);

// Update group
router.put("/:id", controller.updateGroup);

// Delete group
router.delete("/:id", controller.deleteGroup);

// Get all groups
router.get("/", controller.getGroups);

// Get group by id
router.get("/:id", controller.getGroupById);

export default router;
