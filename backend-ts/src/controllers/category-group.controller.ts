import { Request, Response } from "express";
import { ICategoryGroupService } from "../interfaces/ICategoryGroupService";
import { CategoryGroupService } from "../services/category-group.service";
import { CategoryGroupRepository } from "../repositories/category-group.repository";

export class CategoryGroupController {
  private readonly service: ICategoryGroupService;

  constructor() {
    this.service = new CategoryGroupService(new CategoryGroupRepository());
  }

  getGroups = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const searchTerm = req.query.search as string;

      const result = await this.service.getCategoryGroups(page, limit, searchTerm);
      res.json({
        success: true,
        message: "Lấy danh sách nhóm danh mục thành công",
        data: result
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getGroupById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const group = await this.service.getCategoryGroupById(id);
      if (!group) {
        res.status(404).json({ success: false, message: "Không tìm thấy nhóm danh mục" });
        return;
      }
      res.json({
        success: true,
        message: "Lấy thông tin nhóm danh mục thành công",
        data: group
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  createGroup = async (req: Request, res: Response): Promise<void> => {
    try {
      const group = await this.service.createCategoryGroup(req.body);
      res.status(201).json({
        success: true,
        message: "Tạo nhóm danh mục thành công",
        data: group
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  updateGroup = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const group = await this.service.updateCategoryGroup(id, req.body);
      res.json({
        success: true,
        message: "Cập nhật nhóm danh mục thành công",
        data: group
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  deleteGroup = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      await this.service.deleteCategoryGroup(id);
      res.json({
        success: true,
        message: "Xóa nhóm danh mục thành công"
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}
