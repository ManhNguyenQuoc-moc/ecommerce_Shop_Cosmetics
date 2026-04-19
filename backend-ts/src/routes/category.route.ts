import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";
import { CategoryService } from "../services/category.service";
import { CategoryRepository } from "../repositories/category.repository";
import { authenticate } from "../middlewares/auth.middleware";
import { permissionGuard } from "../middlewares/rbac-guard.middleware";

const router = Router();

const categoryRepository = new CategoryRepository();
const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(categoryService);

router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategoryById);
router.post("/", authenticate, permissionGuard("category", "create"), categoryController.createCategory);
router.put("/:id", authenticate, permissionGuard("category", "update"), categoryController.updateCategory);
router.delete("/:id", authenticate, permissionGuard("category", "delete"), categoryController.deleteCategory);

export default router;
