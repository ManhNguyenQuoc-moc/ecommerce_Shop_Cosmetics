"use client";
import { Download, Filter, Plus } from "lucide-react";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import { SWTInputSearch } from "@/src/@core/component/AntD/SWTInput";
import SWTSelect from "@/src/@core/component/AntD/SWTSelect";
import SWTDatePickerRange from "@/src/@core/component/AntD/SWTDatePickerRange";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";
import { useState, useEffect } from "react";
import { useDebounce } from "@/src/@core/hooks/useDebounce";
import { useUserModule } from "../provider";

export default function UserFilters() {
  const { handleSearch, handleFilterChange, filters } = useUserModule();
  const [localSearch, setLocalSearch] = useState(filters.search);
  const debouncedSearch = useDebounce(localSearch, 500);

  useEffect(() => {
    handleSearch(debouncedSearch);
  }, [debouncedSearch]);

  return (
    <div className="flex flex-col gap-5 mb-6">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5">
        <div className="flex-1 w-full max-w-2xl">
          <SWTInputSearch 
            placeholder="Tìm kiếm tên, email, số điện thoại..." 
            className="w-full !h-11 !rounded-2xl shadow-sm"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            allowClear
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <SWTTooltip title="Xuất dữ liệu người dùng" placement="top">
            <div className="flex h-11 w-11 items-center justify-center bg-white dark:bg-slate-900/50 hover:bg-emerald-50 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-emerald-500/50 rounded-xl shadow-sm transition-all cursor-pointer group">
              <Download size={20} className="group-hover:scale-110 transition-transform duration-300" />
            </div>
          </SWTTooltip>
          <SWTTooltip title="Thêm Người Dùng Mới" placement="top" color="#6366f1">
            <div className="flex h-11 w-11 items-center justify-center bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/30 rounded-xl shadow-sm transition-all cursor-pointer group">
              <Plus size={24} className="stroke-[2.5] group-hover:scale-110 group-hover:rotate-90 transition-transform duration-300" />
            </div>
          </SWTTooltip>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-4 w-full p-4 lg:p-5 transition-all duration-300">
        <div className="flex flex-wrap items-center gap-3 flex-1 w-full">
          <div className="flex items-center gap-2 text-brand-600 dark:text-admin-accent font-bold md:pr-4 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700 pb-2 md:pb-0 w-full md:w-auto">
            <Filter size={18} className="text-brand-500" />
            <span className="text-xs uppercase tracking-widest whitespace-nowrap">Bộ lọc</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 flex-1">
            <SWTDatePickerRange className="!h-11 !rounded-xl w-full sm:w-auto" />
            <SWTSelect 
              placeholder="Vai trò"
              className="w-full sm:w-[180px] !h-11"
              value={filters.role}
              onChange={(val) => handleFilterChange('role', val)}
              options={[
                { label: "Tất cả", value: "all" },
                { label: "Quản trị viên", value: "ADMIN" },
                { label: "Nhân viên", value: "STAFF" },
                { label: "Khách hàng", value: "CUSTOMER" }
              ]}
            />
            <SWTSelect 
              placeholder="Trạng thái"
              className="w-full sm:w-[180px] !h-11"
              value={filters.status}
              onChange={(val) => handleFilterChange('status', val)}
              options={[
                { label: "Tất cả", value: "all" },
                { label: "Hoạt động", value: "ACTIVE" },
                { label: "Khóa", value: "BANNED" }
              ]}
            />
          </div>
        </div>
        <div className="w-full md:w-auto flex justify-end md:justify-start border-t md:border-t-0 border-slate-100 dark:border-slate-700/50 pt-3 md:pt-0">
          <SWTButton
            type="text"
            onClick={() => {
              setLocalSearch("");
              handleFilterChange('role', 'all');
              handleFilterChange('status', 'all');
            }}
            className="!h-9 !px-4 !text-xs !rounded-xl !w-auto whitespace-nowrap text-slate-400 hover:!text-red-500 hover:!bg-red-50 dark:hover:!bg-red-500/10 transition-all font-bold"
          >
            Xóa bộ lọc
          </SWTButton>
        </div>
      </div>
    </div>
  );
}