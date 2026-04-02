"use client";

import { Filter, Plus } from "lucide-react";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import { SWTInputSearch } from "@/src/@core/component/AntD/SWTInput";
import SWTSelect from "@/src/@core/component/AntD/SWTSelect";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";
import { useState, useEffect, TransitionStartFunction } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { useBrands } from "@/src/services/admin/brand.service";
import { useDebounce } from "@/src/@core/hooks/useDebounce";
import { useRouter } from "next/navigation";

interface POFiltersProps {
  startTransition: TransitionStartFunction;
}

export default function POFilters({ startTransition }: POFiltersProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { brands } = useBrands();

  const searchStr = searchParams.get("search") || "";
  const [localSearch, setLocalSearch] = useState(searchStr);
  const debouncedSearch = useDebounce(localSearch, 500);

  useEffect(() => {
    setLocalSearch(searchStr);
  }, [searchStr]);

  useEffect(() => {
    if (debouncedSearch !== searchStr) {
      updateFilter("search", debouncedSearch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const sortByVal = searchParams.get("sortBy") || "newest";
  const statusVal = searchParams.get("status") || "all";
  const brandVal = searchParams.get("brandId") || "all";

  const brandList = brands?.data || brands || [];
  const brandOptions = [
    { label: "Tất cả thương hiệu", value: "all" },
    ...(Array.isArray(brandList)
      ? brandList.map((b: { id: string; name: string }) => ({ label: b.name, value: b.id }))
      : []),
  ];

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "" && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const clearFilters = () => {
    const params = new URLSearchParams();
    params.set("page", "1");
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
    setLocalSearch("");
  };

  return (
    <>
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
          <div className="flex-1 w-full max-w-xl">
            <SWTInputSearch
              placeholder="Tìm theo mã PO hoặc tên thương hiệu..."
              className="w-full !rounded-xl"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              allowClear
            />
          </div>

          {/* Sort + Action */}
          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            {/* Sort */}
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 dark:border-slate-700 rounded-xl px-1">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400 pl-3">
                Sắp xếp:
              </span>
              <SWTSelect
                placeholder="Sắp xếp theo"
                className="min-w-[200px] !h-9 [&_.ant-select-selector]:!bg-transparent [&_.ant-select-selector]:!border-none [&_.ant-select-selector]:!shadow-none"
                value={sortByVal}
                onChange={(v) => updateFilter("sortBy", v)}
                options={[
                  { label: "Ngày tạo: Mới nhất", value: "newest" },
                  { label: "Ngày tạo: Cũ nhất", value: "oldest" },
                  { label: "Tổng tiền: Thấp → Cao", value: "total_asc" },
                  { label: "Tổng tiền: Cao → Thấp", value: "total_desc" },
                ]}
              />
            </div>

            {/* Add Button */}
            <div className="flex items-center gap-2">
              <SWTTooltip title="Tạo Phiếu Nhập Mới" placement="top" color="#6366f1">
                <div
                  className="flex h-[35px] w-[35px] items-center justify-center bg-white dark:bg-indigo-500/20 hover:bg-indigo-50 dark:hover:bg-indigo-500/30 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-indigo-500 rounded-xl shadow-sm transition-all cursor-pointer group"
                  onClick={() => router.push('/admin/purchases/create')}
                >
                  <Plus size={20} className="stroke-[2.5] group-hover:scale-110 group-hover:rotate-90 transition-transform duration-300" />
                </div>
              </SWTTooltip>
            </div>
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-700/60 shadow-inner">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold pr-4 border-r border-slate-200 dark:border-slate-700">
              <Filter size={16} />
              <span className="text-xs uppercase tracking-wide">Bộ lọc</span>
            </div>

            {/* Status */}
            <SWTSelect
              placeholder="Trạng thái"
              className="min-w-[170px] !h-10"
              value={statusVal}
              onChange={(v) => updateFilter("status", v)}
              options={[
                { label: "Tất cả trạng thái", value: "all" },
                { label: "Nháp (DRAFT)", value: "DRAFT" },
                { label: "Đã duyệt (CONFIRMED)", value: "CONFIRMED" },
                { label: "Nhận một phần", value: "PARTIALLY_RECEIVED" },
                { label: "Hoàn tất", value: "COMPLETED" },
                { label: "Đã hủy", value: "CANCELLED" },
              ]}
            />

            {/* Brand */}
            <SWTSelect
              showSearch
              placeholder="Thương hiệu"
              className="min-w-[160px] !h-10"
              value={brandVal}
              onChange={(v) => updateFilter("brandId", v)}
              filterOption={(input, option) =>
                String(option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
              options={brandOptions}
            />
          </div>

          <div className="flex justify-end">
            <SWTButton
              type="text"
              onClick={clearFilters}
              className="!h-[35px] !px-3 !text-xs !rounded-md !w-auto whitespace-nowrap text-slate-400 hover:!text-red-500 hover:!bg-red-50 transition-colors"
            >
              Xóa bộ lọc
            </SWTButton>
          </div>
        </div>
      </div>

      {/* Create modal removed — navigation goes to create page */}
    </>
  );
}
