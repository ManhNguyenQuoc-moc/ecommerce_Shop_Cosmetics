import { Request, Response, NextFunction } from "express";
import { supabase } from "../config/supabase";
import { prisma } from "../config/prisma";

interface CustomUser {
  id: string;
  email?: string;
  accountType?: "CUSTOMER" | "INTERNAL";
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

    if (dbUser.is_banned) {
      res.status(403).json({ 
        success: false, 
        message: "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên để được hỗ trợ." 
      });
      return;
    }
    // console.log(`[Auth] Authenticated user: ${dbUser.id}, Role: ${dbUser.role}`);
    const userMetadata = { ...(user.user_metadata || {}) } as Record<string, any>;
    delete userMetadata.accountType;
    delete userMetadata.account_type;

    req.user = {
      ...userMetadata,
      id: dbUser.id,
      email: dbUser.email || user.email,
      // Security: accountType MUST come from DB, never from client metadata
      accountType: dbUser.accountType,
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
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id }
      });
      
      if (dbUser) {
        const userMetadata = { ...(user.user_metadata || {}) } as Record<string, any>;
        delete userMetadata.accountType;
        delete userMetadata.account_type;

        req.user = {
          ...userMetadata,
          id: dbUser.id,
          email: dbUser.email || user.email,
          accountType: dbUser.accountType,
        };
      } else {
        const userMetadata = { ...(user.user_metadata || {}) } as Record<string, any>;
        delete userMetadata.accountType;
        delete userMetadata.account_type;

        req.user = {
          ...userMetadata,
          id: user.id,
          email: user.email,
          accountType: "CUSTOMER",
        };
      }
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
    const userAccountType = user.accountType || "CUSTOMER";
    
    const allowedAccountTypes = roles.map((role) => (role === "CUSTOMER" ? "CUSTOMER" : "INTERNAL"));

    console.log(`[Auth] Authorizing User: ${user.id}, Account Type: ${userAccountType}, Allowed: ${roles}`);
    if (!allowedAccountTypes.includes(userAccountType)) {
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