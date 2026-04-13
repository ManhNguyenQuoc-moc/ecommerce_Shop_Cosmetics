import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { UserService } from "../services/user.service";
import { UserRepository } from "../repositories/user.repository";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// Dependency Injection Assembly
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

// Public / Authenticated User Routes (Profile)
router.get("/me", authenticate, userController.getMe);
router.get("/me/points", authenticate, userController.getPointsHistory);
router.patch("/me", authenticate, userController.update);

// Admin Routes
router.get("/", userController.getUsers);
router.post("/", userController.create);
router.get("/:id", userController.getUserById);
router.get("/:id/points", userController.getCustomerPointsHistory);
router.patch("/:id/wallet-status", userController.toggleWalletLock);

export default router;
