import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { UserService } from "../services/user.service";
import { UserRepository } from "../repositories/user.repository";
import { authenticate } from "../middlewares/auth.middleware";
import { permissionGuard } from "../middlewares/rbac-guard.middleware";

const router = Router();

// Dependency Injection Assembly
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

// Public / Authenticated User Routes (Profile)
router.get("/me", authenticate, userController.getMe);
router.get("/me/points", authenticate, userController.getPointsHistory);
router.patch("/me", authenticate, userController.update);
router.get("/:id", authenticate, userController.getUserById);
// Admin Routes
router.get("/", authenticate, permissionGuard("user", "list"), userController.getUsers);
router.post("/", authenticate, permissionGuard("user", "create"), userController.create);
router.get("/:id/points", authenticate, permissionGuard("user", "read"), userController.getCustomerPointsHistory);
router.patch("/:id/wallet-status", authenticate, permissionGuard("user", "toggleWallet"), userController.toggleWalletLock);
router.put("/:id/status", authenticate, permissionGuard("user", "updateStatus"), userController.updateStatus);
router.put("/:id/role", authenticate, permissionGuard("user", "updateRole"), userController.updateRole);
router.put("/:id/account-type", authenticate, permissionGuard("user", "updateRole"), userController.updateAccountType);

export default router;
