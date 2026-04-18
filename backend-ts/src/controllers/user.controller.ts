import { Request, Response } from "express";
import { UserService as IUserService } from "../interfaces/IUserService";
import { CreateUserSchema, UpdateUserSchema, UserQueryFiltersSchema, UpdateUserStatusSchema, UpdateUserRoleSchema } from "../DTO/user/user.dto";
import { handleControllerError } from "../utils/errorHandler";

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
      handleControllerError(res, error, "UserController");
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
      handleControllerError(res, error, "UserController");
    }
  };

  getMe = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = (req as any).user?.id;
      if (!id) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }
      
      const user = await this.userService.getUserWithRank(id);
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
      handleControllerError(res, error, "UserController");
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
      handleControllerError(res, error, "UserController");
    }
  };

  getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const query = UserQueryFiltersSchema.parse({
        ...req.query,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string) : 6,
        limit: req.query.limit ? parseInt(req.query.limit as string) : (req.query.pageSize ? parseInt(req.query.pageSize as string) : undefined),
      });

      const page = query.page || 1;
      const limit = query.limit || query.pageSize || 6;

      const result = await this.userService.getUsers(page, limit, query);
      
      res.status(200).json({
        success: true,
        message: "Get users successfully",
        data: {
          data: result.items,
          total: result.total,
          page,
          pageSize: limit,
        },
      });
    } catch (error: any) {
      handleControllerError(res, error, "UserController");
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
      handleControllerError(res, error, "UserController");
    }
  };

  getCustomerPointsHistory = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const history = await this.userService.getPointHistory(id);
      res.status(200).json({ success: true, data: history });
    } catch (error: any) {
      handleControllerError(res, error, "UserController");
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
      handleControllerError(res, error, "UserController");
    }
  };

  updateStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const { is_banned } = UpdateUserStatusSchema.parse(req.body);
      
      const user = await this.userService.updateUserStatus(id, is_banned);
      
      res.status(200).json({ 
        success: true, 
        message: is_banned ? "Khóa người dùng thành công" : "Mở khóa người dùng thành công", 
        data: user 
      });
    } catch (error: any) {
      handleControllerError(res, error, "UserController");
    }
  };

  updateRole = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const { role } = UpdateUserRoleSchema.parse(req.body);
      
      const user = await this.userService.updateUserRole(id, role);
      
      res.status(200).json({ 
        success: true, 
        message: "Cập nhật quyền người dùng thành công", 
        data: user 
      });
    } catch (error: any) {
      handleControllerError(res, error, "UserController");
    }
  };

}
