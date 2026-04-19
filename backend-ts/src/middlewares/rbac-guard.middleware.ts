
import { Request, Response, NextFunction } from "express";
import {
  hasPermission,
  getUserPermissions,
  getUserRoles,
} from "../utils/rbac.util";


export type GuardFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

/**
 * Error response helper
 */
interface ErrorResponse {
  success: false;
  message: string;
}

const RESOURCE_LABELS: Record<string, string> = {
  product: "sản phẩm",
  variant: "biến thể sản phẩm",
  user: "người dùng",
  order: "đơn hàng",
  review: "đánh giá",
  question: "câu hỏi",
  category: "danh mục",
  categoryGroup: "nhóm danh mục",
  brand: "thương hiệu",
  voucher: "voucher",
  inventory: "kho hàng",
  purchase: "đơn nhập hàng",
  dashboard: "dashboard",
  role: "vai trò",
  permission: "quyền",
  rbac: "phân quyền",
};

const ACTION_LABELS: Record<string, string> = {
  create: "tạo mới",
  read: "xem",
  update: "cập nhật",
  delete: "xóa",
  list: "xem danh sách",
  softDelete: "xóa mềm",
  restore: "khôi phục",
  manage: "quản lý",
  ban: "khóa/mở khóa",
  updateStatus: "cập nhật trạng thái",
  updateRole: "cập nhật vai trò",
  toggleWallet: "khóa/mở ví điểm",
};

function buildPermissionDeniedMessage(resource: string, action: string): string {
  const resourceLabel = RESOURCE_LABELS[resource] || resource;
  const actionLabel = ACTION_LABELS[action] || action;
  return `Bạn không có quyền ${actionLabel} ${resourceLabel}. Vui lòng liên hệ quản trị viên.`;
}

function forbiddenResponse(
  res: Response,
  message: string,
  statusCode: number = 403
): void {
  res.status(statusCode).json({
    success: false,
    message,
  } as ErrorResponse);
}

/**
 * Guard: Check permission (resource + action)
 * 
 * Usage:
 *   router.post("/users/:id/ban", 
 *     authenticate, 
 *     permissionGuard("user", "ban"), 
 *     controller)
 */
export const permissionGuard = (
  resource: string,
  action: string
): GuardFunction => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.id) {
        res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
        return;
      }

      const hasAccess = await hasPermission(
        req.user.id,
        resource,
        action
      );

      if (!hasAccess) {
        forbiddenResponse(
          res,
          buildPermissionDeniedMessage(resource, action),
          403
        );
        return;
      }

      next();
    } catch (error) {
      console.error("[RBAC Guard] Permission check error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
};

/**
 * Guard: Check if user has specific role
 * 
 * Usage:
 *   router.get("/admin/dashboard", 
 *     authenticate, 
 *     roleGuard("ADMIN"), 
 *     controller)
 */
export const roleGuard = (requiredRole: string): GuardFunction => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
        return;
      }

      const requiredAccountType = requiredRole === "CUSTOMER" ? "CUSTOMER" : "INTERNAL";
      if (((req.user as any).accountType || "CUSTOMER") !== requiredAccountType) {
        forbiddenResponse(
          res,
          `Required account type: ${requiredAccountType}`,
          403
        );
        return;
      }

      next();
    } catch (error) {
      console.error("[RBAC Guard] Role check error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
};

/**
 * Guard: Check if user has any of multiple roles
 * 
 * Usage:
 *   router.get("/stats", 
 *     authenticate, 
 *     rolesGuard(["ADMIN", "MODERATOR"]), 
 *     controller)
 */
export const rolesGuard = (requiredRoles: string[]): GuardFunction => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
        return;
      }

      const allowedAccountTypes = requiredRoles.map((role) => role === "CUSTOMER" ? "CUSTOMER" : "INTERNAL");
      if (!allowedAccountTypes.includes(((req.user as any).accountType || "CUSTOMER"))) {
        forbiddenResponse(
          res,
          `Required one of account types: ${allowedAccountTypes.join(", ")}`,
          403
        );
        return;
      }

      next();
    } catch (error) {
      console.error("[RBAC Guard] Roles check error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
};

/**
 * Guard: Check multiple permissions (all must be present)
 * 
 * Usage:
 *   router.delete("/products/:id", 
 *     authenticate, 
 *     permissionsGuard([
 *       { resource: "product", action: "delete" },
 *       { resource: "product", action: "read" }
 *     ]), 
 *     controller)
 */
export const permissionsGuard = (
  permissions: Array<{ resource: string; action: string }>
): GuardFunction => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.id) {
        res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
        return;
      }

      for (const perm of permissions) {
        const hasAccess = await hasPermission(
          req.user.id,
          perm.resource,
          perm.action
        );

        if (!hasAccess) {
          forbiddenResponse(
            res,
            buildPermissionDeniedMessage(perm.resource, perm.action),
            403
          );
          return;
        }
      }

      next();
    } catch (error) {
      console.error("[RBAC Guard] Permissions check error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
};

/**
 * Guard: Check if user has any of multiple permissions
 * 
 * Usage:
 *   router.post("/content/manage", 
 *     authenticate, 
 *     anyPermissionGuard([
 *       { resource: "product", action: "update" },
 *       { resource: "review", action: "delete" }
 *     ]), 
 *     controller)
 */
export const anyPermissionGuard = (
  permissions: Array<{ resource: string; action: string }>
): GuardFunction => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.id) {
        res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
        return;
      }

      for (const perm of permissions) {
        const hasAccess = await hasPermission(
          req.user.id,
          perm.resource,
          perm.action
        );

        if (hasAccess) {
          next();
          return;
        }
      }

      forbiddenResponse(
        res,
        "Bạn không có quyền thực hiện thao tác này. Vui lòng liên hệ quản trị viên.",
        403
      );
    } catch (error) {
      console.error("[RBAC Guard] Any permission check error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
};

/**
 * Guard: Check if resource owner or admin
 * Used for operations that require ownership or admin access
 * 
 * Usage:
 *   router.put("/orders/:id", 
 *     authenticate, 
 *     ownerOrAdminGuard((req) => req.params.id === req.user?.id), 
 *     controller)
 */
export const ownerOrAdminGuard = (
  ownershipCheck: (req: Request) => boolean
): GuardFunction => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
        return;
      }

      const isOwner = ownershipCheck(req);
      const isAdmin = ((req.user as any).accountType || "CUSTOMER") === "INTERNAL";

      if (!isOwner && !isAdmin) {
        forbiddenResponse(
          res,
          "You don't have access to this resource",
          403
        );
        return;
      }

      next();
    } catch (error) {
      console.error("[RBAC Guard] Owner or admin check error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
};

/**
 * Utility: Create combined guard
 * 
 * Usage:
 *   router.delete("/products/:id", 
 *     authenticate, 
 *     combineGuards([
 *       rolesGuard(["ADMIN", "MODERATOR"]),
 *       permissionGuard("product", "delete")
 *     ]), 
 *     controller)
 */
export const combineGuards = (guards: GuardFunction[]): GuardFunction => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let index = 0;

      const executeNext = async () => {
        if (index >= guards.length) {
          next();
          return;
        }

        const guard = guards[index++];
        await guard(req, res, () => executeNext());
      };

      await executeNext();
    } catch (error) {
      console.error("[RBAC Guard] Combined guard error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
};
