import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
  private readonly authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.authService.register(req.body);
      res.status(201).json({
        success: true,
        message: "Register successfully",
        data: user,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);
      res.status(200).json({
        success: true,
        message: "Login successfully",
        data: result,
      });
    } catch (error: any) {
      res.status(401).json({ success: false, message: error.message });
    }
  };
}
