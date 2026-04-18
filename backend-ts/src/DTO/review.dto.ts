import { z } from "zod";
import { Sentiment } from "@prisma/client";

export const CreateReviewSchema = z.object({
  productId: z.string().uuid(),
  rating: z.number().min(0).max(5),
  comment: z.string().optional(),
});

export const ReplyReviewSchema = z.object({
  comment: z.string().min(1),
});

export type CreateReviewDto = z.infer<typeof CreateReviewSchema>;
export type ReplyReviewDto = z.infer<typeof ReplyReviewSchema>;

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
  status: string;
  parentId?: string | null;
  replies?: ReviewResponseDto[];
  createdAt: Date;
}
