"use client";

import React from "react";

type SWTSkeletonProps = {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
};

/**
 * Reusable Shimmering Skeleton for loading states
 */
export default function SWTSkeleton({
  className = "",
  width,
  height,
  rounded = "md",
}: SWTSkeletonProps) {
  const roundedClass = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    "3xl": "rounded-3xl",
    full: "rounded-full",
  }[rounded];

  return (
    <div
      className={`relative overflow-hidden bg-gray-200 ${roundedClass} ${className} animate-pulse`}
      style={{
        width,
        height,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] animate-shimmer" />
    </div>
  );
}

// Add shimmer animation to globals.css if not present
// @keyframes shimmer {
//   100% { transform: translateX(100%); }
// }
// .animate-shimmer {
//   animation: shimmer 1.5s infinite;
// }
