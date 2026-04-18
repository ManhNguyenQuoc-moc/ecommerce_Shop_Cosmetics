"use client";

import React from "react";
import { CheckCircle2, Clock, PackageCheck, XCircle } from "lucide-react";
import { POStatusType } from "@/src/services/models/purchase/output.dto";

interface POStatusTimelineProps {
  status: POStatusType  | "CANCELLED";
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
      <div className="bg-status-error-bg/10 border border-status-error-border rounded-2xl p-4 flex items-center justify-center gap-3 text-status-error-text font-bold uppercase tracking-wider text-sm shadow-sm">
        <XCircle size={20} />
        Phiếu nhập này đã bị hủy
      </div>
    );
  }

  const currentIdx = steps.findIndex((s) => s.key === status);
  const activeIdx = currentIdx === -1 && status === "PARTIALLY_RECEIVED" ? 2 : currentIdx;

  return (
    <div className="bg-bg-card/50 backdrop-blur-sm rounded-3xl p-6 border border-border-default shadow-sm transition-colors">
      <div className="flex items-center justify-between relative px-2 sm:px-10">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border-default -translate-y-1/2 z-0" />
        {steps.map((step, idx) => {
          const isCompleted = idx < activeIdx || status === "COMPLETED";
          const isActive = idx === activeIdx && status !== "COMPLETED";
          return (
            <div key={step.key} className="flex flex-col items-center gap-3 relative z-10">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${
                  isCompleted
                    ? "bg-status-success-text border-status-success-text text-white shadow-lg shadow-status-success-text/20"
                    : isActive
                    ? "bg-brand-500 border-brand-500 text-white shadow-lg shadow-brand-500/20 animate-pulse"
                    : "bg-bg-card border-border-default text-text-muted opacity-50"
                }`}
              >
                {isCompleted ? <CheckCircle2 size={20} /> : step.icon}
              </div>
              <span
                className={`text-[10px] font-black uppercase tracking-widest ${
                  isCompleted || isActive ? "text-text-main" : "text-text-muted"
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
