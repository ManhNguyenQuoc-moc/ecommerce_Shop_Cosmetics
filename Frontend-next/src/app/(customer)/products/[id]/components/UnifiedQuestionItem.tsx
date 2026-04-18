"use client";

import { useState } from "react";
import { User, Reply, Eye, EyeOff } from "lucide-react";
import { message } from "antd";
import { showNotificationSuccess, showNotificationError } from "@/src/@core/utils/message";
import { useAuth } from "@/src/context/AuthContext";
import { QuestionResponseDto, QuestionStatusType } from "@/src/services/models/question/output.dto";
import { QuestionStatus } from "@/src/enums";
import { QuestionService } from "@/src/services/customer/question/question.service";

import SWTAvatar from "@/src/@core/component/AntD/SWTAvatar";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import SWTInput from "@/src/@core/component/AntD/SWTInput";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";
import SWTTag from "@/src/@core/component/AntD/SWTTag";

type Props = {
  question: QuestionResponseDto;
  depth?: number;
  isAdminMode?: boolean;
  onUpdateStatus?: (id: string, newStatus: QuestionStatusType) => void;
};

export default function UnifiedQuestionItem({
  question,
  depth = 0,
  isAdminMode = false,
  onUpdateStatus
}: Props) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === "ADMIN";

  const handleReply = async () => {
    if (!replyText.trim()) return;

    setIsSubmitting(true);
    try {
      console.log("[DEBUG] Submitting reply...");
      await QuestionService.replyToQuestion(question.id, { content: replyText });
      console.log("[DEBUG] Reply submitted successfully");
      message.success("Đã gửi phản hồi");
      setReplyText("");
      setIsReplying(false);
    } catch (error) {
      console.error("[DEBUG] Reply submit error:", error);
      message.error("Gửi phản hồi thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!onUpdateStatus) return;

    setIsUpdatingStatus(true);
    const newStatus: QuestionStatus = (question.status === "ACTIVE" ? "HIDDEN" : "ACTIVE") as QuestionStatus;
    try {
      await QuestionService.updateQuestionStatus(question.id, newStatus);
      onUpdateStatus(question.id, newStatus);
      showNotificationSuccess(newStatus === "HIDDEN" ? "Đã ẩn nội dung thành công" : "Nội dung đã hiển thị lại");
    } catch (error) {
      showNotificationError("Cập nhật trạng thái thất bại");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const isHidden = question.status === "HIDDEN";

  return (
    <div className={`mt-4 ${depth > 0 ? "ml-6 md:ml-12 border-l-2 border-slate-100 dark:border-slate-800 pl-4 md:pl-6" : ""}`}>
      <div className={`group relative flex gap-4 p-4 rounded-3xl transition-all ${isHidden ? "bg-slate-50/50 dark:bg-slate-900/30 opacity-70" : "hover:bg-slate-50 dark:hover:bg-slate-900/50"
        }`}>
        <div className="flex-shrink-0">
          <SWTAvatar
            icon={<User size={depth === 0 ? 18 : 14} />}
            src={question.userAvatar || undefined}
            size={depth === 0 ? 44 : 32}
            className={(question.userName === "Người dùng ẩn danh" || !question.userAvatar) ? "bg-slate-200 text-slate-500" : "bg-brand-500/10 text-brand-500"}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2">
              <span className="font-black text-slate-800 dark:text-white text-sm">
                {(question.userName === "Admin" || question.userName === "ADMINISTRATOR") ? "Cửa hàng (Admin)" : question.userName}
              </span>
              {isHidden && isAdminMode && (
                <SWTTag color="default" className="text-[8px] uppercase font-black tracking-widest m-0 px-2 leading-tight">Đã ẩn</SWTTag>
              )}
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                {new Date(question.createdAt).toLocaleDateString("vi-VN")}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {isAdmin && (
                <>
                  <SWTTooltip title={question.status === "ACTIVE" ? "Ẩn câu hỏi này" : "Hiện lại"}>
                    <SWTButton
                      variant="text"
                      shape="circle"
                      icon={question.status === "ACTIVE" ? <Eye size={18} /> : <EyeOff size={18} />}
                      onClick={handleToggleStatus}
                      loading={isUpdatingStatus}
                      className={`!w-10 !h-10 !p-0 !bg-transparent hover:!bg-transparent !border-none flex items-center justify-center transition-opacity ${isAdminMode ? "opacity-100" : "opacity-0 group-hover:opacity-100"} ${question.status === "ACTIVE" ? "text-slate-300 hover:text-red-500" : "text-brand-500"
                        }`}
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

          <p className={`text-slate-700 dark:text-slate-200 leading-relaxed font-medium ${depth > 0 ? "text-xs italic" : "text-sm"}`}>
            {question.content}
          </p>

          {/* Reply Form */}
          {isReplying && (
            <div className="mt-4 p-4 rounded-2xl bg-brand-500/5 border border-brand-500/10 animate-slide-down">
              <SWTInput.TextArea
                rows={2}
                placeholder={`Phản hồi cho ${question.userName}...`}
                value={replyText}
                autoFocus
                onChange={(e) => setReplyText(e.target.value)}
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
      {question.replies && question.replies.length > 0 && (
        <div className="space-y-2">
          {question.replies.map(reply => (
            <UnifiedQuestionItem
              key={reply.id}
              question={reply}
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
