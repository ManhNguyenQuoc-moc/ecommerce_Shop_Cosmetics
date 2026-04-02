"use client";

import { Filter, FileSpreadsheet, Download, Search, X } from "lucide-react";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import { SWTInputSearch } from "@/src/@core/component/AntD/SWTInput";
import SWTSelect from "@/src/@core/component/AntD/SWTSelect";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { TransitionStartFunction } from "react";

interface InventoryFiltersProps {
  startTransition: TransitionStartFunction;
}

export default function InventoryFilters({ startTransition }: InventoryFiltersProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const handleFilterChange = (key: string, value: string | undefined) => {
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
  };

  const clearFilters = () => {
    startTransition(() => {
      const params = new URLSearchParams();
      const tab = searchParams.get("tab");
      if (tab) params.set("tab", tab);
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
        <div className="flex-1 w-full max-w-xl">
          <SWTInputSearch
            placeholder="Tìm kiếm mã lô, SKU sản phẩm, tên sản phẩm..."
            className="w-full !rounded-xl"
            onSearch={(val) => handleFilterChange("search", val)}
            defaultValue={searchParams.get("search") || ""}
            allowClear
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          <div className="flex items-center gap-2  rounded-xl px-1">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 pl-3">
              Sắp xếp:
            </span>
            <SWTSelect
              placeholder="Sắp xếp theo"
              className="min-w-[180px] !h-9 
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
            <SWTTooltip title="Xuất báo cáo tồn kho" placement="top" color="#0ea5e9">
              <div className="flex h-[35px] w-[35px] items-center justify-center bg-white dark:bg-slate-900/50 hover:bg-sky-50 dark:hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-slate-200 dark:border-sky-500/50 rounded-xl shadow-sm transition-all cursor-pointer group">
                <Download size={18} className="group-hover:scale-110 transition-transform duration-300" />
              </div>
            </SWTTooltip>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full p-4 
      bg-slate-50 dark:bg-slate-800/40 rounded-xl 
      border border-slate-100 dark:border-slate-700/60 shadow-inner">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="flex items-center gap-2 text-blue-600 dark:text-cyan-400 font-semibold pr-4 border-r border-slate-200 dark:border-slate-700">
            <Filter size={16} />
            <span className="text-xs uppercase tracking-wide">Bộ lọc</span>
          </div>

          <SWTSelect
            placeholder="Tình trạng lô hàng"
            className="min-w-[180px] !h-10"
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
        </div>

        <div className="flex justify-end">
          <SWTButton
            type="text"
            onClick={clearFilters}
            icon={<X size={14} />}
            className="!h-[35px] !px-3 !text-xs !rounded-md !w-auto whitespace-nowrap
            text-slate-400 hover:!text-red-500 hover:!bg-red-50 transition-colors"
          >
            Xóa bộ lọc
          </SWTButton>
        </div>
      </div>
    </div>
  );
}
