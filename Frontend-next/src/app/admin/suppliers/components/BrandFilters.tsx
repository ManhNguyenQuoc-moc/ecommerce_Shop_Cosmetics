"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Filter, Download, FileSpreadsheet, FileText, RefreshCw } from "lucide-react";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";
import { SWTInputSearch } from "@/src/@core/component/AntD/SWTInput";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import SWTSelect from "@/src/@core/component/AntD/SWTSelect";
import { useDebounce } from "@/src/@core/hooks/useDebounce";
import { BrandQueryFilters } from "@/src/services/models/brand/input.dto";
import { Dropdown } from "antd";
import type { MenuProps } from "antd";

interface BrandFiltersProps {
  params: BrandQueryFilters;
  onParamChange: (newParams: Partial<BrandQueryFilters>) => void;
  onClear: () => void;
  onAdd?: () => void;
  onExportExcel?: () => void;
  onExportPDF?: () => void;
  isExporting?: boolean;
}

export default function BrandFilters({ params, onParamChange, onClear, onAdd, onExportExcel, onExportPDF, isExporting }: BrandFiltersProps) {
  const searchStr = params.search || "";
  const [localSearch, setLocalSearch] = useState(searchStr);
  const debouncedSearch = useDebounce(localSearch, 500);

  const updateFilter = useCallback((key: keyof BrandQueryFilters, value: string) => {
    onParamChange({ [key]: value } as Partial<BrandQueryFilters>);
  }, [onParamChange]);

  useEffect(() => {
    setLocalSearch(searchStr);
  }, [searchStr]);

  useEffect(() => {
    if (debouncedSearch !== searchStr) {
      updateFilter("search", debouncedSearch);
    }
  }, [debouncedSearch, searchStr, updateFilter]);

  const sortByVal = params.sortBy || "newest";
  const mediaStatusVal = params.mediaStatus || "all";

  return (
    <div className="flex flex-col gap-5 mb-6">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5">
        <div className="flex-1 w-full max-w-2xl">
          <SWTInputSearch 
            placeholder="Tìm kiếm theo tên nhà cung cấp..." 
            className="w-full h-11! rounded-2xl! shadow-sm"
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
              className="min-w-47.5 h-full! [&_.ant-select-selector]:bg-transparent! [&_.ant-select-selector]:border-none! [&_.ant-select-selector]:shadow-none!"
              value={sortByVal}
              onChange={(value) => updateFilter("sortBy", value)}
              options={[
                { label: "Ngày tạo: Mới nhất", value: "newest" },
                { label: "Ngày tạo: Cũ nhất", value: "oldest" },
                { label: "Tên: A-Z", value: "name_asc" },
                { label: "Tên: Z-A", value: "name_desc" },
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
                  onClick: onExportExcel
                },
                {
                  key: "pdf",
                  label: "Xuất file PDF (.pdf)",
                  icon: <FileText size={16} className="text-rose-600" />,
                  onClick: onExportPDF
                }
              ]
            }}
            placement="bottomRight"
            trigger={['click']}
          >
            <div className="flex h-11 w-11 items-center justify-center bg-white dark:bg-slate-900/50 hover:bg-emerald-50 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-emerald-500/50 rounded-xl shadow-sm transition-all cursor-pointer group">
              {isExporting ? (
                <RefreshCw size={20} className="animate-spin" />
              ) : (
                <Download size={20} className="group-hover:scale-110 transition-transform duration-300" />
              )}
            </div>
          </Dropdown>

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

        <div className="flex flex-wrap items-center gap-3 flex-1 w-full">
          <SWTSelect
            placeholder="Trạng thái hình ảnh"
            className="w-full sm:w-47.5 h-11!"
            value={mediaStatusVal}
            onChange={(value) => updateFilter("mediaStatus", value)}
            options={[
              { label: "Tất cả", value: "all" },
              { label: "Có logo", value: "with_logo" },
              { label: "Không logo", value: "without_logo" },
              { label: "Có banner", value: "with_banner" },
              { label: "Không banner", value: "without_banner" },
            ]}
          />

          <SWTButton
            type="text"
            onClick={onClear}
            className="h-9! px-4! text-xs! rounded-xl! w-auto! whitespace-nowrap text-text-muted hover:text-status-error-text! hover:bg-status-error-bg! transition-all font-bold"
          >
            Xóa bộ lọc
          </SWTButton>
        </div>
      </div>
    </div>
  );
}
