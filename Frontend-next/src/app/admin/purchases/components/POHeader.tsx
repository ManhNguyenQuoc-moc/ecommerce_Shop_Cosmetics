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
  const getIcon = (iconSize: number = 28, iconClassName: string = "") => {
    switch (type) {
      case "edit": return <Pencil size={iconSize} className={`${iconClassName} shrink-0`} />;
      case "detail": return <FileText size={iconSize} className={`${iconClassName} shrink-0`} />;
      default: return <Truck size={iconSize} className={`${iconClassName} shrink-0`} />;
    }
  };

  const getGradient = () => "from-brand-500 to-rose-600 shadow-brand-500/20";

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
              <div className="flex flex-col">
                <div className="flex items-center gap-3.5 mt-2 mb-1">
                  {getIcon(32, "text-brand-500")}
                  <h2 className="!mb-0 text-3xl font-black tracking-tight text-brand-600 dark:text-admin-accent whitespace-nowrap">
                    {title}
                  </h2>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-widest">
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
          color="pink"
        >
          <div className="!h-12 !w-12 flex items-center justify-center bg-brand-50 hover:bg-brand-500/10 dark:bg-slate-800 dark:hover:bg-slate-700 text-brand-600 dark:text-admin-accent rounded-xl cursor-help transition-all shadow-sm border border-brand-200 dark:border-slate-700 group">
            <Info size={20} className="stroke-[2.5] group-hover:scale-110 transition-transform" />
          </div>
        </SWTTooltip>
      </div>
    </div>
  );
};

export default POHeader;
