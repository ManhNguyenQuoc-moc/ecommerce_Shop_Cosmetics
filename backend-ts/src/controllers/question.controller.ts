import { Request, Response } from "express";
import { QuestionService } from "../services/question.service";
import { CreateQuestionSchema, ReplyQuestionSchema } from "../DTO/question.dto";

export class QuestionController {
  constructor(private questionService: QuestionService) {}

  createQuestion = async (req: Request, res: Response) => {
    try {
      const validatedData = CreateQuestionSchema.parse(req.body);
      const userId = (req as any).user?.id || null; // Allow anonymous
      
      const question = await this.questionService.createQuestion(userId, validatedData);
      res.status(201).json({ success: true, data: question });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  replyToQuestion = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const validatedData = ReplyQuestionSchema.parse(req.body);
      const userId = (req as any).user?.id || null;

      const reply = await this.questionService.replyToQuestion(userId, id as string, validatedData);
      res.status(201).json({ success: true, data: reply });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  getProductQuestions = async (req: Request, res: Response) => {
    try {
      const { productId } = req.params;
      const isAdmin = (req as any).user?.role === "ADMIN";
      const questions = await this.questionService.getProductQuestions(productId as string, isAdmin);
      res.json({ success: true, data: questions });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  updateStatus = async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const { status } = req.body;
      const question = await this.questionService.updateStatus(id, status);
      res.json({ success: true, data: question });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}
