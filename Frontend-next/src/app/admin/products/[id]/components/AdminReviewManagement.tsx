"use client";

import { useState, useEffect, useCallback } from "react";
import { MessageSquare, ChevronDown } from "lucide-react";
import { ReviewResponseDto, ReviewStatusType } from "@/src/services/models/reviews/output.dto";
import { ReviewStatus } from "@/src/enums";
import { useSocket } from "@/src/@core/hooks/useSocket";
import { ReviewService } from "@/src/services/customer/review/review.service";
import UnifiedReviewItem from "@/src/app/(customer)/products/[id]/components/UnifiedReviewItem";
import SWTSpin from "@/src/@core/component/AntD/SWTSpin";

export default function AdminReviewManagement({ 
  productId,
  onDataUpdate 
}: { 
  productId: string,
  onDataUpdate?: () => void
}) {
  const [reviews, setReviews] = useState<ReviewResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const INITIAL_COUNT = 5;
  const { on, off } = useSocket(productId, "product");

  const fetchReviews = useCallback(async () => {
    if (!productId) return;
    setIsLoading(true);
    try {
      const data = await ReviewService.getProductReviews(productId);
      setReviews(data || []);
    } catch (error) {
      console.error("Fetch reviews error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
    
    on("new_review", (review: ReviewResponseDto) => {
      setReviews(prev => {
        if (prev.some(r => r.id === review.id)) return prev;
        return [review, ...prev];
      });
    });

    on("new_reply", (reply: ReviewResponseDto) => {
      setReviews(prev => prev.map(r => {
        if (r.id === reply.parentId) {
          const alreadyExists = r.replies?.some((rep: ReviewResponseDto) => rep.id === reply.id);
          if (alreadyExists) return r;
          return { ...r, replies: [...(r.replies || []), reply] };
        }
        return r;
      }));
    });

    return () => {
      off("new_review");
      off("new_reply");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, fetchReviews]); // Minimal dependencies

  const handleUpdateStatus = (id: string, newStatus: ReviewStatusType) => {
      setReviews(prev => prev.map(r => r.id === id ? { ...r, status: newStatus as ReviewStatus } : r));
  };

  return (
    <SWTSpin spinning={isLoading} tip="Đang tải dữ liệu...">
      <div className="flex flex-col gap-6 min-h-50">
         <div className="flex items-center mb-6">
               <MessageSquare size={16} className="text-brand-600"/>
              <h4 className="ml-2 mb-0! font-bold text-lg">Quản lý Đánh giá ({reviews.length})</h4>
        </div>
        <div className="flex flex-col gap-6">
          {reviews.slice(0, isExpanded ? reviews.length : INITIAL_COUNT).map((review) => (
             <UnifiedReviewItem 
                key={review.id} 
                review={review} 
                isAdminMode 
                onUpdateStatus={handleUpdateStatus} 
             />
          ))}
          {reviews.length === 0 && !isLoading && (
            <div className="text-center py-20 bg-slate-50/50 rounded-[40px] border border-dashed border-slate-200 dark:border-slate-800 dark:bg-slate-800/50">
               <MessageSquare size={48} className="mx-auto text-slate-300 mb-4" />
               <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Chưa có đánh giá nào từ khách hàng.</p>
            </div>
          )}
        </div>

        {reviews.length > INITIAL_COUNT && (
          <div className="text-center pt-8">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="group w-full flex items-center justify-center gap-2 text-brand-600 hover:text-brand-700 font-bold py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300"
            >
              {isExpanded ? (
                <>
                  Ẩn bớt đánh giá
                  <ChevronDown size={18} className="rotate-180 transition-transform duration-300" />
                </>
              ) : (
                <>
                  Xem thêm {reviews.length - INITIAL_COUNT} đánh giá
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
