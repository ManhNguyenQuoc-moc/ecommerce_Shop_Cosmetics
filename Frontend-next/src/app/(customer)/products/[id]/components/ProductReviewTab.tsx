"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Star, MessageSquare, Send, ChevronDown, ChevronUp } from "lucide-react";
import { Rate, message } from "antd";
import { useSocket } from "@/src/@core/hooks/useSocket";
import { useAuth } from "@/src/context/AuthContext";
import { ReviewResponseDto } from "@/src/services/models/reviews/output.dto";
import { ReviewStatus } from "@/src/enums";
import { ReviewService } from "@/src/services/customer/review/review.service";
import UnifiedReviewItem from "./UnifiedReviewItem";

import SWTButton from "@/src/@core/component/AntD/SWTButton";
import SWTInput from "@/src/@core/component/AntD/SWTInput";
import SWTDivider from "@/src/@core/component/AntD/SWTDivider";

type Props = {
  productId: string;
  initialRating: number;
  initialReviewCount: number;
};

export default function ProductReviewTab({ productId, initialRating, initialReviewCount }: Props) {
  const [reviews, setReviews] = useState<ReviewResponseDto[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [isExpanded, setIsExpanded] = useState(false);
  const INITIAL_COUNT = 5;

  const { currentUser } = useAuth();
  const { on, off } = useSocket(productId, "product");

  // Calculate stats from current state to keep it updated real-time
  const stats = useMemo(() => {
    if (reviews.length === 0) return { rating: initialRating, count: initialReviewCount };
    const topLevel = reviews.filter(r => !r.parentId);
    if (topLevel.length === 0) return { rating: initialRating, count: initialReviewCount };
    const avg = topLevel.reduce((sum, r) => sum + r.rating, 0) / topLevel.length;
    return { rating: Number(avg.toFixed(1)), count: topLevel.length };
  }, [reviews, initialRating, initialReviewCount]);

  const fetchReviews = useCallback(async () => {
    try {
      const data = await ReviewService.getProductReviews(productId);
      setReviews(data);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
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
  }, [productId, on, off, fetchReviews]);

  const handleSubmit = async () => {
    if (!currentUser) {
      message.warning("Vui lòng đăng nhập để gửi đánh giá");
      return;
    }
    if (!newComment.trim()) {
      message.error("Vui lòng nhập nội dung đánh giá");
      return;
    }

    setIsSubmitting(true);
    try {
      await ReviewService.createReview({
        productId,
        rating: newRating,
        comment: newComment
      });
      message.success("Cảm ơn bạn đã đánh giá!");
      setNewComment("");
      setNewRating(5);
    } catch (error: any) {
      message.error(error.response?.data?.message || "Gửi đánh giá thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = (id: string, newStatus: ReviewStatus) => {
      setReviews(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  return (
    <div className="space-y-12">
      {/* Review Summary & Form */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
        <div className="md:col-span-4 bg-slate-50/50 dark:bg-slate-900/50 p-8 rounded-[32px] text-center border border-slate-100 dark:border-slate-800 shadow-inner">
          <h4 className="text-5xl font-black text-slate-800 dark:text-white mb-2">{stats.rating}</h4>
          <Rate disabled value={stats.rating} allowHalf className="text-amber-500 mb-4 scale-125 origin-center" />
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-4">Dựa trên {stats.count} lượt đánh giá</p>
        </div>

        <div className="md:col-span-8 space-y-6">
          <div className="flex items-center gap-3">
           
             <h4 className="font-black text-xl text-slate-800 dark:text-white m-0 uppercase tracking-tight">Viết đánh giá của bạn</h4>
          </div>
          
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 shadow-xl shadow-brand-500/5">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm font-black text-slate-400 uppercase tracking-wider">Xếp hạng:</span>
              <Rate value={newRating} onChange={setNewRating} className="text-amber-500" />
            </div>
            <SWTInput.TextArea
              rows={3}
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
              value={newComment}
              showCount ={false}
              onChange={(e) => setNewComment(e.target.value)}
              className="!mb-4 !rounded-2xl !border-slate-100 !dark:border-slate-800 !bg-slate-50 !dark:bg-slate-800/50 !hover:bg-white !dark:hover:bg-slate-800 !transition-all !p-4 !text-slate-700 !dark:text-slate-200"
            />
            <SWTButton
              variant="solid"
              icon={<Send size={18} />}
              loading={isSubmitting}
              onClick={handleSubmit}
              className="!w-auto !bg-brand-600 !hover:bg-brand-700 !text-white !h-12 !px-8 !rounded-2xl !font-black uppercase tracking-widest !text-sm !shadow-lg !shadow-brand-500/20"
            >
              Đánh giá
            </SWTButton>
          </div>
        </div>
      </div>

      <SWTDivider className="border-slate-100 dark:border-slate-800" />

      {/* Review List */}
      <div className="space-y-8">
        <div className="flex items-center justify-between px-2">
          <h4 className="font-black text-2xl text-slate-800 dark:text-white flex items-center gap-3 m-0">

            Các đánh giá của sản phẩm ({reviews.length})
          </h4>
        </div>

        <div className="space-y-6">
          {reviews.slice(0, isExpanded ? reviews.length : INITIAL_COUNT).map((review) => (
             <UnifiedReviewItem 
                key={review.id} 
                review={review} 
                onUpdateStatus={handleUpdateStatus}
             />
          ))}
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
    </div>
  );
}
