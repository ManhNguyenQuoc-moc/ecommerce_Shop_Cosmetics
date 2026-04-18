"use client";

import { Heart } from "lucide-react";
import useSWTTitle from "@/src/@core/hooks/useSWTTitle";
import ProductCard from "../home/components/ProductCard";
import { useWishlist } from "@/src/services/customer/wishlist/wishlist.hook";
import SWTBreadcrumb from "@/src/@core/component/AntD/SWTBreadcrumb";
import { useEffect, useState } from "react";

export default function WishlistClient() {
  useSWTTitle("Danh Sách Yêu Thích");
  const { items: products, isLoading } = useWishlist();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-10 px-6 sm:px-10 lg:px-16 animate-fade-in">
      <SWTBreadcrumb
        items={[
          { title: "Trang chủ", href: "/" },
          { title: "Sản phẩm yêu thích" },
        ]}
        className="mb-8"
      />

      <div className="flex flex-row items-center gap-5 mb-10">
        <div className="flex flex-col">
          <h1 className="text-3xl font-black text-slate-900  tracking-tight m-0">
            Lưu trữ yêu thích
          </h1>
          <span className="text-slate-500 font-bold text-xs tracking-widest opacity-60 mt-1">
            Lưu giữ phong cách bạn mong muốn ({mounted ? products.length : "..."} sản phẩm)
          </span>
        </div>
      </div>

      {!mounted || isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="flex flex-col gap-4">
              <div className="aspect-[3/4] bg-slate-100 rounded-[32px] animate-pulse"></div>
              <div className="h-5 bg-slate-100 rounded-full w-3/4 animate-pulse"></div>
              <div className="h-4 bg-slate-100 rounded-full w-1/2 animate-pulse"></div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-32 bg-slate-50/50 rounded-[40px] border border-dashed border-slate-200 flex flex-col items-center justify-center gap-6">
          <div className="p-6 bg-white rounded-full shadow-xl shadow-slate-200/50">
            <Heart className="text-slate-200" size={48} />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-slate-900 font-black uppercase tracking-widest text-sm">Kho lưu trữ đang trống</p>
            <p className="text-slate-400 text-xs font-bold max-w-[300px] leading-relaxed">Hãy khám phá các sản phẩm tuyệt vời của chúng tôi để thêm chúng vào danh sách yêu thích của bạn.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
