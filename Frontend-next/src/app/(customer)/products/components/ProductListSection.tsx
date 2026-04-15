"use client";

import { useRouter, useSearchParams } from "next/navigation";

import SWTSelect from "@/src/@core/component/AntD/SWTSelect";
import SWTPagination from "@/src/@core/component/AntD/SWTPagination";
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

  return (
    <section className="col-span-12 md:col-span-9">
      <div className="flex justify-end items-center mb-4">
        <SWTSelect
          value={sortBy}
          style={{ width: 200 }}
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