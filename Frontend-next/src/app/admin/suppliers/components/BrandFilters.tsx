"use client";

import { Plus, Filter } from "lucide-react";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";
import { SWTInputSearch } from "@/src/@core/component/AntD/SWTInput";

interface BrandFiltersProps {
  onAdd?: () => void;
  onSearch?: (term: string) => void;
}

export default function BrandFilters({ onAdd, onSearch }: BrandFiltersProps) {
  return (
    <div className="flex flex-col gap-5 mb-6">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5">
        <div className="flex-1 w-full max-w-2xl">
          <SWTInputSearch 
            placeholder="Tìm kiếm theo tên nhà cung cấp..." 
            className="w-full !h-11 !rounded-2xl shadow-sm"
            onChange={(e) => onSearch?.(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <SWTTooltip title="Thêm Nhà Cung Cấp Mới" placement="top" color="#ec4899">
            <div 
              className="flex h-11 w-11 items-center justify-center bg-brand-500/10 hover:bg-brand-500/20 text-brand-500 border border-brand-500/20 rounded-xl shadow-sm transition-all cursor-pointer group"
              onClick={onAdd}
            >
              <Plus size={24} className="stroke-[2.5] group-hover:scale-110 group-hover:rotate-90 transition-transform duration-300" />
            </div>
          </SWTTooltip>
        </div>
      </div>

      {/* FILTER BAR (Optional, matching table style) */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 w-full p-4 lg:p-5 transition-all duration-300">
        
        <div className="flex items-center gap-2 text-brand-500 
        font-bold md:pr-4 border-b md:border-b-0 md:border-r border-border-default pb-2 md:pb-0 w-full md:w-auto">
          <Filter size={18} className="text-brand-500" />
          <span className="text-xs uppercase tracking-widest whitespace-nowrap">Bộ lọc</span>
        </div>
        <div className="flex-1 italic text-text-muted text-xs">Phát triển thêm bộ lọc theo khu vực, trạng thái...</div>
      </div>
    </div>
  );
}
