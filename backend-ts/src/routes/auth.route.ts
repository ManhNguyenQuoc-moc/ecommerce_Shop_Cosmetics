import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { AuthService } from "../services/auth.service";
import { UserRepository } from "../repositories/user.repository";

const router = Router();
const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

router.post("/register", authController.register);
router.post("/request-password-recovery", authController.requestPasswordRecovery);
router.post("/login", authController.login);
router.get("/verify-email", authController.verifyEmail);
router.post("/complete-verification", authController.completeVerification);
router.post("/google", authController.googleLogin);
router.post("/facebook", authController.facebookLogin);

export default router;
