import { Router } from "express";
import { QuestionController } from "../controllers/question.controller";
import { QuestionService } from "../services/question.service";
import { QuestionRepository } from "../repositories/question.repository";
import { NotificationService } from "../services/notification.service";
import { NotificationRepository } from "../repositories/notification.repository";
import { authenticate, authenticateOptional, authorize } from "../middlewares/auth.middleware";

const router = Router();

const repository = new QuestionRepository();
const notificationRepository = new NotificationRepository();
const notificationService = new NotificationService(notificationRepository);
const service = new QuestionService(repository, notificationService);
const controller = new QuestionController(service);

router.get("/product/:productId", authenticateOptional, controller.getProductQuestions);
router.post("/", authenticateOptional, controller.createQuestion);
router.post("/:id/reply", authenticateOptional, controller.replyToQuestion);
router.patch("/:id/status", authenticate, authorize(["ADMIN"]), controller.updateStatus);

export default router;
