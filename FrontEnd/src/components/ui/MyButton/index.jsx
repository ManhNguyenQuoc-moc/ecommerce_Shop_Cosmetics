import React from "react";

export default function MyButton({
    children,
    size = "md",
    variant = "primary",
    startIcon,
    endIcon,
    onClick,
    className = "",
    disabled = false,
    ...props
}) {
    const sizeClasses = {
        sm: "px-4 py-2.5 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
    };
    const variantClasses = {
        primary:
            "bg-brand-500 text-white shadow-brand-200 hover:bg-brand-400 active:scale-95",
        outline:
            "bg-transparent text-brand-500 border border-brand-500 hover:bg-brand-50 hover:text-brand-600 active:bg-brand-100 active:scale-95",
    };
    const baseClasses = "inline-flex items-center justify-center font-medium rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
    const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={combinedClasses}
            {...props}
        >
            {startIcon && <span className="mr-2">{startIcon}</span>}
            {children}
            {endIcon && <span className="ml-2">{endIcon}</span>}
        </button>
    );
}