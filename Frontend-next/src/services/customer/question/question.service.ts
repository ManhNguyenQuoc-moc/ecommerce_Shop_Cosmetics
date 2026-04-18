import { get, post, patch } from "@/src/@core/utils/api";
import { QuestionResponseDto, QuestionStatusType } from "@/src/services/models/question/output.dto";
import { CreateQuestionDto, ReplyQuestionDto } from "@/src/services/models/question/input.dto";

const path = "/questions";

export const QuestionService = {
  getProductQuestions: async (productId: string): Promise<QuestionResponseDto[]> => {
    return await get<QuestionResponseDto[]>(`${path}/product/${productId}`);
  },

  createQuestion: async (data: CreateQuestionDto): Promise<QuestionResponseDto> => {
    return await post<QuestionResponseDto>(path, data);
  },

  replyToQuestion: async (questionId: string, data: ReplyQuestionDto): Promise<QuestionResponseDto> => {
    return await post<QuestionResponseDto>(`${path}/${questionId}/reply`, data);
  },

  updateQuestionStatus: async (questionId: string, newStatus: QuestionStatusType): Promise<QuestionResponseDto> => {
    return await patch<QuestionResponseDto>(`${path}/${questionId}/status`, { status: newStatus });
  },

  getQuestionById: async (questionId: string): Promise<QuestionResponseDto> => {
    return await get<QuestionResponseDto>(`${path}/${questionId}`);
  },

  getQuestionReplies: async (questionId: string): Promise<QuestionResponseDto[]> => {
    return await get<QuestionResponseDto[]>(`${path}/${questionId}/replies`);
  },
};
