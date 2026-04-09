"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BrandResponseDto } from "@/src/services/customer/server-data";

interface BrandCardMinimalProps {
  brand: BrandResponseDto;
}

export default function BrandCardMinimal({ brand }: BrandCardMinimalProps) {
  return (
    <div className="group bg-white rounded-3xl border-2 border-slate-100 shadow-sm hover:shadow-xl hover:shadow-brand-500/10 transition-all duration-500 overflow-hidden flex flex-col h-full">
      <div className="aspect-[4/3] bg-white p-8 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {brand.logo?.url ? (
          <Image
            src={brand.logo.url}
            alt={brand.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{
              imageRendering: "-webkit-optimize-contrast",
              objectFit: "contain"
            }}
            className="p-8  group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <Image
            src="/images/main/brands/cocoon-logo.jpg"
            alt={brand.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{
              imageRendering: "-webkit-optimize-contrast",
              objectFit: "contain"
            }}
            className="p-8 filter transition-all duration-700"
          />
        )}
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg font-black text-brand-900 leading-tight group-hover:text-brand-500 transition-colors">
            {brand.name}
          </h3>
          <span className="text-[9px] uppercase font-black tracking-widest text-brand-400 bg-brand-50 px-2 py-1 rounded">
            COSMETICS
          </span>
        </div>

        <p className="text-sm text-slate-700 line-clamp-2 mb-6 font-semibold leading-relaxed">
          {brand.description || "Khám phá các dòng sản phẩm làm đẹp cao cấp từ thương hiệu."}
        </p>

        <div className="mt-auto">
          <Link
            href={`/products?brandId=${brand.id}`}
            className="inline-flex items-center justify-center w-full py-3 px-4 bg-slate-100 hover:bg-brand-600 text-slate-800 hover:text-white text-[11px] font-black uppercase tracking-wider rounded-xl transition-all duration-300 group/btn"
          >
            Xem sản phẩm
          </Link>
        </div>
      </div>
    </div>
  );
}
