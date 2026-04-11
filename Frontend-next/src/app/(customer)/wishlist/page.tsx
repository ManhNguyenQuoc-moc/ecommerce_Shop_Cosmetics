"use client";

import { Heart } from "lucide-react";
import ProductCard from "../home/components/ProductCard";
import { useWishlist } from "@/src/hooks/useWishlist";
import SWTBreadcrumb from "@/src/@core/component/AntD/SWTBreadcrumb";
import { useEffect, useState } from "react";

export default function WishlistPage() {
  const { items: products } = useWishlist();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
        <div className="max-w-7xl mx-auto py-10 px-4 min-h-[60vh]">
            <div className="animate-pulse flex flex-col gap-8">
                <div className="h-8 bg-slate-200 rounded-md w-48"></div>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-80 bg-slate-100 rounded-2xl"></div>
                    ))}
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <SWTBreadcrumb
        items={[
          { title: "Trang chủ", href: "/" },
          { title: "Wishlist" },
        ]}
      />

      <div className="flex items-center gap-3 mb-8 mt-6">
        <Heart className="text-red-500 fill-red-500" size={28} />
        <h1 className="text-2xl font-bold m-0 text-slate-900">
          Danh sách yêu thích
        </h1>
        <span className="text-gray-500 font-medium">
          ({products.length} sản phẩm)
        </span>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <Heart className="mx-auto mb-4 text-slate-300" size={48} />
          <p className="text-gray-500">Chưa có sản phẩm nào trong danh sách yêu thích của bạn.</p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6">
          {products.map((product: any) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}

    </div>
  );
}