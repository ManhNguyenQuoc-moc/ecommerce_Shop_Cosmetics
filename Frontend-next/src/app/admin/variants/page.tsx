import React from 'react';
import SWTBreadcrumb from "@/src/@core/component/AntD/SWTBreadcrumb";
import { Layers, Info } from "lucide-react";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";
import VariantsClient from "./VariantsClient";

export default function AdminVariantsPage() {
  return (
    <div className="space-y-6 animate-fade-in relative z-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <SWTBreadcrumb items={[
            { title: "Trang chủ", href: "/admin" },
            { title: "Variants" }
          ]} />
          <div className="flex items-center gap-3.5 mt-4 mb-2">
            <Layers size={32} className="text-brand-500 shrink-0" />
            <h2 className="!mb-0 text-3xl font-black tracking-tight text-brand-600 dark:text-admin-accent whitespace-nowrap">
              Quản lý Biến thể
            </h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-widest">
             Phân loại thuộc tính màu sắc, kích thước và dung tích.
          </p>
        </div>
        <SWTTooltip
          title={<span className="text-sm">Quản lý kích thước, màu sắc và thuộc tính sản phẩm.</span>}
          placement="left"
          color="pink"
        >
          <div className="!h-11 !w-11 flex items-center justify-center bg-brand-50 hover:bg-brand-500/10 dark:bg-slate-800 dark:hover:bg-slate-700 text-brand-600 dark:text-admin-accent rounded-xl cursor-help transition-all shadow-sm border border-brand-200 dark:border-slate-700 group">
            <Info size={22} className="stroke-[2.5] group-hover:scale-110 transition-transform" />
          </div>
        </SWTTooltip>
      </div>

      <VariantsClient />
    </div>
  );
}
