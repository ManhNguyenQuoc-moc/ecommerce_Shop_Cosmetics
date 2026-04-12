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
  const { categories } = useCategories(1, 500);
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
  }, [debouncedSearch]);

  const sortByVal = searchParams.get("sortBy") || "newest";
  const categoryVal = searchParams.get("categoryId") || "all";
  const brandVal = searchParams.get("brandId") || "all";
  const statusVal = searchParams.get("status") || "all";
  const soldRangeVal = searchParams.get("soldRange") || "all";

  // Category mapping safely
  const categoryList = Array.isArray(categories) ? categories : [];
  const categoryOptions = [
    { label: "Tất cả danh mục", value: "all" },
    ...categoryList.map((c: any) => ({ label: c.name, value: c.id }))
  ];

  // Brand mapping safely
  const brandList = Array.isArray(brands) ? brands : [];
  const brandOptions = [
    { label: "Tất cả thương hiệu", value: "all" },
    ...brandList.map((b: any) => ({ label: b.name, value: b.id }))
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
      <div className="flex flex-col gap-5 mb-6">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5">
          <div className="flex-1 w-full max-w-2xl">
            <SWTInputSearch 
              placeholder="Tìm kiếm tên sản phẩm, mã SKU..." 
              className="w-full !h-11 !rounded-2xl shadow-sm"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              allowClear
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* Sort */}
            <div className="flex items-center gap-2 rounded-xl px-1 h-11">
              <span className="text-sm font-bold text-text-muted pl-3">
                Sắp xếp:
              </span>
              <SWTSelect 
                placeholder="Sắp xếp theo"
                className="min-w-[180px] !h-full 
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
                  { label: "Tổng kho: Nhiều nhất", value: "stock_desc" },
                  { label: "Tổng kho: Ít nhất", value: "stock_asc" },
                ]}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <SWTTooltip title="Nhập dữ liệu từ CSV/XLSX" placement="top">
                <div className="flex h-11 w-11 items-center justify-center bg-bg-card hover:bg-status-success-bg text-status-success-text border border-border-default dark:border-status-success-border rounded-xl shadow-sm transition-all cursor-pointer group">
                  <FileSpreadsheet size={20} className="group-hover:scale-110 transition-transform duration-300" />
                </div>
              </SWTTooltip>
              <SWTTooltip title="Thêm Sản Phẩm Mới" placement="top" color="#6366f1">
                <div 
                  className="flex h-11 w-11 items-center justify-center bg-brand-500/10 hover:bg-brand-500/20 text-brand-600 dark:text-brand-500 border border-brand-500/20 rounded-xl shadow-sm transition-all cursor-pointer group"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  <Plus size={24} className="stroke-[2.5] group-hover:scale-110 group-hover:rotate-90 transition-transform duration-300" />
                </div>
              </SWTTooltip>
            </div>
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 w-full p-4 lg:p-5 transition-all duration-300">

          {/* LEFT: Title + Filters */}
          <div className="flex flex-wrap items-center gap-3 flex-1 w-full">

            {/* Title */}
            <div className="flex items-center gap-2 text-brand-500 font-bold md:pr-4 border-b md:border-b-0 md:border-r border-border-default pb-2 md:pb-0 w-full md:w-auto">
              <Filter size={18} className="text-brand-500" />
              <span className="text-xs uppercase tracking-widest whitespace-nowrap">Bộ lọc</span>
            </div>

            {/* Category */}
            <SWTSelect
              placeholder="Danh mục"
              showSearch ={true}
              className="w-full sm:w-[180px] !h-11"
              value={categoryVal}
              onChange={(v) => updateFilter("categoryId", v)}
              options={categoryOptions}
            />

            {/* Brand */}
            <SWTSelect
              placeholder="Thương hiệu"
              showSearch ={true}
              className="w-full sm:w-[180px] !h-11"
              value={brandVal}
              onChange={(v) => updateFilter("brandId", v)}
              options={brandOptions}
            />

            {/* Status */}
            <SWTSelect
              placeholder="Trạng thái"
              className="w-full sm:w-[180px] !h-11"
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
              className="w-full sm:w-[180px] !h-11"
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
          <div className="w-full md:w-auto flex justify-end md:justify-start border-t md:border-t-0 border-border-default pt-3 md:pt-0">
            <SWTButton
              type="text"
              onClick={clearFilters}
              className="!h-9 !px-4 !text-xs !rounded-xl !w-auto whitespace-nowrap
              text-text-muted hover:!text-status-error-text hover:!bg-status-error-bg transition-all font-bold"
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
            mutate(
              (key: any) => typeof key === 'string' && key.startsWith(PRODUCT_API_ENDPOINT),
              undefined,
              { revalidate: true }
            );
            setIsAddModalOpen(false);
          } catch (err: any) {
            console.error("Create product error", err);
            throw err;
          }
        }}
      />
    </>
  );
}