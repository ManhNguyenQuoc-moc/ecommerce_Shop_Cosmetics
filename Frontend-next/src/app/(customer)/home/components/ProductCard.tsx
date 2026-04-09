"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star, Zap } from "lucide-react";

import SWTCard from "@/src/@core/component/AntD/SWTCard";
import { ProductListItemDto } from "@/src/services/models/product/output.dto";
import { useWishlistStore } from "@/src/stores/useWishlistStore";

type Props = {
  product?: ProductListItemDto;
  loading?: boolean;
  priority?: boolean;
};

export default function ProductCard({ product, loading, priority }: Props) {
  const toggleWishlist = useWishlistStore((s) => s.toggleItem);
  const isInWishlist = useWishlistStore((s) =>
    product ? s.isInWishlist(product.id) : false
  );

  const isSale = !!product?.salePrice;
  
  const discountPercent = isSale && product 
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100) 
    : 0;

  return (
    <SWTCard
      loading={loading}
      height={loading ? 420 : "auto"}
      className={`!overflow-hidden transition-all duration-500 group/card !rounded-2xl !border-none ${
        isSale 
          ? "!shadow-[inset_0_0_30px_rgba(255,77,148,0.5),_0_1px_3px_rgba(0,0,0,0.1)] hover:!shadow-[inset_0_0_40px_rgba(255,77,148,0.6),_0_20px_25px_-5px_rgba(0,0,0,0.1),_0_10px_10px_-5px_rgba(0,0,0,0.04)]" 
          : "!shadow-sm hover:!shadow-xl"
      }`}
      bodyClassName="!p-0"
    >
      {!loading && product && (
        <Link href={`/products/${product.id}${product.variantId ? `?variant=${product.variantId}` : ''}`} className="block h-full relative">
          <div className="flex flex-col h-full bg-white">
            
            {/* Image Wrapper */}
            <div className="relative w-full aspect-square bg-gray-50 overflow-hidden">
              <Image
                src={product.image || "https://placehold.co/400x400/png?text=No+Image"}
                alt={product.name}
                fill
                priority={priority}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover group-hover/card:scale-110 transition-transform duration-700"
              />
              
              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
                {isSale && (
                  <div className="relative overflow-hidden bg-gradient-to-r from-brand-500 to-rose-500 text-white text-[10px] font-black px-2.5 py-1 rounded-tl-md rounded-tr-xl rounded-br-xl rounded-bl-sm shadow-lg shadow-brand-200 flex items-center gap-1.5 uppercase tracking-tighter border border-white/20">
                    {/* Hiệu ứng ánh sáng lướt qua khi hover */}
                    <div className="absolute inset-0 bg-white/20 -skew-x-12 translate-x-[-150%] group-hover/card:translate-x-[150%] transition-transform duration-1000 ease-in-out" />
                    <Zap size={10} fill="currentColor" className="animate-pulse" />
                    <span>Giảm {discountPercent}%</span>
                  </div>
                )}
                {product.status && (
                  <div className={`text-white text-[9px] font-black px-2.5 py-1 rounded-full backdrop-blur-sm shadow-sm uppercase tracking-tighter w-fit
                    ${product.status.toUpperCase().includes('MỚI') || product.status.toUpperCase().includes('NEW') ? 'bg-emerald-500/90' : 
                      product.status.toUpperCase().includes('HOT') ? 'bg-rose-600/90' :
                      product.status.toUpperCase().includes('BÁN CHẠY') || product.status.toUpperCase().includes('BEST') ? 'bg-amber-500/90' :
                      product.status.toUpperCase().includes('XU HƯỚNG') || product.status.toUpperCase().includes('TRENDING') ? 'bg-blue-600/90' :
                      'bg-brand-500/90'}
                  `}>
                    {product.status}
                  </div>
                )}
                {product.availableStock === 0 ? (
                  <div className="bg-gray-900/80 text-white text-[9px] font-black px-2.5 py-1 rounded-full backdrop-blur-sm shadow-sm uppercase tracking-tighter w-fit">
                    Hết hàng
                  </div>
                ) : product.availableStock <= 5 ? (
                  <div className="bg-orange-500/90 text-white text-[9px] font-black px-2.5 py-1 rounded-full animate-pulse backdrop-blur-sm shadow-sm uppercase tracking-tighter w-fit">
                    Chỉ còn {product.availableStock}
                  </div>
                ) : null}
              </div>


              {/* Action Buttons Overlay */}
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-center justify-center z-0">
                 <div className="translate-y-2 group-hover/card:translate-y-0 transition-transform duration-300">
                    <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full font-bold text-[10px] text-gray-900 shadow-xl border border-white/50 whitespace-nowrap">
                      Xem chi tiết
                    </div>
                 </div>
              </div>

              {/* Wishlist Button - Đặt z-10 để luôn bấm được */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!product) return;
                  toggleWishlist(product);
                }}
                className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-lg z-10
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
            <div className="p-3 space-y-2.5">
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[9px] font-black text-brand-500 uppercase tracking-widest flex items-center gap-1 leading-none">
                    {product.brand?.name}
                  </p>
                  {product.status && (
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter
                      ${product.status.toUpperCase().includes('MỚI') || product.status.toUpperCase().includes('NEW') ? 'bg-emerald-50 text-emerald-600' : 
                        product.status.toUpperCase().includes('HOT') ? 'bg-rose-50 text-rose-600' :
                        product.status.toUpperCase().includes('BÁN CHẠY') || product.status.toUpperCase().includes('BEST') ? 'bg-amber-50 text-amber-600' :
                        product.status.toUpperCase().includes('XU HƯỚNG') || product.status.toUpperCase().includes('TRENDING') ? 'bg-blue-50 text-blue-600' :
                        'bg-brand-50 text-brand-600'}
                    `}>
                      {product.status}
                    </span>
                  )}
                </div>
                <h3 className="text-xs font-bold text-gray-800 line-clamp-2 min-h-[32px] leading-tight group-hover/card:text-brand-600 transition-colors">
                  {product.name}
                </h3>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={10} 
                    className={`${i < Math.floor(product.rating || 5) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} 
                  />
                ))}
                <span className="text-[10px] text-gray-400 font-bold ml-1">({product.rating || "5.0"})</span>
              </div>
              
              <div className="flex items-center justify-between gap-1 border-t border-gray-50 pt-2">
                <div className="flex flex-col">
                  {isSale ? (
                    <>
                      <span className="text-brand-600 text-base font-black leading-none">
                        {product.salePrice!.toLocaleString()}₫
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
                

              </div>
              
              {typeof product.sold === 'number' && (
                <div className="pt-0.5">
                   {/* Đổi màu thanh tiến trình cho "nóng" hơn nếu đang sale */}
                   <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden relative">
                      <div 
                        className={`h-full rounded-full relative ${isSale ? 'bg-gradient-to-r from-rose-500 to-brand-500' : 'bg-gradient-to-r from-brand-500 to-brand-700'}`} 
                        style={{ width: '65%' }} 
                      >
                         {/* Lightning Effect */}
                         <div className="absolute inset-0 bg-white/40 animate-lightning h-full w-full" />
                      </div>
                   </div>
                   <p className="text-[9px] text-gray-400 font-bold mt-1 uppercase tracking-tighter">
                      Đã bán: <span className={isSale ? "text-rose-500" : "text-brand-500"}>{product.sold}</span>
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