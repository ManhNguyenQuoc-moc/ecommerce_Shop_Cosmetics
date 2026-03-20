import { Request, Response } from "express";
import { ICategoryService } from "../interfaces/ICategoryService";

export class CategoryController {
  private readonly categoryService: ICategoryService;

  constructor(categoryService: ICategoryService) {
    this.categoryService = categoryService;
  }

  getCategories = async (req: Request, res: Response): Promise<void> => {
    try {
      const categories = await this.categoryService.getCategories();

      res.status(200).json({
        success: true,
        message: "Get categories successfully",
        data: categories,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
  };

  getCategoryById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const category = await this.categoryService.getCategoryById(id);

      if (!category) {
        res.status(404).json({ success: false, message: "Category not found" });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Get category successfully",
        data: category,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
  };

  createCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const category = await this.categoryService.createCategory(req.body);
      res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: category,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
  };

  updateCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const category = await this.categoryService.updateCategory(id, req.body);
      res.status(200).json({
        success: true,
        message: "Category updated successfully",
        data: category,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
  };

  deleteCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      await this.categoryService.deleteCategory(id);
      res.status(200).json({
        success: true,
        message: "Category deleted successfully",
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
  };
}
