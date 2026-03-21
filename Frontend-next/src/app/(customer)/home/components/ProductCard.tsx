"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star, Zap } from "lucide-react";

import SWTCard from "@/src/@core/component/AntD/SWTCard";
import type { Product } from "@/src/@core/type/Product";
import { useWishlistStore } from "@/src/stores/useWishlistStore";
type Props = {
  product?: Product;
  loading?: boolean;
};

export default function ProductCard({ product, loading }: Props) {
const toggleWishlist = useWishlistStore((s) => s.toggleItem);
const isInWishlist = useWishlistStore((s) =>
  product ? s.isInWishlist(product.id) : false
);
  return (
    <SWTCard
      loading={loading}
      height={loading ? 420 : "auto"}
      className="!overflow-hidden !border-none !shadow-sm hover:!shadow-xl transition-all duration-500 group/card !rounded-2xl"
      bodyClassName="!p-0"
    >
      {!loading && product && (
        <Link href={`/products/${product.id}`} className="block h-full relative">
          <div className="flex flex-col h-full bg-white">
            {/* Image Wrapper */}
            <div className="relative w-full aspect-square bg-gray-50 overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                unoptimized
                className="object-cover group-hover/card:scale-110 transition-transform duration-700"
              />
              
              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1.5">
                {product.salePrice && (
                  <div className="bg-brand-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-lg shadow-brand-200 flex items-center gap-1 uppercase tracking-tighter">
                    <Zap size={8} fill="currentColor" />
                    Sale
                  </div>
                )}
                <div className="bg-black/80 text-white text-[9px] font-black px-2 py-0.5 rounded-full backdrop-blur-sm shadow-sm uppercase tracking-tighter">
                  Mới
                </div>
              </div>

              {/* Action Buttons Overlay */}
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                 <div className="translate-y-2 group-hover/card:translate-y-0 transition-transform duration-300">
                    <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full font-bold text-[10px] text-gray-900 shadow-xl border border-white/50 whitespace-nowrap">
                      Xem chi tiết
                    </div>
                 </div>
              </div>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!product) return;
                  toggleWishlist(product);
                }}
                className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-lg
                  ${
                    isInWishlist
                      ? "bg-brand-500 text-white"
                      : "bg-white/70 text-gray-900 hover:bg-brand-500 hover:text-white"
                  }
                `}
              >
                <Heart
                  size={14}
                  className={isInWishlist ? "fill-white" : ""}
                />
              </button>
            </div>

            {/* Content */}
            <div className="p-3 space-y-2">
              <div className="space-y-0.5">
                <p className="text-[9px] font-black text-brand-500 uppercase tracking-widest flex items-center gap-1 leading-none">
                  {product.brand}
                </p>
                <h3 className="text-xs font-bold text-gray-800 line-clamp-2 min-h-[32px] leading-tight group-hover/card:text-brand-600 transition-colors">
                  {product.name}
                </h3>
              </div>
              
              <div className="flex items-center justify-between gap-1 border-t border-gray-50 pt-2">
                <div className="flex flex-col">
                  {product.salePrice ? (
                    <>
                      <span className="text-brand-600 text-base font-black leading-none">
                        {product.salePrice.toLocaleString()}₫
                      </span>
                      <span className="text-gray-400 line-through text-[10px] mt-0.5">
                        {product.price.toLocaleString()}₫
                      </span>
                    </>
                  ) : (
                    <span className="text-gray-900 font-black text-base leading-none">
                      {product.price.toLocaleString()}₫
                    </span>
                  )}
                </div>
                
                {product.rating && (
                  <div className="flex items-center gap-0.5 bg-brand-50 px-1.5 py-0.5 rounded-full">
                    <Star
                      size={8}
                      className="text-brand-100 fill-brand-100"
                    />
                    <span className="text-[9px] font-black text-brand-700">{product.rating}</span>
                  </div>
                )}
              </div>
              
              {product.sold && (
                <div className="pt-0.5">
                   <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-brand-500 to-brand-700 rounded-full" style={{ width: '65%' }} />
                   </div>
                   <p className="text-[9px] text-gray-400 font-bold mt-1 uppercase tracking-tighter">
                      Đã bán: <span className="text-brand-500">{product.sold}</span>
                   </p>
                </div>
              )}
            </div>

          </div>
        </Link>
      )}
    </SWTCard>

  );
}