/**
 * RBAC Middleware
 * Handles role-based access control and permission checking
 * Status: PREPARED - Not yet in use
 */

import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma";

/**
 * Interface for RBAC context attached to request
 */
interface RbacContext {
  userId: string;
  userRole: string;
  userPermissions: string[]; // Array of permission IDs
}

declare global {
  namespace Express {
    interface Request {
      rbac?: RbacContext;
    }
  }
}


export const loadPermissions = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: User not authenticated",
      });
      return;
    }

    // Fetch user permissions via roleId only.
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, roleId: true, accountType: true },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: User not found",
      });
      return;
    }

    // Flatten permissions from the linked role.
    const permissionIds = new Set<string>();
    if (user.roleId) {
      const rolePermissions = await prisma.rolePermission.findMany({
        where: { roleId: user.roleId },
        select: { permissionId: true },
      });
      rolePermissions.forEach((rp: { permissionId: string }) => {
        permissionIds.add(rp.permissionId);
      });
    }

    req.rbac = {
      userId: user.id,
      userRole: user.accountType || "CUSTOMER",
      userPermissions: Array.from(permissionIds),
    };

    next();
  } catch (error) {
    console.error("[RBAC] Load permissions error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Middleware to check if user has specific permission
 * 
 * Usage: 
 *   app.post("/api/users/:id/ban", 
 *     authenticate, 
 *     checkPermission({ resource: "user", action: "ban" }), 
 *     controller)
 */
export const checkPermission = (options: {
  resource: string;
  action: string;
}) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.rbac) {
        res.status(403).json({
          success: false,
          message: "Forbidden: RBAC context not found",
        });
        return;
      }

      // Find permission matching resource + action
      const permission = await prisma.permission.findFirst({
        where: {
          resource: options.resource,
          action: options.action,
        },
      });

      if (!permission) {
        res.status(500).json({
          success: false,
          message: "Permission definition not found",
        });
        return;
      }

      // Check if user has this permission
      if (!req.rbac.userPermissions.includes(permission.id)) {
        res.status(403).json({
          success: false,
          message: `Forbidden: Missing permission to ${options.action} ${options.resource}`,
        });
        return;
      }

      next();
    } catch (error) {
      console.error("[RBAC] Check permission error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
};

/**
 * Middleware to check if user has specific role
 * 
 * Usage:
 *   app.get("/api/admin/dashboard", 
 *     authenticate, 
 *     checkRole("ADMIN"), 
 *     controller)
 */
export const checkRole = (requiredRole: string) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "Unauthorized: User not authenticated",
        });
        return;
      }

      const requiredAccountType = requiredRole === "CUSTOMER" ? "CUSTOMER" : "INTERNAL";
      if (((req.user as any).accountType || "CUSTOMER") !== requiredAccountType) {
        res.status(403).json({
          success: false,
          message: `Forbidden: Requires ${requiredAccountType} account type`,
        });
        return;
      }

      next();
    } catch (error) {
      console.error("[RBAC] Check role error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
};

/**
 * Middleware to check if user has any of multiple roles
 * 
 * Usage:
 *   app.get("/api/admin/stats", 
 *     authenticate, 
 *     checkRoles(["ADMIN", "MODERATOR"]), 
 *     controller)
 */
export const checkRoles = (requiredRoles: string[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "Unauthorized: User not authenticated",
        });
        return;
      }

      const allowedAccountTypes = requiredRoles.map((role) => role === "CUSTOMER" ? "CUSTOMER" : "INTERNAL");
      if (!allowedAccountTypes.includes(((req.user as any).accountType || "CUSTOMER"))) {
        res.status(403).json({
          success: false,
          message: `Forbidden: Requires one of these account types: ${allowedAccountTypes.join(", ")}`,
        });
        return;
      }

      next();
    } catch (error) {
      console.error("[RBAC] Check roles error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
};

/**
 * Middleware to check if user has permission from grant flow
 * Used for dynamic permission checking based on runtime conditions
 * 
 * Usage:
 *   app.post("/api/orders/:orderId/update", 
 *     authenticate, 
 *     loadPermissions, 
 *     checkGrantPermission("order:update"), 
 *     controller)
 */
export const checkGrantPermission = (permissionName: string) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.rbac?.userPermissions.length) {
        res.status(403).json({
          success: false,
          message: `Forbidden: No permissions granted`,
        });
        return;
      }

      // Find permission by name
      const permission = await prisma.permission.findFirst({
        where: {
          name: permissionName,
        },
      });

      if (!permission) {
        res.status(500).json({
          success: false,
          message: "Permission definition not found",
        });
        return;
      }

      if (!req.rbac.userPermissions.includes(permission.id)) {
        res.status(403).json({
          success: false,
          message: `Forbidden: Missing ${permissionName} permission`,
        });
        return;
      }

      next();
    } catch (error) {
      console.error("[RBAC] Check grant permission error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
};
