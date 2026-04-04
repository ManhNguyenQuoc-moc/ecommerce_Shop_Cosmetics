"use client";

import React from "react";
import { CheckCircle2, Circle, Clock, PackageCheck, XCircle } from "lucide-react";
import { POStatus } from "@/src/services/models/purchase/output.dto";

interface POStatusTimelineProps {
  status: POStatus;
}

const POStatusTimeline: React.FC<POStatusTimelineProps> = ({ status }) => {
  const steps = [
    { label: "Khởi tạo", key: "DRAFT", icon: <Clock size={16} /> },
    { label: "Đã duyệt", key: "CONFIRMED", icon: <CheckCircle2 size={16} /> },
    { label: "Đang nhập kho", key: "PARTIALLY_RECEIVED", icon: <PackageCheck size={16} /> },
    { label: "Hoàn tất", key: "COMPLETED", icon: <CheckCircle2 size={16} /> },
  ];

  if (status === "CANCELLED") {
    return (
      <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl p-4 flex items-center justify-center gap-3 text-red-600 font-bold uppercase tracking-wider text-sm shadow-sm">
        <XCircle size={20} />
        Phiếu nhập này đã bị hủy
      </div>
    );
  }

  const currentIdx = steps.findIndex((s) => s.key === status);
  const activeIdx = currentIdx === -1 && status === "PARTIALLY_RECEIVED" ? 2 : currentIdx;

  return (
    <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between relative px-2 sm:px-10">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 z-0" />
        {steps.map((step, idx) => {
          const isCompleted = idx < activeIdx || status === "COMPLETED";
          const isActive = idx === activeIdx && status !== "COMPLETED";
          return (
            <div key={step.key} className="flex flex-col items-center gap-3 relative z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${
                  isCompleted
                    ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                    : isActive
                    ? "bg-brand-500 border-brand-500 text-white shadow-lg shadow-brand-500/20 animate-pulse"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-300"
                }`}
              >
                {isCompleted ? <CheckCircle2 size={20} /> : step.icon}
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-widest ${
                  isCompleted || isActive ? "text-slate-800 dark:text-white" : "text-slate-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default POStatusTimeline;
