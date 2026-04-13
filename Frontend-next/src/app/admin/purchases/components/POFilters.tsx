"use client";

import { Filter, Plus } from "lucide-react";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import { SWTInputSearch } from "@/src/@core/component/AntD/SWTInput";
import SWTSelect from "@/src/@core/component/AntD/SWTSelect";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";
import { useState, useEffect, TransitionStartFunction } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { useBrands } from "@/src/hooks/admin/brand.hook";
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
  const { brands } = useBrands(1, 500);

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

  const brandList = Array.isArray(brands) ? brands : [];
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
      <div className="flex flex-col gap-5 mb-6">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5">
          <div className="flex-1 w-full max-w-2xl">
            <SWTInputSearch
              placeholder="Tìm theo mã PO hoặc tên thương hiệu..."
              className="w-full !h-11 !rounded-2xl shadow-sm"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              allowClear
            />
          </div>

          {/* Sort + Action */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* Sort */}
            <div className="flex items-center gap-2 rounded-xl px-1 h-11">
              <span className="text-sm font-bold text-text-muted pl-3 uppercase tracking-tight">
                Sắp xếp:
              </span>
              <SWTSelect
                placeholder="Sắp xếp theo"
                className="min-w-[200px] !h-full 
                [&_.ant-select-selector]:!bg-transparent 
                [&_.ant-select-selector]:!border-none 
                [&_.ant-select-selector]:!shadow-none"
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
              <SWTTooltip title="Tạo Phiếu Nhập Mới" placement="top" color="#ec4899">
                <div
                  className="flex h-11 w-11 items-center justify-center bg-brand-500/10 hover:bg-brand-500/20 text-brand-500 border border-brand-500/20 rounded-xl shadow-sm transition-all cursor-pointer group"
                  onClick={() => router.push('/admin/purchases/create')}
                >
                  <Plus size={24} className="stroke-[2.5] group-hover:scale-110 group-hover:rotate-90 transition-transform duration-300" />
                </div>
              </SWTTooltip>
            </div>
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 w-full p-4 lg:p-5 transition-all duration-300">

          <div className="flex flex-wrap items-center gap-3 flex-1 w-full">
            <div className="flex items-center gap-2 text-brand-500 
            font-bold md:pr-4 border-b md:border-b-0 md:border-r border-border-default pb-2 md:pb-0 w-full md:w-auto">
              <Filter size={18} className="text-brand-500" />
              <span className="text-xs uppercase tracking-widest whitespace-nowrap">Bộ lọc</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 flex-1">
              {/* Status */}
              <SWTSelect
                placeholder="Trạng thái"
                className="w-full sm:w-[180px] !h-11"
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
                className="w-full sm:w-[180px] !h-11"
                value={brandVal}
                onChange={(v) => updateFilter("brandId", v)}
                filterOption={(input, option) =>
                  String(option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                }
                options={brandOptions}
              />
            </div>
          </div>

          <div className="w-full md:w-auto flex justify-end md:justify-start border-t md:border-t-0 border-border-default pt-3 md:pt-0">
            <SWTButton
              type="text"
              onClick={clearFilters}
              className="!h-9 !px-4 !text-xs !rounded-xl !w-auto whitespace-nowrap
              text-text-muted hover:!text-status-error-text hover:!bg-status-error-bg/10 transition-all font-bold"
            >
              Xóa bộ lọc
            </SWTButton>
          </div>
        </div>
      </div>
    </>
  );
}
