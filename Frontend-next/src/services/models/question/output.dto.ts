import { QuestionStatus } from "@/src/enums";

export type QuestionStatusType = `${QuestionStatus}`;

export interface QuestionResponseDto {
  id: string;
  productId: string;

  userId?: string | null;
  userName: string;
  userAvatar?: string | null;

  content: string;
  status: QuestionStatus;

  parentId?: string | null;
  replies?: QuestionResponseDto[];

  createdAt: string;
}