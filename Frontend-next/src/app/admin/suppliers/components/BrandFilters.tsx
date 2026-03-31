"use client";

import React, { useState } from 'react';
import { Search, Plus, Filter } from "lucide-react";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";
import { SWTInputSearch } from "@/src/@core/component/AntD/SWTInput";
import AddBrandModal from "./AddBrandModal";
import SWTButton from "@/src/@core/component/AntD/SWTButton";

export default function BrandFilters() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
          <div className="flex-1 w-full max-w-xl">
            <SWTInputSearch 
              placeholder="Tìm kiếm theo tên nhà cung cấp..." 
              className="w-full !rounded-xl"
            />
          </div>

          <div className="flex items-center gap-2">
            <SWTTooltip title="Thêm Nhà Cung Cấp Mới" placement="top" color="#10b981">
              <div 
                className="flex h-[35px] w-[35px] items-center justify-center bg-white dark:bg-emerald-500/20 hover:bg-emerald-50 dark:hover:bg-emerald-500/30 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-emerald-500 rounded-xl shadow-sm transition-all cursor-pointer group"
                onClick={() => setIsAddModalOpen(true)}
              >
                <Plus size={20} className="stroke-[2.5] group-hover:scale-110 group-hover:rotate-90 transition-transform duration-300" />
              </div>
            </SWTTooltip>
          </div>
        </div>

        {/* FILTER BAR (Optional, matching table style) */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-700/60 shadow-inner">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold pr-4 border-r border-slate-200 dark:border-slate-700">
            <Filter size={16} />
            <span className="text-xs uppercase tracking-wide">Bộ lọc</span>
          </div>
          <div className="flex-1 italic text-slate-400 text-xs">Phát triển thêm bộ lọc theo khu vực, trạng thái...</div>
        </div>
      </div>

      <AddBrandModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </>
  );
}
