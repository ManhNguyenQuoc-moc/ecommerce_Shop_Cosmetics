import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { UserService } from "../services/user.service";
import { UserRepository } from "../repositories/user.repository";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

// Khởi tạo Dependency Injection
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

// Định nghĩa routes
router.get("/all", userController.getUsers);
router.get("/me", authenticate, userController.getMe);
router.patch("/me", authenticate, userController.update);
router.get("/:id", userController.getUserById);
router.put("/:id/status", userController.create); // Simplified for now, or update status logic
router.post("/", userController.create);

export default router;
