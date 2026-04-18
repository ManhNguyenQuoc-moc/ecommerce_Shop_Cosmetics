"use client";

import { useState } from "react";
import { User, Reply, Eye, EyeOff, BrainCircuit } from "lucide-react";
import { message, Rate, Typography } from "antd";
import { showNotificationSuccess, showNotificationError } from "@/src/@core/utils/message";
import { useAuth } from "@/src/context/AuthContext";
import { ReviewResponseDto } from "@/src/services/models/reviews/output.dto";
import { ReviewStatus } from "@/src/enums";
import { ReviewService } from "@/src/services/customer/review/review.service";

import SWTAvatar from "@/src/@core/component/AntD/SWTAvatar";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import SWTInput from "@/src/@core/component/AntD/SWTInput";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";
import SWTTag from "@/src/@core/component/AntD/SWTTag";

const { Paragraph } = Typography;

type Props = {
  review: ReviewResponseDto;
  depth?: number;
  isAdminMode?: boolean;
  onUpdateStatus?: (id: string, newStatus: ReviewStatus) => void;
};

const sentimentConfig: Record<string, { color: string, label: string }> = {
  POSITIVE: { color: "success", label: "Tích cực" },
  NEGATIVE: { color: "error", label: "Tiêu cực" },
  NEUTRAL: { color: "warning", label: "Trung bình" },
};

export default function UnifiedReviewItem({ 
  review, 
  depth = 0,
  isAdminMode = false,
  onUpdateStatus 
}: Props) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === "ADMIN";

  const handleReply = async () => {
    if (!replyContent.trim()) return;

    setIsSubmitting(true);
    try {
      await ReviewService.replyToReview(review.id, { comment: replyContent });
      message.success("Đã đăng phản hồi");
      setReplyContent("");
      setIsReplying(false);
    } catch (error) {
      message.error("Lỗi khi gửi phản hồi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!onUpdateStatus) return;
    
    setIsUpdatingStatus(true);
    const newStatus: ReviewStatus = (review.status === "ACTIVE" ? "HIDDEN" : "ACTIVE") as ReviewStatus;
    try {
      await ReviewService.updateReviewStatus(review.id, newStatus);
      onUpdateStatus(review.id, newStatus);
      showNotificationSuccess(newStatus === "HIDDEN" ? "Đã ẩn đánh giá thành công" : "Đánh giá đã hiển thị lại");
    } catch (error) {
      showNotificationError("Lỗi khi cập nhật trạng thái");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const isHidden = review.status === "HIDDEN";

  return (
    <div className={`mt-4 ${depth > 0 ? "ml-6 md:ml-12 border-l-2 border-slate-100 dark:border-slate-800 pl-4 md:pl-6" : ""}`}>
      <div className={`group relative flex gap-4 p-4 rounded-3xl transition-all ${
        isHidden ? "bg-slate-50/50 dark:bg-slate-900/30 opacity-70" : "hover:bg-slate-50 dark:hover:bg-slate-900/50"
      }`}>
        <div className="flex-shrink-0">
          <SWTAvatar 
            icon={<User size={depth === 0 ? 18 : 14} />} 
            src={review.userAvatar || undefined} 
            size={depth === 0 ? 44 : 32} 
            className={(review.userName === "Người dùng ẩn danh" || !review.userAvatar) ? "bg-slate-200 text-slate-500" : "bg-brand-500/10 text-brand-500"} 
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-black text-slate-800 dark:text-white text-sm">
                {(review.userName === "Admin" || review.userName === "ADMINISTRATOR") ? "Cửa hàng (Admin)" : review.userName}
              </span>
              
              {review.rating > 0 && (
                <Rate disabled value={review.rating} className="text-[10px] text-amber-500 flex items-center" />
              )}

              {isHidden && isAdminMode && (
                <SWTTag color="default" className="text-[8px] uppercase font-black tracking-widest m-0 px-2 leading-tight">Đã ẩn</SWTTag>
              )}

              {isAdminMode && review.sentiment && (
                <SWTTag 
                  icon={<BrainCircuit size={10} />} 
                  color={sentimentConfig[review.sentiment]?.color} 
                  className="rounded-full font-black uppercase tracking-widest text-[8px] flex items-center gap-1 m-0 px-2 py-0.5 border-none shadow-sm"
                >
                  AI: {sentimentConfig[review.sentiment]?.label}
                </SWTTag>
              )}

              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                {new Date(review.createdAt).toLocaleDateString("vi-VN")}
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              {isAdmin && (
                <>
                  <SWTTooltip title={review.status === "ACTIVE" ? "Ẩn đánh giá này" : "Hiện lại"}>
                        <SWTButton 
                            shape="circle"
                            variant="text"
                            icon={review.status === "ACTIVE" ? <Eye size={18} /> : <EyeOff size={18} />}
                            onClick={handleToggleStatus}
                            loading={isUpdatingStatus}
                            className={`!w-10 !h-10 !p-0 !bg-transparent hover:!bg-transparent !border-none flex items-center justify-center transition-all ${
                                isAdminMode ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                            } ${review.status === "ACTIVE" ? "text-slate-400 hover:text-red-500" : "text-brand-500"}`}
                        />
                  </SWTTooltip>
                    <SWTButton 
                      variant="text" 
                      icon={<Reply size={14} />} 
                      onClick={() => setIsReplying(!isReplying)}
                      className={`!w-auto !h-auto !bg-transparent hover:!bg-transparent !border-none text-slate-400 hover:text-brand-500 font-black text-[10px] tracking-widest uppercase rounded-lg transition-opacity ${isAdminMode ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                    >
                      Phản hồi
                    </SWTButton>
                </>
              )}
            </div>
          </div>
          
          <p className={`text-slate-700 dark:text-slate-200 leading-relaxed font-medium ${depth > 0 ? "text-xs italic bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-800" : "text-sm"}`}>
            {review.comment || "Không có nội dung."}
          </p>

          {/* Reply Form */}
          {isReplying && (
            <div className="mt-4 p-4 rounded-2xl bg-brand-500/5 border border-brand-500/10 animate-slide-down">
              <SWTInput.TextArea
                rows={2}
                placeholder={`Phản hồi cho ${review.userName}...`}
                value={replyContent}
                autoFocus
                onChange={(e) => setReplyContent(e.target.value)}
                className="mb-3 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
              />
              <div className="flex justify-end gap-2">
                <SWTButton size="sm" onClick={() => setIsReplying(false)} className="!w-auto !h-8 rounded-lg font-bold text-xs uppercase">Hủy</SWTButton>
                <SWTButton 
                  size="sm"
                  type="primary" 
                  loading={isSubmitting}
                  onClick={handleReply}
                  className="!w-auto !h-8 bg-brand-600 hover:bg-brand-700 rounded-lg font-black text-[10px] uppercase tracking-widest px-4"
                >
                  Gửi ngay
                </SWTButton>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recursive Replies */}
      {review.replies && review.replies.length > 0 && (
        <div className="space-y-2">
          {review.replies.map((reply: ReviewResponseDto) => (
            <UnifiedReviewItem 
              key={reply.id} 
              review={reply} 
              depth={depth + 1} 
              isAdminMode={isAdminMode}
              onUpdateStatus={onUpdateStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}
