import { Router } from "express";
import { BrandController } from "../controllers/brand.controller";
import { BrandService } from "../services/brand.service";
import { BrandRepository } from "../repositories/brand.repository";
import { authenticate } from "../middlewares/auth.middleware";
import { permissionGuard } from "../middlewares/rbac-guard.middleware";

const router = Router();

const brandRepository = new BrandRepository();
const brandService = new BrandService(brandRepository);
const brandController = new BrandController(brandService);

router.get("/", brandController.getAllBrands);
router.get("/:id", brandController.getBrandById);
router.post("/", authenticate, permissionGuard("brand", "create"), brandController.createBrand);
router.put("/:id", authenticate, permissionGuard("brand", "update"), brandController.updateBrand);
router.delete("/:id", authenticate, permissionGuard("brand", "delete"), brandController.deleteBrand);


export default router;
