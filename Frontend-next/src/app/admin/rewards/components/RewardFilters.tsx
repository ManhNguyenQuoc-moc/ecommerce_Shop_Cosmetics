"use client";

import { Download, Filter, FileSpreadsheet, FileText, RefreshCw } from "lucide-react";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import { SWTInputSearch } from "@/src/@core/component/AntD/SWTInput";
import SWTSelect from "@/src/@core/component/AntD/SWTSelect";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";
import { useState, useEffect, useCallback, TransitionStartFunction } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useDebounce } from "@/src/@core/hooks/useDebounce";
import { Dropdown } from "antd";
import type { MenuProps } from "antd";

interface RewardFiltersProps {
  startTransition: TransitionStartFunction;
  onExportExcel?: () => void;
  onExportPDF?: () => void;
  isExporting?: boolean;
}

export default function RewardFilters({ startTransition, onExportExcel, onExportPDF, isExporting }: RewardFiltersProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const searchStr = searchParams.get("search") || "";
  const [localSearch, setLocalSearch] = useState(searchStr);
  const sortVal = searchParams.get("sortBy") || "points_desc";
  const debouncedSearch = useDebounce(localSearch, 500);
  const memberRankVal = searchParams.get("memberRank") || "all";
  const userStatusVal = searchParams.get("status") || "all";
  const statusVal = searchParams.get("walletStatus") || "all";

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
    setLocalSearch(searchStr);
  }, [searchStr]);

  useEffect(() => {
    if (debouncedSearch !== searchStr) {
      updateFilter("search", debouncedSearch);
    }
  }, [debouncedSearch, searchStr, updateFilter]);

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("sortBy");
    params.delete("search");
    params.delete("memberRank");
    params.delete("status");
    params.delete("walletStatus");
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
            placeholder="Tìm kiếm tên khách hàng, email, số điện thoại..." 
            className="w-full h-11! rounded-2xl! shadow-sm"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            allowClear
          />
        </div>
          <div className="flex items-center gap-2 rounded-xl px-1 h-11">
            <span className="text-sm font-bold text-text-muted pl-3">Sắp xếp:</span>
            <SWTSelect
              placeholder="Sắp xếp"
              className="min-w-45 h-full [&_.ant-select-selector]:bg-transparent! [&_.ant-select-selector]:border-none! [&_.ant-select-selector]:shadow-none!"
              value={sortVal}
              onChange={(v) => updateFilter("sortBy", String(v))}
              options={[
                { label: "Điểm tích lũy: Cao nhất", value: "points_desc" },
                { label: "Điểm tích lũy: Thấp nhất", value: "points_asc" },
                { label: "Mới nhất", value: "newest" },
                { label: "Tên: A-Z", value: "name_asc" }
              ]}
            />
          </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
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
            <div className="flex h-11 w-11 items-center justify-center bg-bg-card dark:bg-slate-900/50 hover:bg-emerald-50 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-border-default dark:border-emerald-500/50 rounded-xl shadow-sm transition-all cursor-pointer group">
              {isExporting ? (
                <RefreshCw size={20} className="animate-spin text-emerald-600" />
              ) : (
                <Download size={20} className="group-hover:scale-110 transition-transform duration-300" />
              )}
            </div>
          </Dropdown>
        </div>

      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 w-full p-4 lg:p-5 transition-all duration-300">
        <div className="flex flex-wrap items-center gap-3 flex-1 w-full">
          <div className="flex items-center gap-2 text-brand-500 font-bold md:pr-4 border-b md:border-b-0 md:border-r border-border-default pb-2 md:pb-0 w-full md:w-auto">
            <Filter size={18} className="text-brand-500" />
            <span className="text-xs uppercase tracking-widest whitespace-nowrap">Bộ lọc</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 flex-1">
            <SWTSelect
              placeholder="Hạng thành viên"
              className="w-full sm:w-45 h-11!"
              value={memberRankVal}
              onChange={(v) => updateFilter("memberRank", String(v))}
              options={[
                { label: "Tất cả hạng", value: "all" },
                { label: "Bronze", value: "Bronze" },
                { label: "Silver", value: "Silver" },
                { label: "Gold", value: "Gold" },
                { label: "Diamond", value: "Diamond" }
              ]}
            />
            {/* <SWTSelect
              placeholder="Trạng thái tài khoản"
              className="w-full sm:w-45 h-11!"
              value={userStatusVal}
              onChange={(v) => updateFilter("status", String(v))}
              options={[
                { label: "Tất cả", value: "all" },
                { label: "Hoạt động", value: "ACTIVE" },
                { label: "Khóa", value: "BANNED" }
              ]}
            /> */}
            <SWTSelect
              placeholder="Trạng thái ví"
              className="w-full sm:w-45 h-11!"
              value={statusVal}
              onChange={(v) => updateFilter("walletStatus", String(v))}
              options={[
                { label: "Tất cả trạng thái ví", value: "all" },
                { label: "Hoạt động", value: "active" },
                { label: "Đã khóa", value: "locked" }
              ]}
            />
          </div>
        </div>

        <div className="w-full md:w-auto flex justify-end md:justify-start border-t md:border-t-0 border-border-default pt-3 md:pt-0">
          <SWTButton
            type="text"
            onClick={clearFilters}
            className="h-9! px-4! text-xs! rounded-xl! w-auto! whitespace-nowrap text-text-muted hover:text-status-error-text! hover:bg-status-error-bg/10! transition-all font-bold"
          >
            Xóa bộ lọc
          </SWTButton>
        </div>
      </div>
    </div>
  );
}
