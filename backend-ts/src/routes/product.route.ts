import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { ProductService } from "../services/product.service";
import { ProductRepository } from "../repositories/product.repository";

const router = Router();


const productRepository = new ProductRepository();
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

router.get("/", productController.getProducts);
router.get("/variants/list", productController.getVariants);
router.get("/variants/:id/batches", productController.getVariantBatches);
router.get("/variants/:id", productController.getVariantById);
router.get("/:id", productController.getProductById);
router.post("/", productController.createProduct);
router.post("/variants", productController.createVariant);
router.post("/bulk-delete", productController.softDeleteProducts);
router.post("/bulk-restore", productController.bulkRestoreProducts);
router.post("/variants/bulk-delete", productController.softDeleteVariants);
router.post("/variants/bulk-restore", productController.restoreVariants);
router.put("/variants/:id", productController.updateVariant);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);


export default router;
