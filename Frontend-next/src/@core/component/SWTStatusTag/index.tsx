import React from "react";

export type SWTStatusTagVariant = "ACTIVE" | "HIDDEN" | "STOPPED" | "BEST_SELLING" | "TRENDING" | "NEW" | "CUSTOM";

interface SWTStatusTagProps {
  status?: string;       // Preset như 'ACTIVE', 'HIDDEN' v.v..
  label?: string;  
  color?: string;        // Màu chữ tailwind class hoặc HEX (VD: 'text-blue-500' hoặc '#3b82f6')
  bgColor?: string;      // Màu nền tailwind class hoặc HEX (VD: 'bg-blue-100' hoặc '#eeefff')
  dotColor?: string;     // Màu dấu chấm tròn tailwind class bg- hoặc HEX
  className?: string;    // Override class bổ sung
}

const tagConfig: Record<string, { label: string; color: string; dot: string }> = {
  ACTIVE: {
    label: "Đang kinh doanh",
    color: "bg-status-success-bg text-status-success-text border-status-success-border",
    dot: "bg-status-success-text",
  },
  BANNED: {
    label: "Bị khóa",
    color: "bg-status-error-bg text-status-error-text border-status-error-border",
    dot: "bg-status-error-text",
  },
  HIDDEN: {
    label: "Đang ẩn",
    color: "bg-status-warning-bg text-status-warning-text border-status-warning-border",
    dot: "bg-status-warning-text",
  },
  STOPPED: {
    label: "Hết hàng",
    color: "bg-status-error-bg text-status-error-text border-status-error-border",
    dot: "bg-status-error-text",
  },
  BEST_SELLING: {
    label: "Bán chạy",
    color: "bg-status-error-bg text-status-error-text border-status-error-border",
    dot: "bg-status-error-text",
  },
  TRENDING: {
    label: "Xu hướng",
    color: "bg-status-info-bg text-status-info-text border-status-info-border",
    dot: "bg-status-info-text",
  },
  NEW: {
    label: "Mới ra mắt",
    color: "bg-status-success-bg text-status-success-text border-status-success-border",
    dot: "bg-status-success-text",
  },
  // --- Order Statuses ---
  PENDING: {
    label: "Chờ xác nhận",
    color: "bg-status-info-bg text-status-info-text border-status-info-border",
    dot: "bg-status-info-text",
  },
  CONFIRMED: {
    label: "Đã xác nhận",
    color: "bg-status-warning-bg text-status-warning-text border-status-warning-border",
    dot: "bg-status-warning-text",
  },
  SHIPPING: {
    label: "Đang giao hàng",
    color: "bg-status-info-bg text-status-info-text border-status-info-border",
    dot: "bg-status-info-text",
  },
  DELIVERED: {
    label: "Hoàn tất",
    color: "bg-status-success-bg text-status-success-text border-status-success-border",
    dot: "bg-status-success-text",
  },
  CANCELLED: {
    label: "Đã hủy",
    color: "bg-status-error-bg text-status-error-text border-status-error-border",
    dot: "bg-status-error-text",
  },
  RETURNED: {
    label: "Trả hàng",
    color: "bg-status-error-bg text-status-error-text border-status-error-border",
    dot: "bg-status-error-text",
  },
  // --- Payment Statuses ---
  PAID: {
    label: "Đã thanh toán",
    color: "bg-status-success-bg text-status-success-text border-status-success-border",
    dot: "bg-status-success-text",
  },
  UNPAID: {
    label: "Chưa thanh toán",
    color: "bg-status-warning-bg text-status-warning-text border-status-warning-border",
    dot: "bg-status-warning-text",
  },
};

const SWTStatusTag: React.FC<SWTStatusTagProps> = ({ 
  status, 
  label, 
  bgColor, 
  dotColor, 
  className = "" 
}) => {
  const isCustomMode = status === "CUSTOM" || (!status && label);
  const config = tagConfig[status || ""] || {
    label: status || "N/A",
    color: "bg-status-neutral-bg text-status-neutral-text border-status-neutral-border",
    dot: "bg-status-neutral-text",
  };

  const finalLabel = label || config.label;
  
  // Xử lý Inline Style (nếu truyền mã HEX/RGB) vs Tailwind class
  const isInlineValue = (val: string) => val.startsWith("#") || val.startsWith("rgb");

  const inlineStyles: React.CSSProperties = {};
  if (bgColor && isInlineValue(bgColor)) {
    inlineStyles.backgroundColor = bgColor;
  }

  const dotStyles: React.CSSProperties = {};
  if (dotColor && isInlineValue(dotColor)) {
    dotStyles.backgroundColor = dotColor;
  }

  const twBgClass = bgColor && !isInlineValue(bgColor) ? bgColor : "";
  const twDotClass = dotColor && !isInlineValue(dotColor) ? dotColor : "";

  // Tổ hợp class custom
  const tagColorClass = isCustomMode 
    ? `border ${twBgClass}`.trim() 
    : `${config.color} ${twBgClass}`.trim();

  // Pulse animation cho dot
  const hasPulse = !isCustomMode || dotColor;
  const dotColorClass = twDotClass || (!isCustomMode ? config.dot : "bg-slate-400");
  const finalDotClass = `w-1.5 h-1.5 rounded-full ${hasPulse ? "animate-pulse" : ""} ${dotColorClass}`.trim();

  return (
    <div 
      className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1.5 w-max shadow-sm transition-all ${tagColorClass} ${className}`}
      style={inlineStyles}
    >
      <span className={finalDotClass} style={dotStyles} />
      {finalLabel}
    </div>
  );
};

export default SWTStatusTag;
