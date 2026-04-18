"use client";

import React, { ReactNode } from "react";
import SWTBreadcrumb from "@/src/@core/component/AntD/SWTBreadcrumb";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";
import { Info } from "lucide-react";

interface BreadcrumbItem {
  title: string;
  href?: string;
}

interface AdminPageHeaderProps {
  title: string;
  subtitle: string;
  icon: ReactNode;
  breadcrumbs: BreadcrumbItem[];
  tooltip?: {
    title: string;
    placement?: "left" | "right" | "top" | "bottom";
    color?: string;
  };
}

export default function AdminPageHeader({
  title,
  subtitle,
  icon,
  breadcrumbs,
  tooltip,
}: AdminPageHeaderProps) {
  return (
    <div className="space-y-4">
      <SWTBreadcrumb items={breadcrumbs as any} />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3.5 mb-3">
            <div className="shrink-0 text-brand-500">
              {icon}
            </div>
            <h1 className="!mb-0 text-3xl font-black tracking-tight text-brand-600 dark:text-admin-accent whitespace-nowrap overflow-hidden text-ellipsis">
              {title}
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-widest">
            {subtitle}
          </p>
        </div>

        {tooltip && (
          <SWTTooltip
            title={<span className="text-sm">{tooltip.title}</span>}
            placement={tooltip.placement || "left"}
            color={tooltip.color || "pink"}
          >
            <div className="!h-11 !w-11 flex items-center justify-center shrink-0 bg-brand-50 hover:bg-brand-500/10 dark:bg-slate-800 dark:hover:bg-slate-700 text-brand-600 dark:text-admin-accent rounded-xl cursor-help transition-all shadow-sm border border-brand-200 dark:border-slate-700 group">
              <Info size={22} className="stroke-[2.5] group-hover:scale-110 transition-transform" />
            </div>
          </SWTTooltip>
        )}
      </div>
    </div>
  );
}
