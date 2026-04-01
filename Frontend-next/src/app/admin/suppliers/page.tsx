"use client";

import React, { useState } from 'react';
import { Info, Truck } from "lucide-react";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";
import SWTBreadcrumb from "@/src/@core/component/AntD/SWTBreadcrumb";
import useSWTTitle from "@/src/@core/hooks/useSWTTitle";
import BrandTable from "./components/BrandTable";
import BrandFilters from "./components/BrandFilters";
import AddBrandModal from "./components/AddBrandModal";

export default function SuppliersPage() {
  useSWTTitle("Quản Lý Nhà Cung Cấp | Admin");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <SWTBreadcrumb items={[
            { title: "Trang chủ", href: "/admin" },
            { title: "Nhà cung cấp" }
          ]} />
           <div className="relative mt-2 overflow-hidden bg-gradient-to-r from-brand-500 to-rose-600 text-white px-5 py-2.5 rounded-tl-xl rounded-tr-3xl rounded-br-3xl rounded-bl-md shadow-lg shadow-brand-500/40 border border-white/20 flex items-center gap-3 w-fit group/title cursor-default mt-3 mb-2">
            <div className="absolute inset-0 bg-white/20 -skew-x-12 animate-sweep" />
            <Truck size={28} className="drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] animate-pulse shrink-0" />
            <h2 className="!mb-0 text-2xl font-black tracking-tight drop-shadow-md whitespace-nowrap">
              Quản lý Nhà cung cấp
            </h2>
          </div>
          <p className="text-brand-600 dark:text-cyan-400 text-sm font-semibold uppercase tracking-widest drop-shadow-sm">
            Danh sách các đối tác, thương hiệu cung cấp sản phẩm.
          </p>
        </div>

        <SWTTooltip 
          title={<span className="text-sm">Quản lý danh sách các nhà cung cấp, đối tác thương hiệu cung ứng hàng hóa.</span>}
          placement="left"
          color="emerald"
        >
          <div className="!h-11 !w-11 flex items-center justify-center bg-emerald-50 hover:bg-emerald-500/10 dark:bg-slate-800 dark:hover:bg-slate-700 text-emerald-600 dark:text-emerald-400 rounded-xl cursor-help transition-all shadow-sm border border-emerald-200 dark:border-slate-700 group">
            <Info size={22} className="stroke-[2.5] group-hover:scale-110 transition-transform" />
          </div>
        </SWTTooltip>
      </div>

      {/* Main Content */}
      <div className="p-6 bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl shadow-sm border border-slate-200 dark:border-emerald-500/20 transition-colors">
        <BrandFilters />
        <BrandTable />
      </div>
      <AddBrandModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
}
