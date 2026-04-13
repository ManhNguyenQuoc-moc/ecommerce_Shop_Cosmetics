import { Request, Response } from "express";
import { UserService as IUserService } from "../interfaces/IUserService";
import { CreateUserSchema, UpdateUserSchema, UserQueryFiltersSchema } from "../DTO/user/user.dto";
import { z } from "zod";

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
        data: user,
      });
    } catch (error: any) {
      this.handleError(res, error);
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const validatedData = CreateUserSchema.parse(req.body);
      const user = await this.userService.createUser(validatedData);
      
      res.status(201).json({ 
        success: true, 
        message: "User created successfully",
        data: user 
      });
    } catch (error: any) {
      this.handleError(res, error);
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
        data: user,
      });
    } catch (error: any) {
      this.handleError(res, error);
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = (req as any).user?.id;
      if (!id) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }

      const validatedData = UpdateUserSchema.parse(req.body);
      const updatedUser = await this.userService.updateUser(id, validatedData);
      
      res.status(200).json({
        success: true,
        message: "Update user profile successfully",
        data: updatedUser,
      });
    } catch (error: any) {
      this.handleError(res, error);
    }
  };

  getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const query = UserQueryFiltersSchema.parse({
        ...req.query,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : (req.query.pageSize ? parseInt(req.query.pageSize as string) : undefined),
      });

      const page = (req.query.page as any) || 1;
      const limit = (query as any).limit || 10;

      const result = await this.userService.getUsers(page, limit, query);
      
      res.status(200).json({
        success: true,
        message: "Get users successfully",
        data: {
          items: result.items,
          total: result.total,
          page,
          pageSize: limit,
        },
      });
    } catch (error: any) {
      this.handleError(res, error);
    }
  };

  getPointsHistory = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = (req as any).user?.id;
      if (!id) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }
      const history = await this.userService.getPointHistory(id);
      res.status(200).json({ success: true, data: history });
    } catch (error: any) {
      this.handleError(res, error);
    }
  };

  getCustomerPointsHistory = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const history = await this.userService.getPointHistory(id);
      res.status(200).json({ success: true, data: history });
    } catch (error: any) {
      this.handleError(res, error);
    }
  };

  toggleWalletLock = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const { isLocked } = req.body;
      if (typeof isLocked !== 'boolean') {
        res.status(400).json({ success: false, message: "isLocked must be a boolean" });
        return;
      }
      const user = await this.userService.togglePointWalletStatus(id, isLocked);
      res.status(200).json({ success: true, message: "Cập nhật trạng thái ví thành công", data: user });
    } catch (error: any) {
      this.handleError(res, error);
    }
  };

  private handleError(res: Response, error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.issues.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }))
      });
      return;
    }

    const isBadRequest = ["Ngày sinh không thể ở tương lai.", "Bạn phải đủ 16 tuổi."].includes(error.message);
    
    console.error("UserController Error:", error);
    res.status(isBadRequest ? 400 : (error.status || 500)).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
}
