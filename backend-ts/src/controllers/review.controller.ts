import { Request, Response } from "express";
import { ReviewService } from "../services/review.service";
import { CreateReviewSchema, ReplyReviewSchema } from "../DTO/review.dto";

export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  createReview = async (req: Request, res: Response) => {
    try {
      const validatedData = CreateReviewSchema.parse(req.body);
      const userId = (req as any).user?.id; // Assuming Supabase auth middleware attaches user
      
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const review = await this.reviewService.createReview(userId, validatedData);
      res.status(201).json({ success: true, data: review });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  replyToReview = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const validatedData = ReplyReviewSchema.parse(req.body);
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const reply = await this.reviewService.replyToReview(userId, id as string, validatedData);
      res.status(201).json({ success: true, data: reply });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  getProductReviews = async (req: Request, res: Response) => {
    try {
      const { productId } = req.params;
      const isAdmin = (req as any).user?.role === "ADMIN";
      const reviews = await this.reviewService.getProductReviews(productId as string, isAdmin);
      res.json({ success: true, data: reviews });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  updateStatus = async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const { status } = req.body;
      const review = await this.reviewService.updateStatus(id, status);
      res.json({ success: true, data: review });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}
