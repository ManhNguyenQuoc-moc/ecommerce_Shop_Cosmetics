import { Request, Response, NextFunction } from "express";
import { supabase } from "../config/supabase";

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
      res.status(401).json({ success: false, message: "Unauthorized: " + (error?.message || "Invalid token") });
      return;
    }
    (req as any).user = {
      id: user.id,
      email: user.email,
      role: user.user_metadata.role || "CUSTOMER",
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
      (req as any).user = {
        id: user.id,
        email: user.email,
        role: user.user_metadata.role || "CUSTOMER",
        ...user.user_metadata,
      };
    }
    next();
  } catch (error: any) {
    next();
  }
};
