import { ReviewRepository } from "../repositories/review.repository";
import { CreateReviewDto, ReplyReviewDto, ReviewResponseDto } from "../DTO/review.dto";
import { geminiService } from "./gemini.service";
import { socketService } from "./socket.service";
import { NotificationService } from "./notification.service";
import { NotificationType } from "@prisma/client";
import { prisma } from "../config/prisma";

export class ReviewService {
  constructor(
    private reviewRepository: ReviewRepository,
    private notificationService: NotificationService
  ) { }

  async createReview(userId: string, data: CreateReviewDto): Promise<ReviewResponseDto> {
    // 1. Analyze sentiment if there is a comment
    let sentiment: any = null;
    if (data.comment) {
      sentiment = await geminiService.analyzeSentiment(data.comment);
    }

    // 2. Save to database
    const review = await this.reviewRepository.create({
      userId,
      productId: data.productId,
      rating: data.rating,
      comment: data.comment,
      sentiment,
    });

    const response: ReviewResponseDto = {
      id: review.id,
      userId: review.userId,
      userName: review.user.full_name || "Unknown",
      userAvatar: review.user.avatar,
      productId: review.productId,
      productName: review.product.name,
      rating: review.rating,
      comment: review.comment,
      sentiment: review.sentiment,
      status: review.status,
      createdAt: review.createdAt,
    };

    // 3. Notify via WebSocket
    socketService.emitNewReview(data.productId, response);

    // 4. Update Product average rating
    const allProductReviews = await this.reviewRepository.findByProductId(data.productId);
    const topLevelReviews = allProductReviews.filter(r => r.parentId === null);

    if (topLevelReviews.length > 0) {
      const avgRating = topLevelReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / topLevelReviews.length;
      await (prisma as any).product.update({ // Using any to avoid TS issues during build if needed
        where: { id: data.productId },
        data: { rating: avgRating }
      });
    }

    // 5. Create log/notification for admin
    await this.notificationService.createNotification({
      title: "Đánh giá mới",
      content: `Khách hàng ${response.userName} đã đánh giá ${response.rating} sao cho sản phẩm ${response.productName}.`,
      type: NotificationType.NEW_REVIEW,
      metadata: { reviewId: review.id, productId: review.productId }
    });

    return response;
  }

  async replyToReview(userId: string, reviewId: string, data: ReplyReviewDto): Promise<ReviewResponseDto> {
    const parentReview = await this.reviewRepository.findById(reviewId);
    if (!parentReview) {
      throw new Error("Review not found");
    }

    const reply = await this.reviewRepository.create({
      userId,
      productId: parentReview.productId,
      rating: 5, // Default for replies
      comment: data.comment,
      parentId: reviewId,
    });

    const response: ReviewResponseDto = {
      id: reply.id,
      userId: reply.userId,
      userName: reply.user.full_name || "Admin",
      userAvatar: reply.user.avatar,
      productId: reply.productId,
      productName: reply.product.name,
      rating: reply.rating,
      comment: reply.comment,
      status: reply.status,
      parentId: reply.parentId,
      createdAt: reply.createdAt,
    };

    // Notify via WebSocket
    socketService.emitNewReply(parentReview.productId, response);

    return response;
  }

  async updateStatus(id: string, status: any): Promise<ReviewResponseDto> {
    const review = await this.reviewRepository.updateStatus(id, status);
    return this.mapToDto(review);
  }

  async getProductReviews(productId: string, isAdmin: boolean = false): Promise<ReviewResponseDto[]> {
    let reviews = await this.reviewRepository.findByProductId(productId);

    if (!isAdmin) {
      reviews = reviews.filter(r => r.status === "ACTIVE");
    }

    return reviews.map(r => this.mapToDto(r));
  }

  private mapToDto(review: any): ReviewResponseDto {
    return {
      id: review.id,
      userId: review.userId,
      userName: review.user?.full_name || "Unknown",
      userAvatar: review.user?.avatar,
      productId: review.productId,
      productName: review.product?.name,
      rating: review.rating,
      comment: review.comment,
      sentiment: review.sentiment,
      parentId: review.parentId,
      status: review.status,
      replies: review.replies?.map((reply: any) => ({
        id: reply.id,
        userId: reply.userId,
        userName: reply.user?.full_name || "Admin",
        userAvatar: reply.user?.avatar,
        productId: reply.productId,
        productName: review.product?.name,
        rating: reply.rating,
        comment: reply.comment,
        createdAt: reply.createdAt,
        status: reply.status,
      })),
      createdAt: review.createdAt,
    };
  }
}
