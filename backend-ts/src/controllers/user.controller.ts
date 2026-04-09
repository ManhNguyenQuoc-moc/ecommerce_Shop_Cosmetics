import { Request, Response } from "express";
import { IUserService } from "../interfaces/IUserService";

export class UserController {
  private readonly userService: IUserService;

  constructor(userService: IUserService) {
    this.userService = userService;
  }

  getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const user = await this.userService.getUserById(id);

      if (!user) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Get customer info successfully",
        data: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          phone: user.phone,
          avatar: (user as any).avatar,
          loyalty_points: user.loyalty_points,
          addresses: (user as any).addresses || [],
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.userService.createUser(req.body);
      res.status(201).json({ success: true, data: user });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  getMe = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = (req as any).user?.id;
      if (!id) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }
      const user = await this.userService.getUserById(id);

      if (!user) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Get customer info successfully",
        data: {
          full_name: user.full_name,
          phone: user.phone,
          email: user.email,
          gender: user.gender,
          birthday: user.birthday,
          avatar: (user as any).avatar,
          loyalty_points: user.loyalty_points,
          addresses: (user as any).addresses || [],
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
  };
  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = (req as any).user?.id;
      if (!id) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }

      const updatedUser = await this.userService.updateUser(id, req.body);
      res.status(200).json({
        success: true,
        message: "Update user profile successfully",
        data: updatedUser,
      });
    } catch (error: any) {
      // Check if it's a validation error (you might want a custom error class for this)
      const isValidationError = ["Ngày sinh không thể ở tương lai.", "Bạn phải đủ 16 tuổi."].includes(error.message);
      res.status(isValidationError ? 400 : 500).json({ 
        success: false, 
        message: error.message || "Internal server error" 
      });
    }
  };

  getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limitRaw = req.query.limit || req.query.pageSize;
      const limit = parseInt(limitRaw as string) || 6;

      const filters = {
        search: req.query.search as string,
        role: req.query.role as string,
      };

      const result = await this.userService.getUsers(page, limit, filters);
      res.status(200).json({
        success: true,
        data: {
          items: result.items,
          total: result.total,
          page,
          pageSize: limit,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
  };
}
