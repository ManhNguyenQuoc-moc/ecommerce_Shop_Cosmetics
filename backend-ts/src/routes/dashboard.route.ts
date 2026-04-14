import { Router } from "express";
import { DashboardRepository } from "../repositories/dashboard.repository";
import { DashboardService } from "../services/dashboard.service";
import { DashboardController } from "../controllers/dashboard.controller";
import { authenticate, authorize } from "../middlewares/auth.middleware";

const router = Router();

const dashboardRepo = new DashboardRepository();
const dashboardService = new DashboardService(dashboardRepo);
const dashboardController = new DashboardController(dashboardService);

// Dashboard is restricted to Admin
router.get("/summary", authenticate, authorize(['ADMIN']), dashboardController.getDashboardSummary);

export default router;
