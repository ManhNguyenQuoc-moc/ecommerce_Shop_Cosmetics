"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star, Zap } from "lucide-react";

import SWTCard from "@/src/@core/component/AntD/SWTCard";
import { ProductListItemDto } from "@/src/services/models/product/output.dto";
import { useWishlist } from "@/src/hooks/useWishlist";

type Props = {
  product?: ProductListItemDto;
  loading?: boolean;
  priority?: boolean;
};

export default function ProductCard({ product, loading, priority }: Props) {
  const { toggleItem: toggleWishlist, isInWishlist: checkIsInWishlist } = useWishlist();

  const isInWishlist = product ? checkIsInWishlist(product.id, product.variantId) : false;

  const isSale = !!product?.salePrice;

  const discountPercent = isSale && product
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  return (
    <SWTCard
      loading={loading}
      height={loading ? 420 : "auto"}
      className={`!overflow-hidden transition-all duration-500 group/card !rounded-2xl !border-none relative ${
        isSale
          ? "!shadow-[inset_0_0_30px_rgba(255,77,148,0.5),_0_1px_3px_rgba(0,0,0,0.1)] hover:!shadow-[inset_0_0_40px_rgba(255,77,148,0.6),_0_20px_25px_-5px_rgba(0,0,0,0.1),_0_10px_10px_-5px_rgba(0,0,0,0.04)]"
          : "!shadow-sm hover:!shadow-xl"
      }`}
      bodyClassName="!p-0"
    >
      {!loading && product && (
        <Link href={`/products/${product.id}${product.variantId ? `?variant=${product.variantId}` : ''}`} className="block h-full relative">
          
          {/* LỚP PHỦ HỒNG RADIAL GRADIENT TOÀN BỘ THẺ (ĐẬM VIỀN, NHẠT TÂM) */}
          {/* pointer-events-none đảm bảo không chặn click vào nút Yêu thích */}
          <div className="absolute inset-0 z-30 pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 rounded-2xl bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-500/5 via-brand-500/20 to-brand-500/40 border border-brand-500/0 group-hover/card:border-brand-500/30" />

          <div className="flex flex-col h-full bg-bg-card relative z-0">
            
            {/* Vùng chứa Ảnh */}
            <div className="relative w-full aspect-square bg-bg-muted overflow-hidden">
              <Image
                src={product.image || "https://placehold.co/400x400/png?text=No+Image"}
                alt={product.name}
                fill
                priority={priority}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover group-hover/card:scale-110 transition-transform duration-700 relative z-0"
              />

              {/* Badges Góc trái */}
              <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
                {isSale && (
                  <div className="relative overflow-hidden bg-gradient-to-r from-brand-500 to-rose-500 text-white text-[10px] font-black px-2.5 py-1 rounded-tl-md rounded-tr-xl rounded-br-xl rounded-bl-sm shadow-lg shadow-brand-200 flex items-center gap-1.5 uppercase tracking-tighter border border-white/20">
                    <div className="absolute inset-0 bg-white/20 -skew-x-12 translate-x-[-150%] group-hover/card:translate-x-[150%] transition-transform duration-1000 ease-in-out" />
                    <Zap size={10} fill="currentColor" className="animate-pulse" />
                    <span>Giảm {discountPercent}%</span>
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

              {/* Nút "Xem chi tiết" giữa ảnh */}
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10 pointer-events-none">
                <div className="translate-y-2 group-hover/card:translate-y-0 transition-transform duration-300">
                  <div className="bg-bg-card/95 backdrop-blur-md px-3 py-1.5 rounded-full font-bold text-[10px] text-text-main shadow-xl border border-border-default whitespace-nowrap">
                    Xem chi tiết
                  </div>
                </div>
              </div>

              {/* Nút Yêu thích - Cần z-index cao hơn lớp phủ */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!product) return;
                  toggleWishlist(product);
                }}
                className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-lg z-40
                  ${isInWishlist
                    ? "bg-brand-500 text-white"
                    : "bg-bg-card/70 text-text-main hover:bg-brand-500 hover:text-white"
                  }
                `}
              >
                <Heart
                  size={14}
                  className={isInWishlist ? "fill-white" : ""}
                />
              </button>
            </div>

            {/* Vùng chứa Thông tin (Content) */}
            <div className="p-3 space-y-2.5 relative z-20">
              <div className="space-y-1 relative z-0">
                <div className="flex items-center justify-between gap-2 relative z-0">
                  <p className="text-[9px] font-black text-brand-500 uppercase tracking-widest flex items-center gap-1 leading-none relative z-0">
                    {product.brand?.name}
                  </p>
                  {product.status && (
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter relative z-0
                      ${product.status.toUpperCase().includes('MỚI') || product.status.toUpperCase().includes('NEW') ? 'bg-green-500/90 !text-white border border-status-success-border' :
                        product.status.toUpperCase().includes('HOT') ? 'bg-status-error-bg !text-status-error-text border border-status-error-border' :
                        product.status.toUpperCase().includes('BÁN CHẠY') || product.status.toUpperCase().includes('BEST') ? 'bg-orange-500/90 !text-white border border-status-warning-border' :
                        product.status.toUpperCase().includes('XU HƯỚNG') || product.status.toUpperCase().includes('TRENDING') ? 'bg-blue-500/90 !text-white border border-status-info-border' :
                        'bg-brand-500/90 text-white border border-border-default'}
                    `}>
                      {product.status}
                    </span>
                  )}
                </div>
                <h3 className="text-xs font-bold text-text-main line-clamp-2 min-h-[32px] leading-tight group-hover/card:text-brand-500 transition-colors relative z-0">
                  {product.name}
                </h3>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-0.5 relative z-0">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={10}
                    className={`${i < Math.floor(product.rating || 5) ? 'text-yellow-400 fill-yellow-400' : 'text-text-muted opacity-30'} relative z-0`}
                  />
                ))}
                <span className="text-[10px] text-text-muted font-bold ml-1 relative z-0">({product.rating})</span>
              </div>

              {/* Giá cả */}
              <div className="flex items-center justify-between gap-1 border-t border-gray-50 pt-2 relative z-0">
                <div className="flex flex-col relative z-0">
                  {isSale ? (
                    <>
                      <span className="text-brand-500 text-base font-black leading-none relative z-0">
                        {product.salePrice!.toLocaleString()}₫
                      </span>
                      <span className="text-text-muted line-through text-[10px] mt-0.5 font-bold relative z-0">
                        {product.price.toLocaleString()}₫
                      </span>
                    </>
                  ) : (
                    <span className="text-text-main font-black text-base leading-none relative z-0">
                      {product.price.toLocaleString()}₫
                    </span>
                  )}
                </div>
              </div>

              {/* Đã bán */}
              {typeof product.sold === 'number' && (
                <div className="pt-0.5 relative z-0">
                  <p className="text-[9px] text-text-muted font-bold mt-1 uppercase tracking-tighter relative z-0">
                    Đã bán: <span className={`${isSale ? "text-status-error-text" : "text-brand-500"} relative z-0`}>{product.sold}</span>
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