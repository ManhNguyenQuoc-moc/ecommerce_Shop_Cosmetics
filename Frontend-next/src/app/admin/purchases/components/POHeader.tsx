"use client";

import React from "react";
import { Truck, Info, Plus, Pencil, FileText, ArrowLeft } from "lucide-react";
import SWTBreadcrumb from "@/src/@core/component/AntD/SWTBreadcrumb";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";
import SWTButton from "@/src/@core/component/AntD/SWTButton";

interface POHeaderProps {
  title: string;
  subtitle: string;
  breadcrumbItems: { title: string; href?: string }[];
  type?: "list" | "create" | "edit" | "detail";
  onBack?: () => void;
  extraActions?: React.ReactNode;
}

const POHeader: React.FC<POHeaderProps> = ({ 
  title, 
  subtitle, 
  breadcrumbItems,
  type = "list",
  onBack,
  extraActions
}) => {
  const getIcon = () => {
    switch (type) {
      case "edit": return <Pencil size={28} className="drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] animate-pulse shrink-0" />;
      case "detail": return <FileText size={28} className="shrink-0" />;
      default: return <Truck size={28} className="drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] animate-pulse shrink-0" />;
    }
  };

  const getGradient = () => "from-brand-500 to-rose-600 shadow-brand-500/40";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div className="flex items-start gap-4">
        <div>
          <SWTBreadcrumb items={breadcrumbItems} />
          <div className="flex items-center gap-4 mt-4">
            {type === "detail" ? (
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-800 dark:text-white drop-shadow-md !mb-1">
                  {title}
                </h2>
                <div className="text-slate-500 dark:text-slate-400 text-sm">
                  {subtitle}
                </div>
              </div>
            ) : (
              <div>
                <div className={`relative mb-2 overflow-hidden bg-gradient-to-r ${getGradient()} text-white px-5 py-2.5 rounded-tl-xl rounded-tr-3xl rounded-br-3xl rounded-bl-md shadow-lg border border-white/20 flex items-center gap-3 w-fit group/title cursor-default`}>
                  <div className="absolute inset-0 bg-white/20 -skew-x-12 animate-sweep" />
                  {getIcon()}
                  <h2 className="!mb-0 text-2xl font-black tracking-tight drop-shadow-md whitespace-nowrap">
                    {title}
                  </h2>
                </div>
                <p className="text-brand-500 dark:text-cyan-400 text-sm font-semibold uppercase tracking-widest drop-shadow-sm dark:drop-shadow-[0_0_5px_rgba(0,240,255,0.3)]">
                  {subtitle}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {onBack && (
          <SWTButton
            onClick={onBack}
            size="md"
            className="!w-auto !h-10 !px-4"
            startIcon={<ArrowLeft size={16} />}
          >
            Quay lại
          </SWTButton>
        )}
        
        {extraActions}

        <SWTTooltip
          title={<span className="text-sm">Theo dõi các đơn nhập hàng từ thương hiệu và quản lý kho.</span>}
          placement="left"
          color="indigo"
        >
          <div className="!h-12 !w-12 flex items-center justify-center bg-indigo-50 hover:bg-indigo-500/10 dark:bg-slate-800 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 rounded-xl cursor-help transition-all shadow-sm border border-indigo-200 dark:border-slate-700 group">
            <Info size={20} className="stroke-[2.5] group-hover:scale-110 transition-transform" />
          </div>
        </SWTTooltip>
      </div>
    </div>
  );
};

export default POHeader;
