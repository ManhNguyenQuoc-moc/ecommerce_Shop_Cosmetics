"use client";

import { Filter, Plus, FileSpreadsheet } from "lucide-react";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import { SWTInputSearch } from "@/src/@core/component/AntD/SWTInput";
import SWTSelect from "@/src/@core/component/AntD/SWTSelect";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";
import AntSpin from "@/src/@core/component/AntD/AntSpin";
import { showMessageError, showMessageSuccess } from "@/src/@core/utils/message";
import { useState, useEffect, TransitionStartFunction } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCategories } from "@/src/services/admin/category.service";
import { useBrands } from "@/src/services/admin/brand.service";
import AddProductModal from "./AddProductModal";
import { mutate } from "swr";
import { PRODUCT_API_ENDPOINT, createProduct } from "@/src/services/admin/product.service";
import { useDebounce } from "@/src/@core/hooks/useDebounce";

interface ProductFiltersProps {
  startTransition: TransitionStartFunction;
}

export default function ProductFilters({ startTransition }: ProductFiltersProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { categories } = useCategories();
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
  }, [debouncedSearch]);

  const sortByVal = searchParams.get("sortBy") || "newest";
  const categoryVal = searchParams.get("categoryId") || "all";
  const brandVal = searchParams.get("brandId") || "all";
  const statusVal = searchParams.get("status") || "all";
  const soldRangeVal = searchParams.get("soldRange") || "all";

  // Category mapping safely
  const categoryList = categories?.data || categories || [];
  const categoryOptions = [
    { label: "Tất cả danh mục", value: "all" },
    ...(Array.isArray(categoryList) ? categoryList.map((c: any) => ({ label: c.name, value: c.id })) : [])
  ];

  // Brand mapping safely
  const brandList = brands?.data || brands || [];
  const brandOptions = [
    { label: "Tất cả thương hiệu", value: "all" },
    ...(Array.isArray(brandList) ? brandList.map((b: any) => ({ label: b.name, value: b.id })) : [])
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
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    params.delete("categoryId");
    params.delete("brandId");
    params.delete("status");
    params.delete("soldRange");
    params.delete("sortBy");
    params.set("page", "1");
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <>
      <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
        <div className="flex-1 w-full max-w-xl">
          <SWTInputSearch 
            placeholder="Tìm kiếm tên sản phẩm, mã SKU..." 
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
              className="min-w-[180px] !h-9 
              [&_.ant-select-selector]:!bg-transparent 
              [&_.ant-select-selector]:!border-none 
              [&_.ant-select-selector]:!shadow-none"
              value={sortByVal}
              onChange={(v) => updateFilter("sortBy", v)}
              options={[
                { label: "Ngày tạo: Mới nhất", value: "newest" },
                { label: "Ngày tạo: Cũ nhất", value: "oldest" },
                { label: "Đã bán: Nhiều nhất", value: "sold_desc" },
                { label: "Đã bán: Ít nhất", value: "sold_asc" },
              ]}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <SWTTooltip title="Nhập dữ liệu từ CSV/XLSX" placement="top">
              <div className="flex h-[35px] w-[35px] items-center justify-center bg-white dark:bg-slate-900/50 hover:bg-emerald-50 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-emerald-500/50 rounded-xl shadow-sm transition-all cursor-pointer group">
                <FileSpreadsheet size={18} className="group-hover:scale-110 transition-transform duration-300" />
              </div>
            </SWTTooltip>
            
            <SWTTooltip title="Thêm Sản Phẩm Mới" placement="top" color="#6366f1">
              <div 
                className="flex h-[35px] w-[35px] items-center justify-center bg-white dark:bg-indigo-500/20 hover:bg-indigo-50 dark:hover:bg-indigo-500/30 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-indigo-500 rounded-xl shadow-sm transition-all cursor-pointer group"
                onClick={() => setIsAddModalOpen(true)}
              >
                <Plus size={20} className="stroke-[2.5] group-hover:scale-110 group-hover:rotate-90 transition-transform duration-300" />
              </div>
            </SWTTooltip>
          </div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full p-4 
      bg-slate-50 dark:bg-slate-800/40 rounded-xl 
      border border-slate-100 dark:border-slate-700/60 shadow-inner">

        {/* LEFT: Title + Filters */}
        <div className="flex flex-wrap items-center gap-3 flex-1">

          {/* Title */}
          <div className="flex items-center gap-2 text-brand-600 dark:text-cyan-400 
          font-semibold pr-4 border-r border-slate-200 dark:border-slate-700">
            <Filter size={16} />
            <span className="text-xs uppercase tracking-wide">Bộ lọc</span>
          </div>

          {/* Category */}
          <SWTSelect
            placeholder="Danh mục"
            className="min-w-[150px] !h-10"
            value={categoryVal}
            onChange={(v) => updateFilter("categoryId", v)}
            options={categoryOptions}
          />

          {/* Brand */}
          <SWTSelect
            placeholder="Thương hiệu"
            className="min-w-[150px] !h-10"
            value={brandVal}
            onChange={(v) => updateFilter("brandId", v)}
            options={brandOptions}
          />

          {/* Status */}
          <SWTSelect
            placeholder="Trạng thái"
            className="min-w-[150px] !h-10"
            value={statusVal}
            onChange={(v) => updateFilter("status", v)}
            options={[
              { label: "Tất cả trạng thái", value: "all" },
              { label: "Đang kinh doanh", value: "active" },
              { label: "Hết hàng", value: "out_of_stock" },
              { label: "Đang ẩn", value: "hidden" }
            ]}
          />

          {/* Sold Range */}
          <SWTSelect
            placeholder="Tổng đã bán"
            className="min-w-[160px] !h-10"
            value={soldRangeVal}
            onChange={(v) => updateFilter("soldRange", v)}
            options={[
              { label: "Tất cả số lượng", value: "all" },
              { label: "Dưới 50", value: "under_50" },
              { label: "50 - 200", value: "50_200" },
              { label: "200 - 500", value: "200_500" },
              { label: "Trên 500", value: "above_500" }
            ]}
          />
        </div>
        <div className="flex justify-end">
          <SWTButton
            type="text"
            onClick={clearFilters}
            className="!h-[35px] !px-3 !text-xs !rounded-md !w-auto whitespace-nowrap
            text-slate-400 hover:!text-red-500 hover:!bg-red-50 transition-colors"
          >
            Xóa bộ lọc
          </SWTButton>
        </div>
      </div>
    </div>
      <AddProductModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={async (data) => {
          try {
            await createProduct(data);
            // Tell SWR to re-fetch any product queries
            mutate(
              (key: any) => typeof key === 'string' && key.startsWith(PRODUCT_API_ENDPOINT),
              undefined,
              { revalidate: true }
            );
            setIsAddModalOpen(false);
          } catch (err: any) {
            console.error("Create product error", err);
            showMessageError(err.message || 'Có lỗi xảy ra khi thêm sản phẩm');
          }
        }}
      />
    </>
  );
}