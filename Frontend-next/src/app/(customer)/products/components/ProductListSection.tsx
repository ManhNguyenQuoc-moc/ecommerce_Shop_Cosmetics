"use client";

import { useRouter, useSearchParams} from "next/navigation";

import SWTSelect from "@/src/@core/component/AntD/SWTSelect";
import SWTPagination from "@/src/@core/component/AntD/SWTPagination";
import ProductCard, { Product } from "../../home/components/ProductCard";

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
  return (
        <section className="col-span-12 md:col-span-9">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-500">
              Hiển thị 1–12 trong 120 sản phẩm
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
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
                {products.map((product: Product) => (
                <ProductCard key={product.id} product={product} loading={loading}/>
                ))}
            </div>
         <div className="flex justify-center mt-8">
        <SWTPagination
            current={page}
            pageSize={pageSize}
            total={total}
            onChange={(page, size) => {
                router.replace(`/products?page=${page}&pageSize=${size}`);
            }}
            />
      </div>
        </section>
  );
}