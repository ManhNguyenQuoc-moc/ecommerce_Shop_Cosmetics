import { ReviewStatus } from "@/src/enums";

export type ReviewStatusType = `${ReviewStatus}`;
export type Sentiment = "POSITIVE" | "NEUTRAL" | "NEGATIVE";

export interface ReviewResponseDto {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string | null;

  productId: string;
  productName: string;

  rating: number;
  comment: string | null;

  sentiment?: Sentiment | null;
  status: ReviewStatus;

  parentId?: string | null;
  replies?: ReviewResponseDto[];

  createdAt: string; 
}