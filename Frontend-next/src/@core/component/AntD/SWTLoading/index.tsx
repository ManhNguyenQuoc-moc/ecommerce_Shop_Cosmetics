import { Spin } from "antd";
import React from "react";

interface SWTLoadingProps {
  tip?: string;
  className?: string;
  fullPage?: boolean;
}

const SWTLoading: React.FC<SWTLoadingProps> = ({ 
  tip = "Đang tải dữ liệu...", 
  className = "", 
  fullPage = false 
}) => {
  const containerClasses = fullPage 
    ? "fixed inset-0 z-[9999] flex items-center justify-center bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm"
    : `flex flex-col items-center justify-center p-12 min-h-[400px] w-full ${className}`;

  return (
    <div className={containerClasses} id="swt-loading-container">
      <div className="flex flex-col items-center">
        <Spin size="large" />
        <p className="mt-4 text-sm font-bold text-slate-500 dark:text-slate-400 animate-pulse tracking-tight uppercase text-center">
          {tip}
        </p>
      </div>
    </div>
  );
};

export default SWTLoading;
