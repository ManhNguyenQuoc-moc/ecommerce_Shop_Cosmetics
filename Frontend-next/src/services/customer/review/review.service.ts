import { get, patch, post } from "@/src/@core/utils/api";
import { ReviewResponseDto, ReviewStatusType } from "@/src/services/models/reviews/output.dto";
import { CreateReviewDto, ReplyReviewDto } from "@/src/services/models/reviews/input.dto";

const path = "/reviews";

export const ReviewService = {
  getProductReviews: async (productId: string): Promise<ReviewResponseDto[]> => {
    return await get<ReviewResponseDto[]>(`${path}/product/${productId}`);
  },

  createReview: async (data: CreateReviewDto): Promise<ReviewResponseDto> => {
    return await post<ReviewResponseDto>(path, data);
  },

  replyToReview: async (reviewId: string, data: ReplyReviewDto): Promise<ReviewResponseDto> => {
    return await post<ReviewResponseDto>(`${path}/${reviewId}/reply`, data);
  },

  updateReviewStatus: async (reviewId: string, newStatus: ReviewStatusType): Promise<ReviewResponseDto> => {
    return await patch<ReviewResponseDto>(`${path}/${reviewId}/status`, { status: newStatus });
  },

  getReviewById: async (reviewId: string): Promise<ReviewResponseDto> => {
    return await get<ReviewResponseDto>(`${path}/${reviewId}`);
  },

  getReviewReplies: async (reviewId: string): Promise<ReviewResponseDto[]> => {
    return await get<ReviewResponseDto[]>(`${path}/${reviewId}/replies`);
  },
};