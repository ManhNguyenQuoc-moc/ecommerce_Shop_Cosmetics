import { Router } from "express";
import { BrandController } from "../controllers/brand.controller";
import { BrandService } from "../services/brand.service";
import { BrandRepository } from "../repositories/brand.repository";

const router = Router();

const brandRepository = new BrandRepository();
const brandService = new BrandService(brandRepository);
const brandController = new BrandController(brandService);

router.get("/", brandController.getAllBrands);
router.get("/:id", brandController.getBrandById);
router.post("/", brandController.createBrand);
router.put("/:id", brandController.updateBrand);
router.delete("/:id", brandController.deleteBrand);


export default router;
