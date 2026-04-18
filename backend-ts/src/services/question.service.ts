import { QuestionRepository } from "../repositories/question.repository";
import { CreateQuestionDto, ReplyQuestionDto, QuestionResponseDto } from "../DTO/question.dto";
import { socketService } from "./socket.service";
import { NotificationService } from "./notification.service";
import { NotificationType } from "@prisma/client";

export class QuestionService {
  constructor(
    private questionRepository: QuestionRepository,
    private notificationService: NotificationService
  ) {}

  async createQuestion(userId: string | null, data: CreateQuestionDto): Promise<QuestionResponseDto> {
    const question = await this.questionRepository.create({
      productId: data.productId,
      userId,
      content: data.content,
    });

    const response = this.mapToDto(question);

    // Notify via WebSocket
    socketService.emitNewQuestion(data.productId, response);

    // Create notification for admin
    await this.notificationService.createNotification({
      title: "Câu hỏi mới",
      content: `Có câu hỏi mới cho sản phẩm: ${data.content.substring(0, 50)}...`,
      type: NotificationType.NEW_QUESTION,
      metadata: { questionId: question.id, productId: data.productId }
    });

    return response;
  }

  async replyToQuestion(userId: string | null, questionId: string, data: ReplyQuestionDto): Promise<QuestionResponseDto> {
    const parentQuestion = await this.questionRepository.findById(questionId);
    if (!parentQuestion) {
      throw new Error("Question not found");
    }

    const reply = await this.questionRepository.create({
      productId: parentQuestion.productId,
      userId,
      content: data.content,
      parentId: questionId,
    });

    const response = this.mapToDto(reply);

    // Notify via WebSocket
    socketService.emitNewAnswer(parentQuestion.productId, response);

    return response;
  }

  async updateStatus(id: string, status: any): Promise<QuestionResponseDto> {
    const question = await this.questionRepository.updateStatus(id, status);
    return this.mapToDto(question);
  }

  async getProductQuestions(productId: string, isAdmin: boolean = false): Promise<QuestionResponseDto[]> {
    const questions = await this.questionRepository.findByProductId(productId);

    // Filter hidden if not admin (also filter hidden replies)
    const filterStatus = (items: any[]): any[] => {
      return items
        .filter(q => isAdmin || q.status === "ACTIVE")
        .map(q => ({
          ...q,
          replies: q.replies ? filterStatus(q.replies) : [],
        }));
    };

    return filterStatus(questions).map(q => this.mapToDto(q));
  }

  private mapToDto(question: any): QuestionResponseDto {
    return {
      id: question.id,
      productId: question.productId,
      userId: question.userId,
      userName: question.user?.full_name || "Người dùng ẩn danh",
      userAvatar: question.user?.avatar,
      content: question.content,
      parentId: question.parentId,
      status: question.status,
      createdAt: question.createdAt,
      replies: question.replies?.map((r: any) => this.mapToDto(r)),
    };
  }
}
