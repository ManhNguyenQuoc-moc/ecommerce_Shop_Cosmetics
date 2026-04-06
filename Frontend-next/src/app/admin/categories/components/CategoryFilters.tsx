"use client";

import React, { useState } from 'react';
import { Search, Plus, Filter } from "lucide-react";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";
import { SWTInputSearch } from "@/src/@core/component/AntD/SWTInput";
import AddCategoryModal from "./AddCategoryModal";

export default function CategoryFilters() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-5 mb-6">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5">
          <div className="flex-1 w-full max-w-2xl">
            <SWTInputSearch 
              placeholder="Tìm kiếm theo tên danh mục..." 
              className="w-full !h-11 !rounded-2xl shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <SWTTooltip title="Thêm Danh Mục Mới" placement="top" color="#6366f1">
              <div 
                className="flex h-11 w-11 items-center justify-center bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/30 rounded-xl shadow-sm transition-all cursor-pointer group"
                onClick={() => setIsAddModalOpen(true)}
              >
                <Plus size={24} className="stroke-[2.5] group-hover:scale-110 group-hover:rotate-90 transition-transform duration-300" />
              </div>
            </SWTTooltip>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-4 w-full p-4 lg:p-5 transition-all duration-300">
          <div className="flex items-center gap-2 text-brand-600 dark:text-admin-accent 
          font-bold md:pr-4 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700 pb-2 md:pb-0 w-full md:w-auto">
            <Filter size={18} className="text-brand-500" />
            <span className="text-xs uppercase tracking-widest whitespace-nowrap">Bộ lọc</span>
          </div>
          <div className="flex-1 italic text-slate-400 text-xs">Phát triển thêm bộ lọc...</div>
        </div>
      </div>

      <AddCategoryModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </>
  );
}
