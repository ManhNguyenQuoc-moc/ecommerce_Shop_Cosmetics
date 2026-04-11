import React from 'react';
import { Info, Layers } from "lucide-react";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";
import SWTBreadcrumb from "@/src/@core/component/AntD/SWTBreadcrumb";
import CategoriesClient from "./CategoriesClient";

export default function CategoriesPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <SWTBreadcrumb items={[
            { title: "Trang chủ", href: "/admin" },
            { title: "Danh mục & Nhóm" }
          ]} />
          <div className="flex items-center gap-3.5 mt-4 mb-2">
            <Layers size={32} className="text-brand-500" />
            <h2 className="!mb-0 text-3xl font-black tracking-tight whitespace-nowrap text-brand-600 dark:text-admin-accent">
              Quản lý Danh mục & Nhóm
            </h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-widest">
            Danh sách các danh mục và nhóm phân loại sản phẩm.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <SWTTooltip
            title={<span className="text-sm">Quản lý cơ cấu phân cấp sản phẩm giúp khách hàng dễ dàng tìm kiếm.</span>}
            placement="left"
            color="green"
          >
            <div className="!h-11 !w-11 flex items-center justify-center rounded-xl cursor-help transition-all shadow-sm border group bg-brand-50 hover:bg-brand-500/10 text-brand-600 border-brand-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700 dark:text-admin-accent">
              <Info size={22} className="stroke-[2.5] group-hover:scale-110 transition-transform" />
            </div>
          </SWTTooltip>
        </div>
      </div>

      <CategoriesClient />
    </div>
  );
}
