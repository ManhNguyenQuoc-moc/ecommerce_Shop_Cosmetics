"use client";

import { useState, useEffect, useCallback } from "react";
import { MessageSquare, Send, HelpCircle, ChevronDown } from "lucide-react";
import { message } from "antd";
import { useSocket } from "@/src/@core/hooks/useSocket";
import { useAuth } from "@/src/context/AuthContext";
import { QuestionResponseDto, QuestionStatusType } from "@/src/services/models/question/output.dto";
import { QuestionStatus } from "@/src/enums";
import { QuestionService } from "@/src/services/customer/question/question.service";
import UnifiedQuestionItem from "./UnifiedQuestionItem";

import SWTButton from "@/src/@core/component/AntD/SWTButton";
import SWTInput from "@/src/@core/component/AntD/SWTInput";
import SWTDivider from "@/src/@core/component/AntD/SWTDivider";

type Props = {
  productId: string;
};

export default function ProductQuestionTab({ productId }: Props) {
  const [questions, setQuestions] = useState<QuestionResponseDto[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const INITIAL_COUNT = 5;

  const { currentUser } = useAuth();
  const { on, off } = useSocket(productId, "product");

  const fetchQuestions = useCallback(async () => {
    try {
      const data = await QuestionService.getProductQuestions(productId);
      setQuestions(data);
    } catch (error) {
      console.error("Failed to fetch questions", error);
    }
  }, [productId]);

  useEffect(() => {
    fetchQuestions();

    on("new_question", (question: QuestionResponseDto) => {
      setQuestions(prev => {
        if (prev.some(q => q.id === question.id)) return prev;
        return [question, ...prev];
      });
    });

    on("new_answer", (answer: QuestionResponseDto & { parentId: string }) => {
      setQuestions(prev => {
        const insertReply = (items: QuestionResponseDto[]): QuestionResponseDto[] => {
          return items.map(item => {
            if (item.id === answer.parentId) {
              const alreadyExists = item.replies?.some(r => r.id === answer.id);
              if (alreadyExists) return item;
              return { ...item, replies: [...(item.replies || []), answer] };
            }
            if (item.replies && item.replies.length > 0) {
              return { ...item, replies: insertReply(item.replies) };
            }
            return item;
          });
        };
        return insertReply(prev);
      });
    });

    return () => {
      off("new_question");
      off("new_answer");
    };
  }, [productId, on, off, fetchQuestions]);

  const handleSubmitQuestion = async () => {
    if (!newQuestion.trim()) {
      message.error("Vui lòng nhập câu hỏi");
      return;
    }

    setIsSubmitting(true);
    try {
      await QuestionService.createQuestion({
        productId,
        content: newQuestion
      });
      message.success("Đã gửi câu hỏi của bạn!");
      setNewQuestion("");
    } catch (error) {
      message.error("Gửi câu hỏi thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = (id: string, newStatus: QuestionStatusType) => {
    const updateTree = (items: QuestionResponseDto[]): QuestionResponseDto[] => {
      return items.map(item => {
        if (item.id === id) return { ...item, status: newStatus as QuestionStatus };
        if (item.replies) return { ...item, replies: updateTree(item.replies) };
        return item;
      });
    };
    setQuestions(prev => updateTree(prev));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Ask Question Form */}
      <div className="bg-slate-50 dark:bg-slate-900/50 p-6 md:p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <h4 className="font-black text-xl text-slate-800 dark:text-white m-0 uppercase tracking-tight">Hỏi đáp về sản phẩm</h4>
        </div>

        <div className="space-y-4">
          <SWTInput.TextArea
            rows={4}
            placeholder={currentUser ? "Bạn có thắc mắc gì về sản phẩm này?" : "Hỏi ẩn danh: Bạn có thắc mắc gì về sản phẩm này?"}
            value={newQuestion}
            showCount={false}
            onChange={(e) => setNewQuestion(e.target.value)}
            className="!rounded-[24px] !p-4 !border-slate-100 !dark:border-slate-800 !bg-white !dark:bg-slate-900 p-5 !focus:shadow-xl !focus:shadow-brand-500/5 !transition-all !text-sm !font-medium !resize-none !shadow-inner"
          />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 m-0">
              {currentUser ? `Đang hỏi dưới tên: ${currentUser.full_name || currentUser.email}` : "Bạn đang hỏi ẩn danh. Vui lòng đăng nhập để hiện tên."}
            </p>

            <SWTButton
              variant="solid"
              icon={<Send size={18} />}
              loading={isSubmitting}
              onClick={handleSubmitQuestion}
              disabled={!newQuestion.trim()}
              className="!mt-2 !w-full md:!w-auto !h-12 !px-8 !bg-brand-600 !hover:bg-brand-700 !text-white !rounded-2xl !font-black !uppercase !tracking-widest !text-xs !flex !items-center !justify-center !shadow-lg !shadow-brand-500/20 !transition-all !transform !hover:-translate-y-1 !active:scale-95"
            >
              Đặt câu hỏi
            </SWTButton>
          </div>
        </div>
      </div>

      <SWTDivider className="my-10 border-slate-100 dark:border-slate-800" />

      {/* Questions List */}
      <div className="space-y-6">
        <h5 className="font-black text-lg text-slate-800 dark:text-white flex items-center gap-2 px-2">
          <MessageSquare size={20} className="text-brand-600" />
          Cuộc hội thoại ({questions.length})
        </h5>

        <div className="space-y-4">
          {questions.slice(0, isExpanded ? questions.length : INITIAL_COUNT).map((q) => (
            <UnifiedQuestionItem
              key={q.id}
              question={q}
              onUpdateStatus={handleUpdateStatus}
            />
          ))}

          {questions.length > INITIAL_COUNT && (
            <div className="text-center pt-8">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="group w-full flex items-center justify-center gap-2 text-brand-600 hover:text-brand-700 font-bold py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300"
              >
                {isExpanded ? (
                  <>
                    Ẩn bớt câu hỏi
                    <ChevronDown size={18} className="rotate-180 transition-transform duration-300" />
                  </>
                ) : (
                  <>
                    Xem thêm {questions.length - INITIAL_COUNT} câu hỏi
                    <ChevronDown size={18} className="transition-transform duration-300" />
                  </>
                )}
              </button>
            </div>
          )}

          {questions.length === 0 && (
            <div className="text-center py-20 bg-slate-50/50 rounded-[40px] border border-dashed border-slate-200 dark:border-slate-800">
              <HelpCircle size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Chưa có câu hỏi nào. Hãy là người đầu tiên!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
