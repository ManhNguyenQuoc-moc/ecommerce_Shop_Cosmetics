"use client";

import ProductCard from "./ProductCard";
import type{Product} from "@/src/@core/type/Product"
import SWTEmpty from "@/src/@core/component/AntD/SWTEmpty";

type Props = {
  title: string;
  products: Product[];
  loading?: boolean;
};

export default function ProductSection({
  title,
  products,
  loading = false,
}: Props) {

  const skeletonArray: (Product | undefined)[] = Array.from({ length: 12 });
  const renderList = loading ? skeletonArray : products;
  const isEmpty = !loading && (!products || products.length === 0);

  return (
    <>
      <h2 className="text-xl font-bold my-6 text-brand-700">
        {title}
      </h2>

      <section className="bg-brand-200 my-5 p-4 border border-gray-200 rounded-xl shadow-sm">

        {isEmpty ? (
          <div className="py-10 flex justify-center">
            <SWTEmpty description="Chưa có sản phẩm" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {renderList.map((product, index) => (
              <ProductCard
                key={product?.id ?? index}
                product={product}
                loading={loading}
              />
            ))}
          </div>
        )}

      </section>
    </>
  );
}