"use client";

import { useRouter, useSearchParams} from "next/navigation";

import SWTSelect from "@/src/@core/component/AntD/SWTSelect";
import SWTPagination from "@/src/@core/component/AntD/SWTPagination";
import ProductCard from "../../home/components/ProductCard";
import {Product} from "@/src/@core/type/Product"
import SWTEmpty from "@/src/@core/component/AntD/SWTEmpty";

type Props = {
  products: Product[];
  total: number;
  loading: boolean;
};

export default function ProductListSection({products , total ,loading }:Props){
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? 1);
  const pageSize = Number(searchParams.get("pageSize") ?? 9);

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
        <section className="col-span-12 md:col-span-9">
          <div className="flex justify-between items-center mb-4">
           <p className="text-sm text-gray-500">
              Hiển thị {start}–{end} trong {total} sản phẩm
          </p>
            <SWTSelect
              defaultValue="newest"
              style={{ width: 200 }}
              options={[
                { value: "newest", label: "Mới nhất" },
                { value: "price_asc", label: "Giá tăng dần" },
                { value: "price_desc", label: "Giá giảm dần" },
                { value: "best_seller", label: "Bán chạy" },
              ]}
            />
          </div>
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
          {Array.from({ length: pageSize }).map((_, index) => (
            <ProductCard key={index} loading />
          ))}
        </div>
      )}
        {products.length === 0 && !loading ? (
        <div className="py-16 flex justify-center">
          <SWTEmpty description="Không có sản phẩm nào" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
          {products.map((product: Product) => (
            <ProductCard
              key={product.id}
              product={product}
     
            />
          ))}
        </div>
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