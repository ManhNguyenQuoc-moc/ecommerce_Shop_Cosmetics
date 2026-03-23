import { Router } from "express";
import { BrandController } from "../controllers/brand.controller";
import { BrandService } from "../services/brand.service";
import { BrandRepository } from "../repositories/brand.repository";

const router = Router();

const brandRepository = new BrandRepository();
const brandService = new BrandService(brandRepository);
const brandController = new BrandController(brandService);

router.get("/", brandController.getAllBrands);

export default router;
