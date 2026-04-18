"use client";

import { useRouter, useSearchParams } from "next/navigation";

import SWTSelect from "@/src/@core/component/AntD/SWTSelect";
import { SWTInput } from "@/src/@core/component/AntD/SWTInput";
import SWTPagination from "@/src/@core/component/AntD/SWTPagination";
import { Search } from "lucide-react";
import React from "react";
import ProductCard from "../../home/components/ProductCard";
import { ProductListItemDto } from "@/src/services/models/product/output.dto";
import SWTEmpty from "@/src/@core/component/AntD/SWTEmpty";

type Props = {
  products: ProductListItemDto[];
  total: number;
  loading: boolean;
  isFetching?: boolean;
  sortBy?: string;
};

export default function ProductListSection({
  products,
  total,
  loading,
  isFetching = false,
  sortBy = "newest",
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? 1);
  const pageSize = Number(searchParams.get("pageSize") ?? 9);
  const searchTerm = searchParams.get("searchTerm") || "";

  const [localSearch, setLocalSearch] = React.useState(searchTerm);

  React.useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);

  const handleLocalSearch = (e?: React.KeyboardEvent<HTMLInputElement>) => {
    if (!e || e.key === "Enter") {
      const params = new URLSearchParams(searchParams.toString());
      if (localSearch.trim()) {
        params.set("searchTerm", localSearch.trim());
      } else {
        params.delete("searchTerm");
      }
      params.set("page", "1");
      router.push(`${window.location.pathname}?${params.toString()}`);
    }
  };

  return (
    <section className="col-span-12 md:col-span-9">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="w-full md:max-w-md relative group">
          <SWTInput
            placeholder="Tìm kiếm trong danh mục này..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onKeyDown={handleLocalSearch}
            prefix={<Search size={18} className="text-slate-400 group-focus-within:text-brand-500 transition-colors" />}
            allowClear
            showCount={false}
            onClear={() => {
              setLocalSearch("");
              const params = new URLSearchParams(searchParams.toString());
              params.delete("searchTerm");
              params.set("page", "1");
              router.push(`${window.location.pathname}?${params.toString()}`);
            }}
            className="!rounded-xl !h-11 !border-slate-200 focus:!border-brand-500/50"
          />
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden sm:inline">Sắp xếp:</span>
          <SWTSelect
            value={sortBy}
            style={{ width: 180 }}
            className="!rounded-xl"
            onChange={(value) => {
              const params = new URLSearchParams(searchParams.toString());
              params.set("sortBy", value as string);
              params.set("page", "1");
              router.push(`${window.location.pathname}?${params.toString()}`);
            }}
            options={[
              { value: "newest", label: "Mới nhất" },
              { value: "price_asc", label: "Giá tăng dần" },
              { value: "price_desc", label: "Giá giảm dần" },
              { value: "sold_desc", label: "Bán chạy nhất" },
              { value: "rating", label: "Đánh giá cao" },
            ]}
          />
        </div>
      </div>
      {loading && products.length === 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
          {Array.from({ length: pageSize }).map((_, index) => (
            <ProductCard key={index} loading />
          ))}
        </div>
      )}

      {!loading && products.length === 0 ? (
        <div className="py-16 flex justify-center">
          <SWTEmpty description="Không có sản phẩm nào" />
        </div>
      ) : (
        !loading && (
          <div className="relative">
            <div
              className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3 transition-all duration-300 ${isFetching ? "opacity-50 pointer-events-none" : ""
                }`}
            >
              {products.map((product: ProductListItemDto, index: number) => (
                <ProductCard
                  key={product.variantId || product.id}
                  product={product}
                  priority={index < 3}
                />
              ))}
            </div>

            {isFetching && (
              <div className="absolute bottom-4 right-4 z-10">
                <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md border border-gray-200 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse" />
                  <span className="text-xs font-medium text-gray-600">
                    Đang cập nhật...
                  </span>
                </div>
              </div>
            )}
          </div>
        )
      )}
      <div className="flex justify-center mt-8">
        <SWTPagination
          current={page}
          pageSize={pageSize}
          total={total}
          onChange={(page, size) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("page", page.toString());
            params.set("pageSize", size.toString());
            router.replace(`/products?${params.toString()}`);
          }}
        />
      </div>
    </section>
  );
}