"use client";

import React from "react";

export default function AdminDashboardLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full gap-4 animate-fade-in">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 border-[5px] border-border-default dark:border-border-brand/10 rounded-full"></div>
        <div className="absolute inset-0 border-[5px] border-t-fuchsia-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
      <div className="text-center">
        <h2 className="text-lg font-bold bg-gradient-to-r from-fuchsia-600 to-purple-600 bg-clip-text text-transparent dark:from-fuchsia-400 dark:to-purple-400">
          Đang tải dữ liệu nâng cao
        </h2>
        <p className="text-sm text-slate-500 mt-1.5 font-medium">
          Đang đồng bộ hóa các chỉ số BI...
        </p>
      </div>
      <div className="flex gap-1.5 mt-2">
        <span className="w-2.5 h-2.5 bg-fuchsia-400 rounded-full animate-bounce shadow-[0_0_8px_rgba(232,121,249,0.5)]"></span>
        <span className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce delay-150 shadow-[0_0_8px_rgba(192,132,252,0.5)]"></span>
        <span className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-bounce delay-300 shadow-[0_0_8px_rgba(129,140,248,0.5)]"></span>
      </div>
    </div>
  );
}
