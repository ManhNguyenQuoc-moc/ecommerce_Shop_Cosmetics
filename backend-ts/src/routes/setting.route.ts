import { Router } from "express";
import { SettingController } from "../controllers/setting.controller";
import { SettingService } from "../services/setting.service";
import { SettingRepository } from "../repositories/setting.repository";
import { authenticate } from "../middlewares/auth.middleware";
import { permissionGuard } from "../middlewares/rbac-guard.middleware";

const router = Router();

const settingRepository = new SettingRepository();
const settingService = new SettingService(settingRepository);
const settingController = new SettingController(settingService);

router.use(authenticate);

router.get("/", permissionGuard("setting", "read"), settingController.getSettings);
router.post("/", permissionGuard("setting", "update"), settingController.updateSettings);

export default router;
