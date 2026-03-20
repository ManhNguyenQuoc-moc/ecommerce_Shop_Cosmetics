import { Router } from "express";
import { HomeController } from "../controllers/home.controller";
import { HomeService } from "../services/home.service";

const router = Router();

const homeService = new HomeService();
const homeController = new HomeController(homeService);

router.get("/", homeController.getHomeData);

export default router;
