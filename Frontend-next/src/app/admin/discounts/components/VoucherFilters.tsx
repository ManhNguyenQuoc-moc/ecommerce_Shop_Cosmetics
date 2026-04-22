"use client";

import { Download, Filter, Plus } from "lucide-react";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import { SWTInputSearch } from "@/src/@core/component/AntD/SWTInput";
import SWTSelect from "@/src/@core/component/AntD/SWTSelect";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";
import { useState, useEffect, TransitionStartFunction, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useDebounce } from "@/src/@core/hooks/useDebounce";
import { Dropdown } from "antd";
import type { MenuProps } from "antd";
import { FileSpreadsheet, FileText, RefreshCw } from "lucide-react";

interface VoucherFiltersProps {
  onAdd?: () => void;
  startTransition: TransitionStartFunction;
  onExportExcel?: () => void;
  onExportPDF?: () => void;
  isExporting?: boolean;
}

export default function VoucherFilters({ onAdd, startTransition, onExportExcel, onExportPDF, isExporting }: VoucherFiltersProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const searchStr = searchParams.get("search") || "";
  const [localSearch, setLocalSearch] = useState(searchStr);
  const debouncedSearch = useDebounce(localSearch, 500);

  useEffect(() => {
    setLocalSearch(searchStr);
  }, [searchStr]);

  const sortByVal = searchParams.get("sortBy") || "newest";
  const statusVal = searchParams.get("status") || "all";
  const typeVal = searchParams.get("type") || "all";
  const redeemTypeVal = searchParams.get("redeemType") || "all";

  const updateFilter = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "" && value !== "all" && value !== "undefined") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }, [pathname, router, searchParams, startTransition]);

  useEffect(() => {
    if (debouncedSearch !== searchStr) {
      updateFilter("search", debouncedSearch);
    }
  }, [debouncedSearch, searchStr, updateFilter]);

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    params.delete("sortBy");
    params.delete("status");
    params.delete("type");
    params.delete("redeemType");
    params.set("page", "1");
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div className="flex flex-col gap-5 mb-6">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5">
        <div className="flex-1 w-full max-w-2xl">
          <SWTInputSearch 
            placeholder="Tìm kiếm mã voucher, tên chương trình..." 
            className="w-full h-11 rounded-2xl shadow-sm"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            allowClear
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2 rounded-xl px-1 h-11">
            <span className="text-sm font-bold text-text-muted pl-3">Sắp xếp:</span>
            <SWTSelect
              placeholder="Sắp xếp"
              className="min-w-45 h-full [&_.ant-select-selector]:bg-transparent! [&_.ant-select-selector]:border-none! [&_.ant-select-selector]:shadow-none!"
              value={sortByVal}
              onChange={(v) => updateFilter("sortBy", String(v))}
              options={[
                { label: "Ngày tạo: Mới nhất", value: "newest" },
                { label: "Ngày tạo: Cũ nhất", value: "oldest" },
                { label: "Hạn dùng: Sớm nhất", value: "end_soon" },
                { label: "Hạn dùng: Muộn nhất", value: "end_late" },
                { label: "Mức giảm: Cao nhất", value: "discount_desc" },
                { label: "Mức giảm: Thấp nhất", value: "discount_asc" },
                { label: "Lượt dùng: Nhiều nhất", value: "used_desc" },
                { label: "Lượt dùng: Ít nhất", value: "used_asc" }
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
            <div className="flex h-11 w-11 items-center justify-center bg-white dark:bg-slate-900/50 hover:bg-emerald-50 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-700/50 rounded-xl shadow-sm transition-all cursor-pointer group">
              {isExporting ? (
                <RefreshCw size={20} className="animate-spin text-emerald-600" />
              ) : (
                <Download size={20} className="group-hover:scale-110 transition-transform duration-300" />
              )}
            </div>
          </Dropdown>
          <SWTTooltip title="Thêm Voucher Mới" placement="top" color="#6366f1">
            <div 
               onClick={onAdd}
               className="flex h-11 w-11 items-center justify-center bg-brand-500/10 hover:bg-brand-500/20 text-brand-600 dark:text-brand-500 border border-brand-500/20 rounded-xl shadow-sm transition-all cursor-pointer group"
            >
              <Plus size={24} className="stroke-[2.5] group-hover:scale-110 group-hover:rotate-90 transition-transform duration-300" />
            </div>
          </SWTTooltip>
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
              placeholder="Trạng thái"
              className="w-full sm:w-45 h-11!"
              value={statusVal}
              onChange={(v) => updateFilter("status", String(v))}
              options={[
                { label: "Tất cả", value: "all" },
                { label: "Đang diễn ra", value: "active" },
                { label: "Hết lượt", value: "out" },
                { label: "Sắp diễn ra", value: "pending" },
                { label: "Hết hạn / Tắt", value: "expired" }
              ]}
            />
            <SWTSelect
              placeholder="Loại giảm giá"
              className="w-full sm:w-45 h-11!"
              value={typeVal}
              onChange={(v) => updateFilter("type", String(v))}
              options={[
                { label: "Tất cả loại", value: "all" },
                { label: "Giảm theo %", value: "PERCENTAGE" },
                { label: "Giảm số tiền", value: "FLAT_AMOUNT" },
                { label: "Miễn phí vận chuyển", value: "FREE_SHIPPING" }
              ]}
            />
            <SWTSelect
              placeholder="Hình thức"
              className="w-full sm:w-45 h-11!"
              value={redeemTypeVal}
              onChange={(v) => updateFilter("redeemType", String(v))}
              options={[
                { label: "Tất cả", value: "all" },
                { label: "Voucher thường", value: "normal" },
                { label: "Đổi bằng điểm", value: "point" }
              ]}
            />
          </div>
        </div>

        <div className="w-full md:w-auto flex justify-end md:justify-start border-t md:border-t-0 border-slate-100 dark:border-slate-700/50 pt-3 md:pt-0">
          <SWTButton
            type="text"
            onClick={clearFilters}
            className="h-9! px-4! text-xs! rounded-xl! w-auto! whitespace-nowrap text-slate-400 hover:text-red-500! hover:bg-red-50! dark:hover:bg-red-500/10! transition-all font-bold"
          >
            Xóa bộ lọc
          </SWTButton>
        </div>
      </div>
    </div>
  );
}
