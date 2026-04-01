import React from "react";

export type SWTStatusTagVariant = "ACTIVE" | "HIDDEN" | "STOPPED" | "BEST_SELLING" | "TRENDING" | "NEW" | "CUSTOM";

interface SWTStatusTagProps {
  status?: string;       // Preset như 'ACTIVE', 'HIDDEN' v.v..
  label?: string;        // Text hiển thị (Ghi đè preset hoặc dùng cho chế độ CUSTOM)
  color?: string;        // Màu chữ/viền tailwind class hoặc HEX (VD: 'text-blue-500' hoặc '#0000ff')
  bgColor?: string;      // Màu nền tailwind class hoặc HEX (VD: 'bg-blue-100' hoặc '#eeefff')
  dotColor?: string;     // Màu dấu chấm tròn tailwind class bg- hoặc HEX
  className?: string;    // Override class bổ sung
}

const tagConfig: Record<string, { label: string; color: string; dot: string }> = {
  ACTIVE: {
    label: "Đang kinh doanh",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:border-emerald-500/30",
    dot: "bg-emerald-500",
  },
  HIDDEN: {
    label: "Đang ẩn",
    color: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-400 dark:border-amber-500/30",
    dot: "bg-amber-500",
  },
  STOPPED: {
    label: "Hết hàng",
    color: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-500 dark:border-red-500/30",
    dot: "bg-red-500",
  },
  BEST_SELLING: {
    label: "Bán chạy",
    color: "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/40 dark:text-rose-400 dark:border-rose-500/30",
    dot: "bg-rose-500",
  },
  TRENDING: {
    label: "Xu hướng",
    color: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-400 dark:border-blue-500/30",
    dot: "bg-blue-500",
  },
  NEW: {
    label: "Mới ra mắt",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:border-emerald-500/30",
    dot: "bg-emerald-500",
  },
};

const SWTStatusTag: React.FC<SWTStatusTagProps> = ({ 
  status, 
  label, 
  color, 
  bgColor, 
  dotColor, 
  className = "" 
}) => {
  const isCustomMode = status === "CUSTOM" || (!status && label);
  const config = tagConfig[status || ""] || {
    label: status || "N/A",
    color: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700",
    dot: "bg-slate-500",
  };

  const finalLabel = label || config.label;
  
  // Xử lý Inline Style (nếu truyền mã HEX/RGB) vs Tailwind class
  const isInlineValue = (val: string) => val.startsWith("#") || val.startsWith("rgb");

  const inlineStyles: React.CSSProperties = {};
  if (color && isInlineValue(color)) {
    inlineStyles.color = color;
    inlineStyles.borderColor = color;
  }
  if (bgColor && isInlineValue(bgColor)) {
    inlineStyles.backgroundColor = bgColor;
  }

  const dotStyles: React.CSSProperties = {};
  if (dotColor && isInlineValue(dotColor)) {
    dotStyles.backgroundColor = dotColor;
  }

  // Nối các Tailwind class name nếu prop truyền vào không phải hex inline
  const twColorClass = color && !isInlineValue(color) ? color : "";
  const twBgClass = bgColor && !isInlineValue(bgColor) ? bgColor : "";
  const twDotClass = dotColor && !isInlineValue(dotColor) ? dotColor : "";

  // Tổ hợp class custom
  const tagColorClass = isCustomMode 
    ? `border ${twColorClass} ${twBgClass}`.trim() 
    : `${config.color} ${twColorClass} ${twBgClass}`.trim();

  // Pulse animation cho dot
  const hasPulse = !isCustomMode || dotColor;
  const dotColorClass = twDotClass || (!isCustomMode ? config.dot : "bg-slate-400");
  const finalDotClass = `w-1.5 h-1.5 rounded-full ${hasPulse ? "animate-pulse" : ""} ${dotColorClass}`.trim();

  return (
    <div 
      className={`text-[11px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1.5 w-max shadow-sm ${tagColorClass} ${className}`}
      style={inlineStyles}
    >
      <span className={finalDotClass} style={dotStyles} />
      {finalLabel}
    </div>
  );
};

export default SWTStatusTag;
