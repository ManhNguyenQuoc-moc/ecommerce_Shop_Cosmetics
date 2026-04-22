"use client";
import { Download, Filter, FileSpreadsheet, FileText, RefreshCw } from "lucide-react";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import { SWTInputSearch } from "@/src/@core/component/AntD/SWTInput";
import SWTSelect from "@/src/@core/component/AntD/SWTSelect";
import SWTDatePickerRange from "@/src/@core/component/AntD/SWTDatePickerRange";
import { Dropdown } from "antd";
import { useState, useEffect } from "react";
import { useDebounce } from "@/src/@core/hooks/useDebounce";
import { useUserModule } from "../provider";

export default function UserFilters() {
  const { handleSearch, handleFilterChange, filters, roles, handleExportExcel, handleExportPDF, isExporting } = useUserModule();
  const [localSearch, setLocalSearch] = useState(filters.search ?? "");
  const debouncedSearch = useDebounce(localSearch, 500);

  useEffect(() => {
    if ((filters.search ?? "") === (debouncedSearch ?? "")) return;
    handleSearch(debouncedSearch ?? "");
  }, [debouncedSearch, filters.search, handleSearch]);

  return (
    <div className="flex flex-col gap-5 mb-6">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5">
        <div className="flex-1 w-full max-w-2xl">
          <SWTInputSearch 
            placeholder="Tìm kiếm tên, email, số điện thoại..." 
            className="w-full rounded-2xl shadow-sm"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            allowClear
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2 rounded-xl px-1 h-11">
            <span className="text-sm font-bold text-text-muted pl-3">Sắp xếp:</span>
            <SWTSelect
              placeholder="Sắp xếp theo"
              className="min-w-45 h-full [&_.ant-select-selector]:bg-transparent! [&_.ant-select-selector]:border-none! [&_.ant-select-selector]:shadow-none!"
              value={filters.sortBy || "newest"}
              onChange={(val) => handleFilterChange('sortBy', String(val))}
              options={[
                { label: "Mới nhất", value: "newest" },
                { label: "Cũ nhất", value: "oldest" },
                { label: "Tên: A-Z", value: "name_asc" },
                { label: "Tên: Z-A", value: "name_desc" },
                { label: "Điểm tích lũy: Cao nhất", value: "points_desc" },
                { label: "Điểm tích lũy: Thấp nhất", value: "points_asc" },
              ]}
            />
          </div>

          <Dropdown
            disabled={isExporting}
            menu={{
              items: [
                {
                  key: "excel",
                  label: "Xuất file Excel (.xlsx)",
                  icon: <FileSpreadsheet size={16} className="text-emerald-600" />,
                  onClick: handleExportExcel
                },
                {
                  key: "pdf",
                  label: "Xuất file PDF (.pdf)",
                  icon: <FileText size={16} className="text-rose-600" />,
                  onClick: handleExportPDF
                }
              ]
            }}
            placement="bottomRight"
            trigger={['click']}
          >
            <div className="flex h-11 w-11 items-center justify-center bg-white dark:bg-slate-900/50 hover:bg-emerald-50 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-emerald-500/50 rounded-xl shadow-sm transition-all cursor-pointer group">
              {isExporting ? (
                <RefreshCw size={20} className="animate-spin text-emerald-600" />
              ) : (
                <Download size={20} className="group-hover:scale-110 transition-transform duration-300" />
              )}
            </div>
          </Dropdown>

          {/* <SWTTooltip title="Thêm Người Dùng Mới" placement="top" color="#6366f1">
            <div className="flex h-11 w-11 items-center justify-center bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/30 rounded-xl shadow-sm transition-all cursor-pointer group">
              <Plus size={24} className="stroke-[2.5] group-hover:scale-110 group-hover:rotate-90 transition-transform duration-300" />
            </div>
          </SWTTooltip> */}
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-4 w-full p-4 lg:p-5 transition-all duration-300">
        <div className="flex flex-wrap items-center gap-3 flex-1 w-full">
          <div className="flex items-center gap-2 text-brand-600 dark:text-admin-accent font-bold md:pr-4 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700 pb-2 md:pb-0 w-full md:w-auto">
            <Filter size={18} className="text-brand-500" />
            <span className="text-xs uppercase tracking-widest whitespace-nowrap">Bộ lọc</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 flex-1">
            <SWTDatePickerRange className="rounded-xl w-full sm:w-auto" />
            <SWTSelect 
              placeholder="Vai trò"
              className="w-full sm:w-45"
              value={filters.roleId}
              onChange={(val) => handleFilterChange('roleId', String(val))}
              options={[
                { label: "Tất cả vai trò", value: "all" },
                ...roles.map((role) => ({ label: role.name, value: role.id }))
              ]}
            />
            <SWTSelect 
              placeholder="Loại tài khoản"
              className="w-full sm:w-45"
              value={filters.accountType}
              onChange={(val) => handleFilterChange('accountType', String(val))}
              options={[
                { label: "Tất cả loại", value: "all" },
                { label: "Customer", value: "CUSTOMER" },
                { label: "Internal", value: "INTERNAL" }
              ]}
            />
            <SWTSelect 
              placeholder="Trạng thái"
              className="w-full sm:w-45"
              value={filters.status}
              onChange={(val) => handleFilterChange('status', String(val))}
              options={[
                { label: "Tất cả trạng thái", value: "all" },
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
              handleFilterChange('roleId', 'all');
              handleFilterChange('accountType', 'all');
              handleFilterChange('status', 'all');
              handleFilterChange('sortBy', 'newest');
            }}
            className="h-9 px-4 text-xs rounded-xl w-auto whitespace-nowrap text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all font-bold"
          >
            Xóa bộ lọc
          </SWTButton>
        </div>
      </div>
    </div>
  );
}