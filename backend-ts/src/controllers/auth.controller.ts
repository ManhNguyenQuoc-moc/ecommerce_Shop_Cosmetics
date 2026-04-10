import { Request, Response } from "express";
import { IAuthService } from "../interfaces/IAuthService";
import { CompleteVerificationInputDto, FacebookLoginInputDto, GoogleLoginInputDto } from "../DTO/auth/input/auth-input.dto";

export class AuthController {
  private readonly authService: IAuthService;

  constructor(authService: IAuthService) {
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

  verifyEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token } = req.query;
      if (!token || typeof token !== "string") {
        throw new Error("Verification token is required");
      }
      const status = await this.authService.verifyEmail(token);
      res.status(200).json({ success: true, data: status });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  completeVerification = async (req: Request, res: Response): Promise<void> => {
    try {
        const body: CompleteVerificationInputDto = req.body;
        if (!body.token) throw new Error("Token is required");
        await this.authService.completeVerification(body.token, body.password);
        res.status(200).json({ success: true, message: "Verification completed successfully" });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
  };

  googleLogin = async (req: Request, res: Response): Promise<void> => {
    try {
      const body: GoogleLoginInputDto = req.body;
      const result = await this.authService.googleLogin(body.idToken);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(401).json({ success: false, message: error.message });
    }
  };

  facebookLogin = async (req: Request, res: Response): Promise<void> => {
    try {
      const body: FacebookLoginInputDto = req.body;
      const result = await this.authService.facebookLogin(body.accessToken);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(401).json({ success: false, message: error.message });
    }
  };
}
