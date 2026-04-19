"use client";

import { Filter, Plus, RefreshCw, Wand2 } from "lucide-react";
import { SWTInputSearch } from "@/src/@core/component/AntD/SWTInput";
import SWTSelect from "@/src/@core/component/AntD/SWTSelect";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import { useState, useEffect, TransitionStartFunction } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebounce } from "@/src/@core/hooks/useDebounce";
import { PERMISSION_RESOURCE_LABELS } from "@/src/enums";

interface PermissionsFiltersProps {
  startTransition: TransitionStartFunction;
  availableResources: string[];
  onAddClick: () => void;
  onSeedClick: () => void;
  isLoading: boolean;
  onRefresh: () => void;
}

export default function PermissionsFilters({
  startTransition,
  availableResources,
  onAddClick,
  onSeedClick,
  isLoading,
  onRefresh,
}: PermissionsFiltersProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const searchStr = searchParams.get("search") || "";
  const [localSearch, setLocalSearch] = useState(searchStr);
  const debouncedSearch = useDebounce(localSearch, 500);
  const resourceFilter = searchParams.get("resource") || "all";

  useEffect(() => {
    setLocalSearch(searchStr);
  }, [searchStr]);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "" && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  useEffect(() => {
    if (debouncedSearch !== searchStr) {
      updateFilter("search", debouncedSearch);
    }
  }, [debouncedSearch, searchStr]);

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    params.delete("resource");

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });

    setLocalSearch("");
  };

  return (
    <div className="flex flex-col gap-5 mb-6">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5">
        <div className="flex-1 w-full max-w-2xl">
          <SWTInputSearch
            placeholder="Tìm kiếm theo tên, resource, action..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full h-11! rounded-2xl! shadow-sm"
            allowClear
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <SWTTooltip
            title="Làm mới danh sách Permissions"
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
            title="Tạo Permission Mặc Định"
            placement="top"
            color="#f59e0b"
          >
            <div
              className="flex h-11 w-11 items-center justify-center bg-brand-500/10 hover:bg-brand-500/20 text-brand-500 border border-brand-500/20 rounded-xl shadow-sm transition-all cursor-pointer group"
              onClick={onSeedClick}
            >
              <Wand2
                size={20}
                className="stroke-[2.5] group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300"
              />
            </div>
          </SWTTooltip>

          <SWTTooltip
            title="Tạo Permission Mới"
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

        <div className="flex flex-col md:flex-row md:items-center gap-4 w-full p-4 lg:p-5 transition-all duration-300">
          <div className="flex flex-wrap items-center gap-3 flex-1 w-full">
            <div className="flex items-center gap-2 text-brand-500 font-bold md:pr-4 border-b md:border-b-0 md:border-r border-border-default pb-2 md:pb-0 w-full md:w-auto">
              <Filter size={18} className="text-brand-500" />
              <span className="text-xs uppercase tracking-widest whitespace-nowrap">Bộ lọc</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 flex-1">
              <SWTSelect
                placeholder="Resource"
                className="w-full sm:w-55 h-11!"
                value={resourceFilter}
                onChange={(v) => updateFilter("resource", String(v))}
                showSearch
                filterOption={(input, option) =>
                  String(option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                }
                options={[
                  { label: "Tất cả resource", value: "all" },
                  ...availableResources.map((r) => ({
                    label: PERMISSION_RESOURCE_LABELS[r] ?? r,
                    value: r,
                  })),
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
