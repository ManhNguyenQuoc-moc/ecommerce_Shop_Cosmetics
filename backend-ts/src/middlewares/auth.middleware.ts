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

    // Attach user to request - Map Supabase user properties to our expected format
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
