import { Button, ButtonProps } from "antd";

type SWTButtonProps = Omit<ButtonProps, "size"> & {
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  intent?: "primary" | "outline" | "ghost";
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
};

const sizeClasses = {
  sm: "px-4 py-3 text-sm",
  md: "px-5 py-3.5 text-sm",
  lg: "px-6 py-4 text-base",
} as const;

const SWTButton = ({
  children,
  size = "md",
  startIcon,
  endIcon,
  className = "",
  disabled = false,
  ...props
}: SWTButtonProps) => {

  return (
    <Button
      {...props}
      variant={props.variant ?? "solid"}
      disabled={disabled}
      className={`
        px-4 py-5
        text-gray-500
        inline-flex items-center justify-center
        font-medium gap-2 rounded-lg transition
        ${sizeClasses[size]}
        ${disabled ? "cursor-not-allowed opacity-50" : ""}
        ${className}
      `}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </Button>
  );
};

export default SWTButton;