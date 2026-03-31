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
  /** Extra content rendered below the description */
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
    iconBg: "bg-brand-100 dark:bg-brand-500/20",
    iconColor: "text-brand-600 dark:text-brand-400",
    Icon: HelpCircle,
    confirmBtn:
      "bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white shadow-md shadow-brand-500/30",
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
      width={420}
      centered
      className="[&_.ant-modal-content]:!p-0 [&_.ant-modal-content]:!overflow-hidden [&_.ant-modal-body]:!p-0"
    >
      <div className="p-7">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${cfg.iconBg}`}>
          <Icon size={24} className={cfg.iconColor} strokeWidth={2.5} />
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2 leading-snug">
          {title}
        </h2>

        {/* Description */}
        {description && (
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-1">
            {description}
          </p>
        )}

        {/* Extra slot */}
        {children && <div className="mt-3">{children}</div>}
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 px-7 py-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40">
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
