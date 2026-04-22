"use client";

import { Filter, Download, FileSpreadsheet, FileText, RefreshCw } from "lucide-react";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import { SWTInputSearch } from "@/src/@core/component/AntD/SWTInput";
import SWTSelect from "@/src/@core/component/AntD/SWTSelect";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { TransitionStartFunction, useState, useEffect, useCallback } from "react";
import { useDebounce } from "@/src/@core/hooks/useDebounce";
import { SWTDateRangePicker } from "@/src/@core/component/AntD/SWTDatePicker";
import dayjs from "dayjs";
import { Dropdown } from "antd";

interface InventoryFiltersProps {
  startTransition: TransitionStartFunction;
  onExportExcel?: () => void;
  onExportPDF?: () => void;
  isExporting?: boolean;
}

export default function InventoryFilters({ startTransition, onExportExcel, onExportPDF, isExporting }: InventoryFiltersProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const searchStr = searchParams.get("search") || "";
  const [localSearch, setLocalSearch] = useState(searchStr);
  const debouncedSearch = useDebounce(localSearch, 500);

  const handleFilterChange = useCallback((key: string, value: string | undefined) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== 'all') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.set("page", "1");
      router.replace(`${pathname}?${params.toString()}`);
    });
  }, [pathname, router, searchParams, startTransition]);

  useEffect(() => {
    setLocalSearch(searchStr);
  }, [searchStr]);

  useEffect(() => {
    if (debouncedSearch !== searchStr) {
      handleFilterChange("search", debouncedSearch);
    }
  }, [debouncedSearch, handleFilterChange, searchStr]);

  const clearFilters = () => {
    startTransition(() => {
      const params = new URLSearchParams();
      const tab = searchParams.get("tab");
      if (tab) params.set("tab", tab);
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="flex flex-col gap-5 mb-6">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5">
        <div className="flex-1 w-full max-w-2xl">
          <SWTInputSearch
            placeholder="Tìm kiếm mã lô, SKU sản phẩm, tên sản phẩm..."
            className="w-full !h-11 !rounded-2xl shadow-sm"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            allowClear
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Sort */}
          <div className="flex items-center gap-2 rounded-xl px-1 h-11">
            <span className="text-sm font-bold text-slate-500 dark:text-slate-400 pl-3 uppercase tracking-tight">
              Sắp xếp:
            </span>
            <SWTSelect
              placeholder="Sắp xếp theo"
              className="min-w-[180px] !h-full 
              [&_.ant-select-selector]:!bg-transparent 
              [&_.ant-select-selector]:!border-none 
              [&_.ant-select-selector]:!shadow-none"
              value={searchParams.get("sortBy") || "newest"}
              onChange={(val) => handleFilterChange("sortBy", val)}
              options={[
                { label: "Mới nhất", value: "newest" },
                { label: "Hạn sử dụng: Gần nhất", value: "expiry_asc" },
                { label: "Hạn sử dụng: Xa nhất", value: "expiry_desc" },
                { label: "Số lượng: Ít nhất", value: "qty_asc" },
                { label: "Số lượng: Nhiều nhất", value: "qty_desc" },
              ]}
            />
          </div>

          <div className="flex items-center gap-2">
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
                  <RefreshCw size={20} className="animate-spin text-emerald-600" />
                ) : (
                  <Download size={20} className="group-hover:scale-110 transition-transform duration-300" />
                )}
              </div>
            </Dropdown>
          </div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 w-full p-4 lg:p-5 transition-all duration-300">
        
        <div className="flex flex-wrap items-center gap-3 flex-1 w-full">
          <div className="flex items-center gap-2 text-brand-600 dark:text-admin-accent 
          font-bold md:pr-4 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700 pb-2 md:pb-0 w-full md:w-auto">
            <Filter size={18} className="text-brand-500" />
            <span className="text-xs uppercase tracking-widest whitespace-nowrap">Bộ lọc</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 flex-1">
            <SWTSelect
              placeholder="Tình trạng lô hàng"
              className="w-full sm:w-[200px] !h-11"
              value={searchParams.get("status") || "all"}
              onChange={(val) => handleFilterChange("status", val)}
              options={[
                { label: "Tất cả lô hàng", value: "all" },
                { label: "Đang tốt", value: "GOOD" },
                { label: "Cận date (<3 tháng)", value: "NEAR_EXPIRY" },
                { label: "Đã quá hạn", value: "EXPIRED" },
                { label: "Đã hết hàng", value: "OUT_OF_STOCK" },
              ]}
            />

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-tight whitespace-nowrap">NSX:</span>
              <SWTDateRangePicker
                placeholder={["Từ ngày", "Đến ngày"]}
                value={[
                  searchParams.get("mfgDateFrom") ? dayjs(searchParams.get("mfgDateFrom")) : null,
                  searchParams.get("mfgDateTo") ? dayjs(searchParams.get("mfgDateTo")) : null
                ]}
                onChange={(dates) => {
                  startTransition(() => {
                    const params = new URLSearchParams(searchParams.toString());
                    if (dates && dates[0] && dates[1]) {
                      params.set("mfgDateFrom", dates[0].toISOString());
                      params.set("mfgDateTo", dates[1].toISOString());
                    } else {
                      params.delete("mfgDateFrom");
                      params.delete("mfgDateTo");
                    }
                    params.set("page", "1");
                    router.replace(`${pathname}?${params.toString()}`);
                  });
                }}
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-tight whitespace-nowrap">HSD:</span>
              <SWTDateRangePicker
                placeholder={["Từ ngày", "Đến ngày"]}
                value={[
                  searchParams.get("expiryDateFrom") ? dayjs(searchParams.get("expiryDateFrom")) : null,
                  searchParams.get("expiryDateTo") ? dayjs(searchParams.get("expiryDateTo")) : null
                ]}
                onChange={(dates) => {
                  startTransition(() => {
                    const params = new URLSearchParams(searchParams.toString());
                    if (dates && dates[0] && dates[1]) {
                      params.set("expiryDateFrom", dates[0].toISOString());
                      params.set("expiryDateTo", dates[1].toISOString());
                    } else {
                      params.delete("expiryDateFrom");
                      params.delete("expiryDateTo");
                    }
                    params.set("page", "1");
                    router.replace(`${pathname}?${params.toString()}`);
                  });
                }}
              />
            </div>
          </div>
        </div>

        <div className="w-full md:w-auto flex justify-end md:justify-start border-t md:border-t-0 border-slate-100 dark:border-slate-700/50 pt-3 md:pt-0">
          <SWTButton
            type="text"
            onClick={clearFilters}
            className="!h-9 !px-4 !text-xs !rounded-xl !w-auto whitespace-nowrap
            text-slate-400 hover:!text-red-500 hover:!bg-red-50 dark:hover:!bg-red-500/10 transition-all font-bold"
          >
            Xóa bộ lọc
          </SWTButton>
        </div>
      </div>

    </div>
  );
}
