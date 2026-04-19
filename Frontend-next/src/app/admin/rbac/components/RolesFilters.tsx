"use client";

import { Plus, RefreshCw } from "lucide-react";
import { SWTInputSearch } from "@/src/@core/component/AntD/SWTInput";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";

interface RolesFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
  isLoading: boolean;
  onRefresh: () => void;
}

export default function RolesFilters({
  searchTerm,
  onSearchChange,
  onAddClick,
  isLoading,
  onRefresh,
}: RolesFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
      <SWTInputSearch
        placeholder="Tìm kiếm theo tên hoặc mô tả..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1 max-w-sm"
        allowClear
      />

      <div className="flex items-center gap-2">
        <SWTTooltip
          title="Làm mới danh sách Roles"
          placement="top"
          color="#06b6d4"
        >
          <div
            className="flex h-11 w-11 items-center justify-center bg-brand-500/10 hover:bg-brand-500/20 text-brand-500 border border-brand-500/20 rounded-xl shadow-sm transition-all cursor-pointer group"
            onClick={onRefresh}
            aria-disabled={isLoading}
          >
            <RefreshCw
              size={20}
              className={`stroke-[2.5] transition-transform duration-300 ${isLoading ? "animate-spin" : "group-hover:rotate-180"}`}
            />
          </div>
        </SWTTooltip>
        <SWTTooltip
          title="Tạo Role Mới"
          placement="top"
          color="#ec4899"
        >
          <div
            className="flex h-11 w-11 items-center justify-center bg-brand-500/10 hover:bg-brand-500/20 text-brand-500 border border-brand-500/20 rounded-xl shadow-sm transition-all cursor-pointer group"
            onClick={onAddClick}
          >
            <Plus
              size={24}
              className="stroke-[2.5] group-hover:scale-110 group-hover:rotate-90 transition-transform duration-300"
            />
          </div>
        </SWTTooltip>
      </div>
    </div>
  );
}
