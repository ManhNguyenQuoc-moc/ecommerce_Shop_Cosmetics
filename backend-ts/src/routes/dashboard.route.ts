import { Router } from "express";
import { DashboardRepository } from "../repositories/dashboard.repository";
import { DashboardService } from "../services/dashboard.service";
import { DashboardController } from "../controllers/dashboard.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { permissionGuard } from "../middlewares/rbac-guard.middleware";

const router = Router();
const dashboardRepo = new DashboardRepository();
const dashboardService = new DashboardService(dashboardRepo);
const dashboardController = new DashboardController(dashboardService);

router.get("/summary", authenticate, permissionGuard("dashboard", "view"), dashboardController.getDashboardSummary);

export default router;
