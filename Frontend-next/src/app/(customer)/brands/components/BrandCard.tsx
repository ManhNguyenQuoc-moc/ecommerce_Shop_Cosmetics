import React from "react";
import Link from "next/link";
import { BrandResponseDto } from "@/src/services/customer/customer.service";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
interface BrandCardProps {
  brand: BrandResponseDto;
}

export default function BrandCard({ brand }: BrandCardProps) {
  return (
    <Link
      href={`/products?brand=${brand.slug}`}
      className="group relative block aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-100 shadow-lg shadow-brand-900/5 hover:shadow-xl hover:shadow-brand-500/20 transition-all duration-500 hover:-translate-y-1.5"
    >
      {/* Banner Background */}
      <div className="absolute inset-0 z-0">
        {brand.banner?.url ? (
          <Image
            src={brand.banner.url}
            alt={brand.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            fill  
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-100 to-rose-50 flex items-center justify-center">
             <Sparkles className="text-brand-300 w-12 h-12" />
          </div>
        )}
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Floating Circular Logo */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full p-1.5 shadow-xl shadow-black/20 flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border-[3px] border-white/50 backdrop-blur-sm">
          {brand.logo?.url ? (
            <Image
              src={brand.logo.url}
              alt={`${brand.name} logo`}
              className="w-full h-full object-contain"
              fill
            />
          ) : (
            <span className="text-brand-500 font-black text-2xl italic">
              {brand.name[0]}
            </span>
          )}
        </div>
      </div>

      {/* Brand Info Overlay */}
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 z-10">
        <div className="space-y-1 transform transition-transform duration-500 group-hover:translate-y-[-4px]">
          <h3 className="text-white text-lg sm:text-xl font-black tracking-tight leading-tight drop-shadow-md">
            {brand.name}
          </h3>
          <p className="text-white/80 text-[10px] sm:text-xs line-clamp-1 font-medium leading-relaxed max-w-[90%]">
            {brand.description || "Khám phá bộ sưu tập mỹ phẩm cao cấp."}
          </p>
        </div>

        {/* Action Button (Hidden until hover) */}
        <div className="mt-6 flex items-center gap-2 text-brand-400 font-bold text-sm opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
           <span>Xem sản phẩm</span>
           <ArrowRight size={16} className="animate-pulse" />
        </div>
      </div>

      {/* Subtle Light Scan Effect */}
      <div className="absolute inset-0 z-10 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" style={{ clipPath: 'polygon(20% 0, 50% 0, 30% 100%, 0% 100%)' }} />
    </Link>
  );
}
