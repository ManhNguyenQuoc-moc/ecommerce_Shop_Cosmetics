import { Request, Response } from "express";
import { IProductService } from "../interfaces/IProductService";
import { CreateProductDTO, CreateVariantDTO } from "../DTO/product/input/AddProductDTO";
import { UpdateProductDTO, UpdateVariantDTO } from "../DTO/product/input/UpdateProductDTO";

export class ProductController {
  private readonly productService: IProductService;

  constructor(productService: IProductService) {
    this.productService = productService;
  }

  getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = Number(req.query.page) || 1;
      const pageSize = Number(req.query.pageSize || req.query.limit) || 6;
      const flatten = req.query.flatten === 'true';
      const filters = {
        searchTerm: (req.query.search || req.query.searchTerm) as string,
        categoryId: req.query.categoryId as string,
        status: req.query.status as string,
        soldRange: req.query.soldRange as string,
        sortBy: req.query.sortBy as string,
        brandId: req.query.brandId as string
      };
      const result = await this.productService.getProducts(page, pageSize, flatten, filters);
      res.status(200).json({
        success: true,
        message: "Get products successfully",
        data: {
          products: result.data,
          total: result.total,
          page,
          pageSize: pageSize
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
  };

  getVariants = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = Number(req.query.page) || 1;
      const pageSize = Number(req.query.pageSize || req.query.limit) || 6;
      const filters = {
        status: req.query.status as string,
        searchTerm: (req.query.search || req.query.searchTerm) as string,
        sortBy: req.query.sortBy as string,
        classification: req.query.classification as string,
        priceRange: req.query.priceRange as string,
        statusName: req.query.statusName as string
        ,
        brandId: req.query.brandId as string
      };

      const result = await this.productService.getVariants(page, pageSize, filters);

      res.status(200).json({
        success: true,
        message: "Get variants successfully",
        data: {
          variants: result.variants,
          total: result.total,
          page,
          pageSize: pageSize
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
  };

  getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const product = await this.productService.getProductById(id);

      if (!product) {
        res.status(404).json({ success: false, message: "Product not found" });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Get product successfully",
        data: product,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
  };

  getVariantById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const variant = await this.productService.getVariantById(id);

      if (!variant) {
        res.status(404).json({ success: false, message: "Variant not found" });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Get variant successfully",
        data: variant,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
  };

  createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = req.body as CreateProductDTO;
      const product = await this.productService.createProduct(data);
      res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || "Lỗi khi tạo sản phẩm" });
    }
  };

  updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const data = req.body as UpdateProductDTO;
      const product = await this.productService.updateProduct(id, data);
      res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: product,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
  };

  deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      await this.productService.deleteProduct(id);
      res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
  };

  softDeleteProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const { ids } = req.body;
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        res.status(400).json({ success: false, message: "ids array is required" });
        return;
      }
      await this.productService.softDeleteProducts(ids);
      res.status(200).json({
        success: true,
        message: `${ids.length} sản phẩm (và các biến thể của nó) đã được ẩn thành công`,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
  };

  createVariant = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = req.body as CreateVariantDTO & { productId: string };
      const variant = await this.productService.createVariant(data);
      res.status(201).json({
        success: true,
        message: "Variant created successfully",
        data: variant,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
  };

  updateVariant = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const data = req.body as UpdateVariantDTO;
      const variant = await this.productService.updateVariant(id, data);
      res.status(200).json({
        success: true,
        message: "Variant updated successfully",
        data: variant,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
  };

  softDeleteVariants = async (req: Request, res: Response): Promise<void> => {
    try {
      const { ids } = req.body;
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        res.status(400).json({ success: false, message: "ids array is required" });
        return;
      }
      await this.productService.softDeleteVariants(ids);
      res.status(200).json({
        success: true,
        message: `${ids.length} biến thể đã được ẩn thành công`,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
  };

  bulkRestoreProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const { ids } = req.body;
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        res.status(400).json({ success: false, message: "ids array is required" });
        return;
      }
      await this.productService.restoreProducts(ids);
      res.status(200).json({
        success: true,
        message: `${ids.length} sản phẩm (và các biến thể của nó) đã được khôi phục thành công`,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
  };

  restoreVariants = async (req: Request, res: Response): Promise<void> => {
    try {
      const { ids } = req.body;
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        res.status(400).json({ success: false, message: "ids array is required" });
        return;
      }
      await this.productService.restoreVariants(ids);
      res.status(200).json({
        success: true,
        message: `Biến thể đã được khôi phục thành công.`,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
  };
}

