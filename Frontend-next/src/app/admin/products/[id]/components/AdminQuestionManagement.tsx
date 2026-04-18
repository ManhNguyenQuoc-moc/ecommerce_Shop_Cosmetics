"use client";

import { useState, useEffect, useCallback } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";
import { useSocket } from "@/src/@core/hooks/useSocket";
import { QuestionResponseDto, QuestionStatusType } from "@/src/services/models/question/output.dto";
import { QuestionStatus } from "@/src/enums";
import { QuestionService } from "@/src/services/customer/question/question.service";
import UnifiedQuestionItem from "@/src/app/(customer)/products/[id]/components/UnifiedQuestionItem";
import SWTSpin from "@/src/@core/component/AntD/SWTSpin";

export default function AdminQuestionManagement({ 
  productId, 
  onDataUpdate 
}: { 
  productId: string,
  onDataUpdate?: () => void
}) {
  const [questions, setQuestions] = useState<QuestionResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const INITIAL_COUNT = 5;
  const { on, off } = useSocket(productId, "product");

  const fetchQuestions = useCallback(async () => {
    if (!productId) return;
    setIsLoading(true);
    try {
      const data = await QuestionService.getProductQuestions(productId);
      setQuestions(data || []);
    } catch (error) {
      console.error("Fetch questions error:", error);
    } finally {
      setIsLoading(false);
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
            if (item.replies) return { ...item, replies: insertReply(item.replies) };
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, fetchQuestions]); // Only re-run if productId or fetchQuestions changes

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
    <SWTSpin spinning={isLoading} tip="Đang tải dữ liệu...">
      <div className="flex flex-col gap-6 min-h-50">
        <div className="flex items-center mb-6">
          <HelpCircle size={16} className="text-brand-600"/>
          <h4 className="ml-2 mb-0! font-bold text-lg">Trung tâm Hỏi đáp ({questions.length})</h4>
        </div>

        <div className="flex flex-col gap-6">
          {questions.slice(0, isExpanded ? questions.length : INITIAL_COUNT).map(q => (
            <UnifiedQuestionItem 
              key={q.id} 
              question={q} 
              isAdminMode 
              onUpdateStatus={handleUpdateStatus} 
            />
          ))}
          {questions.length === 0 && !isLoading && (
               <div className="text-center py-20 bg-slate-50/50 rounded-[40px] border border-dashed border-slate-200 dark:border-slate-800 dark:bg-slate-800/50">
               <HelpCircle size={48} className="mx-auto text-slate-300 mb-4" />
               <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Chưa có câu hỏi nào từ khách hàng.</p>
            </div>
          )}
        </div>

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
      </div>
    </SWTSpin>
  );
}
