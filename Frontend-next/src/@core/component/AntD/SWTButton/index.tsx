import { Button, ButtonProps } from "antd";

type SWTButtonProps = Omit<ButtonProps, "size" | "type"> & {
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "outline" | "ghost";
  
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
};

const SWTButton = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
  ...props
}: SWTButtonProps) => {

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const variantClasses = {
    primary: "!bg-brand-500 !text-white hover:!bg-brand-600",
    outline: "!border !border-brand-500 !text-brand-500 hover:!bg-brand-50",
    ghost: "!bg-transparent !text-brand-500 hover:!bg-brand-50 !shadow-none",
  };

  return (
    <Button
      className={`
        inline-flex items-center justify-center
        gap-2 rounded-lg font-medium transition
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${disabled ? "cursor-not-allowed opacity-50" : ""}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </Button>
  );
};

export default SWTButton; 