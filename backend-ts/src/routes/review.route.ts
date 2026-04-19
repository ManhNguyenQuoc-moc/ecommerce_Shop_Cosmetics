import { Router } from "express";
import { ReviewController } from "../controllers/review.controller";
import { ReviewService } from "../services/review.service";
import { ReviewRepository } from "../repositories/review.repository";
import { NotificationService } from "../services/notification.service";
import { NotificationRepository } from "../repositories/notification.repository";
import { authenticate, authenticateOptional } from "../middlewares/auth.middleware";
import { permissionGuard } from "../middlewares/rbac-guard.middleware";

const router = Router();

const notificationRepository = new NotificationRepository();
const notificationService = new NotificationService(notificationRepository);

const reviewRepository = new ReviewRepository();
const reviewService = new ReviewService(reviewRepository, notificationService);
const reviewController = new ReviewController(reviewService);

router.get("/product/:productId", authenticateOptional, reviewController.getProductReviews);
router.post("/", authenticate, reviewController.createReview);
router.post("/:id/reply", authenticate, permissionGuard("review", "update"), reviewController.replyToReview);
router.patch("/:id/status", authenticate, permissionGuard("review", "update"), reviewController.updateStatus);

export default router;
