import { Request, Response, NextFunction } from "express";
import { supabase } from "../config/supabase";
import { prisma } from "../config/prisma";

// 1. Định nghĩa cấu trúc User trong Request để tránh dùng 'any'
interface CustomUser {
  id: string;
  email?: string;
  role: string;
  [key: string]: any; // Cho phép các thuộc tính khác từ user_metadata
}

declare global {
  namespace Express {
    interface Request {
      user?: CustomUser;
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ success: false, message: "Unauthorized: Missing or invalid token format" });
    return;
  }

  const token = authHeader.split(" ")[1];
  try {
    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: " + (error?.message || "Invalid token")
      });
      return;
    }

    // Fetch latest user info from DB to ensure role accuracy
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id }
    });

    if (!dbUser) {
      res.status(401).json({ success: false, message: "Unauthorized: User not found in database" });
      return;
    }

    console.log(`[Auth] Authenticated user: ${dbUser.id}, Role: ${dbUser.role}`);

    // Gán dữ liệu vào req.user (đã có Type hỗ trợ)
    req.user = {
      id: dbUser.id,
      email: dbUser.email || user.email,
      role: dbUser.role, // Use DB role
      ...user.user_metadata,
    };

    next();
  } catch (error: any) {
    res.status(401).json({ success: false, message: "Unauthorized: Unexpected error" });
  }
};

export const authenticateOptional = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next();
    return;
  }

  const token = authHeader.split(" ")[1];
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (!error && user) {
      req.user = {
        id: user.id,
        email: user.email,
        role: user.user_metadata?.role || "CUSTOMER",
        ...user.user_metadata,
      };
    }
    next();
  } catch (error: any) {
    next();
  }
};

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user) {
      res.status(401).json({ success: false, message: "Unauthorized: User not authenticated" });
      return;
    }
    console.log(`[Auth] Authorizing User: ${user.id}, Role: ${user.role}, Allowed: ${roles}`);
    if (!roles.includes(user.role)) {
      console.log(`[Auth] Authorization FAILED for ${user.id}`);
      res.status(403).json({
        success: false,
        message: "Forbidden: You do not have permission to access this resource"
      });
      return;
    }

    next();
  };
};