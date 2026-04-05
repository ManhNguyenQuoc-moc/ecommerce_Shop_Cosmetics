"use client";
import ProductCard from "./ProductCard";
import { ProductListItemDto } from "@/src/services/models/product/output.dto";
import SWTEmpty from "@/src/@core/component/AntD/SWTEmpty";
import { Sparkles } from "lucide-react";

type Props = {
  title: string;
  products: ProductListItemDto[];
  loading?: boolean;
};

export default function ProductSection({
  title,
  products,
  loading = false,
}: Props) {

  const skeletonArray: (ProductListItemDto | undefined)[] = Array.from({ length: 12 });
  const renderList = loading ? skeletonArray : products;
  const isEmpty = !loading && (!products || products.length === 0);

  return (
    <>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-brand-200">
          <Sparkles size={20} fill="currentColor" />
        </div>
        <h2 className="text-2xl !mb-0 font-black text-gray-900 tracking-tight uppercase italic">{title}</h2>
      </div>
      <div className="my-5">
        {isEmpty ? (
          <div className="py-10 flex justify-center">
            <SWTEmpty description="Chưa có sản phẩm" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {renderList.map((product, index) => (
              <ProductCard
                key={product?.variantId || product?.id || index}
                product={product}
                loading={loading}
              />
            ))}
          </div>
        )}

      </div>
    </>
  );
}