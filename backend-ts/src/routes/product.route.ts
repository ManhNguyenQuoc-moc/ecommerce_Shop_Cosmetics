import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { ProductService } from "../services/product.service";
import { ProductRepository } from "../repositories/product.repository";
import { authenticate } from "../middlewares/auth.middleware";
import { permissionGuard } from "../middlewares/rbac-guard.middleware";

const router = Router();


const productRepository = new ProductRepository();
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

router.get("/", productController.getProducts);
router.get("/variants/list", productController.getVariants);
router.get("/variants/:id/batches", productController.getVariantBatches);
router.get("/variants/:id", productController.getVariantById);
router.get("/:id/related", productController.getRelatedProducts);
router.get("/brand/:brandId/products", productController.getBrandProducts);
router.get("/:id", productController.getProductById);
router.post("/", authenticate, permissionGuard("product", "create"), productController.createProduct);
router.post("/variants", authenticate, permissionGuard("variant", "create"), productController.createVariant);
router.post("/bulk-delete", authenticate, permissionGuard("product", "softDelete"), productController.softDeleteProducts);
router.post("/bulk-restore", authenticate, permissionGuard("product", "restore"), productController.bulkRestoreProducts);
router.post("/variants/bulk-delete", authenticate, permissionGuard("variant", "softDelete"), productController.softDeleteVariants);
router.post("/variants/bulk-restore", authenticate, permissionGuard("variant", "restore"), productController.restoreVariants);
router.put("/variants/:id", authenticate, permissionGuard("variant", "update"), productController.updateVariant);
router.put("/:id", authenticate, permissionGuard("product", "update"), productController.updateProduct);
router.delete("/:id", authenticate, permissionGuard("product", "delete"), productController.deleteProduct);


export default router;
