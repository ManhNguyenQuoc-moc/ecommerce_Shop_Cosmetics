import { z } from "zod";

export const CreateQuestionSchema = z.object({
  productId: z.string().uuid(),
  content: z.string().min(1, "Nội dung câu hỏi không được để trống"),
});

export const ReplyQuestionSchema = z.object({
  content: z.string().min(1, "Nội dung phản hồi không được để trống"),
});

export type CreateQuestionDto = z.infer<typeof CreateQuestionSchema>;
export type ReplyQuestionDto = z.infer<typeof ReplyQuestionSchema>;

export interface QuestionResponseDto {
  id: string;
  productId: string;
  userId?: string | null;
  userName: string;
  userAvatar?: string | null;
  content: string;
  status: string;
  parentId?: string | null;
  replies?: QuestionResponseDto[];
  createdAt: Date;
}
