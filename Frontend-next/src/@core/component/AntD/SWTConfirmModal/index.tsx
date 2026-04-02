"use client";

import { AlertTriangle, HelpCircle, Info, Trash2 } from "lucide-react";
import SWTModal from "../SWTModal";

export type SWTConfirmVariant = "danger" | "warning" | "info";

export interface SWTConfirmModalProps {
  open: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  variant?: SWTConfirmVariant;
  children?: React.ReactNode;
}

const variantConfig: Record<
  SWTConfirmVariant,
  {
    iconBg: string;
    iconColor: string;
    Icon: React.ElementType;
    confirmBtn: string;
  }
> = {
danger: {
    iconBg: "bg-red-100 dark:bg-red-500/20",
    iconColor: "text-red-500 dark:text-red-400",
    Icon: Trash2,
    confirmBtn:
      "bg-red-500 hover:bg-red-600 active:bg-red-700 text-white shadow-md shadow-red-500/30",
  },

  warning: {
    iconBg: "bg-amber-100 dark:bg-amber-500/20",
    iconColor: "text-amber-500 dark:text-amber-400",
    Icon: AlertTriangle,
    confirmBtn:
      "bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white shadow-md shadow-amber-500/30",
  },

  info: {
    iconBg: "bg-pink-100 dark:bg-pink-500/20",
    iconColor: "text-pink-500 dark:text-pink-400",
    Icon: HelpCircle,
    confirmBtn:
      "bg-pink-500 hover:bg-pink-600 active:bg-pink-700 text-white shadow-md shadow-pink-500/30",
  },
};

export default function SWTConfirmModal({
  open,
  onConfirm,
  onCancel,
  title = "Bạn có chắc chắn?",
  description,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  loading = false,
  variant = "danger",
  children,
}: SWTConfirmModalProps) {
  const cfg = variantConfig[variant];
  const Icon = cfg.Icon;

  return (
    <SWTModal
      open={open}
      onCancel={onCancel}
      footer={null}
      closable={!loading}
      maskClosable={!loading}
      mask={true}
      width={420}
      centered
      zIndex={2000}
       className="
    [&_.ant-modal-content]:!p-0
    [&_.ant-modal-content]:!overflow-hidden
    [&_.ant-modal-content]:!rounded-2xl
    [&_.ant-modal-body]:!p-0
  "
    >
      <div className="p-7">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${cfg.iconBg}`}>
          <Icon size={24} className={cfg.iconColor} strokeWidth={2.5} />
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2 leading-snug">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-1">
            {description}
          </p>
        )}

        {children && <div className="mt-3">{children}</div>}
      </div>
      <div className="flex justify-end gap-3 px-7 py-5 border-t">
        <button
          onClick={onCancel}
          disabled={loading}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 flex items-center gap-2 disabled:opacity-60 cursor-pointer ${cfg.confirmBtn}`}
        >
          {loading && (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          )}
          {confirmText}
        </button>
      </div>
    </SWTModal>
  );
}
