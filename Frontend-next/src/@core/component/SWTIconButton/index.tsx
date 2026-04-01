import React from "react";
import Link from "next/link";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";

export type SWTIconButtonVariant = "view" | "edit" | "restore" | "delete" | "hide" | "danger" | "disabled" | "custom";

interface SWTIconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'title' | 'color'> {
  icon?: React.ReactNode;
  variant?: SWTIconButtonVariant;
  tooltip?: string;
  tooltipColor?: string; // Tùy chọn để ghi đè màu tooltip riêng (VD: '#ff0000')
  iconColor?: string;    // Tùy chọn ghi đè màu icon bằng HEX/RGB (VD: '#00ff00'). Nếu dùng Tailwind class thì nên truyền qua className
  href?: string;
}

const variantStyles: Record<SWTIconButtonVariant, { buttonClass: string; tooltipColor: string }> = {
  view: {
    buttonClass: "text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-500/10 border-transparent hover:border-blue-100 dark:hover:border-blue-500/20",
    tooltipColor: "#3b82f6", // blue-500
  },
  edit: {
    buttonClass: "text-fuchsia-600 hover:text-fuchsia-800 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-500/10 border-transparent hover:border-fuchsia-100 dark:hover:border-fuchsia-500/20",
    tooltipColor: "#ec4899", // fuchsia-500
  },
  restore: {
    buttonClass: "text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 border-transparent hover:border-emerald-100 dark:hover:border-emerald-500/20",
    tooltipColor: "#10b981", // emerald-500
  },
  hide: {
    buttonClass: "text-amber-500 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-500/10 border-transparent hover:border-amber-100 dark:hover:border-amber-500/20",
    tooltipColor: "#f59e0b", // amber-500
  },
  delete: {
    buttonClass: "text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10 border-transparent hover:border-red-100 dark:hover:border-red-500/20",
    tooltipColor: "#ef4444", // red-500
  },
  danger: {
    buttonClass: "text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10 border-transparent hover:border-red-100 dark:hover:border-red-500/20",
    tooltipColor: "#ef4444", // red-500
  },
  disabled: {
    buttonClass: "text-slate-300 dark:text-slate-600 border-transparent cursor-not-allowed",
    tooltipColor: "#64748b", // slate-500
  },
  custom: {
    buttonClass: "border-transparent",
    tooltipColor: "#333333",
  }
};

const SWTIconButton: React.FC<SWTIconButtonProps> = ({
  icon,
  variant = "view",
  tooltip,
  tooltipColor,
  iconColor,
  href,
  className = "",
  disabled,
  style,
  ...props
}) => {
  const isActuallyDisabled = disabled || variant === "disabled";
  const v = variantStyles[isActuallyDisabled ? "disabled" : variant] || variantStyles.view;

  const baseClass = "transition-colors p-1.5 rounded-lg border flex items-center justify-center";
  const buttonClass = `${baseClass} ${v.buttonClass} ${isActuallyDisabled ? "cursor-not-allowed" : "cursor-pointer"} ${className}`;

  let buttonContent = (
    <button 
      className={buttonClass} 
      disabled={isActuallyDisabled} 
      style={{ ...style, ...(iconColor && !isActuallyDisabled ? { color: iconColor } : {}) }}
      {...props}
    >
      {icon}
    </button>
  );

  if (href && !isActuallyDisabled) {
    // Tránh thẻ Link làm mất đi styling của icon khi được bao bọc
    buttonContent = <Link href={href} className={isActuallyDisabled ? "pointer-events-none" : ""}>{buttonContent}</Link>;
  }

  if (tooltip) {
    return (
      <SWTTooltip title={tooltip} color={tooltipColor || (isActuallyDisabled && tooltipColor ? tooltipColor : v.tooltipColor)}>
        {buttonContent}
      </SWTTooltip>
    );
  }

  return buttonContent;
};

export default SWTIconButton;
