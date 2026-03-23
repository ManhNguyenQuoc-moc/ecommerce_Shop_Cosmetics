import { Request, Response } from "express";
import { IProductService } from "../interfaces/IProductService";

export class ProductController {
  private readonly productService: IProductService;

  constructor(productService: IProductService) {
    this.productService = productService;
  }

  getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.pageSize || req.query.limit) || 10;
      const flatten = req.query.flatten === 'true';

      const result = await this.productService.getProducts(page, limit, flatten);

      res.status(200).json({
        success: true,
        message: "Get products successfully",
        data: {
          products: result.products,
          total: result.total,
          page,
          pageSize: limit
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

  createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const product = await this.productService.createProduct(req.body);
      res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
  };

  updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const product = await this.productService.updateProduct(id, req.body);
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
}
