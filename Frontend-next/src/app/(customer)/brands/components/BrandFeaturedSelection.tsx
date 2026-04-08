"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BrandResponseDto } from "@/src/services/customer/server-data";

interface BrandFeaturedSelectionProps {
  brands: BrandResponseDto[];
}

export default function BrandFeaturedSelection({ brands }: BrandFeaturedSelectionProps) {
  if (!brands || brands.length < 3) return null;

  const mainBrand = brands[0];
  const secondaryBrands = brands.slice(1, 3);
  
  return (
    <section className="h-full flex flex-col gap-8 animate-fade-in relative">
      <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-brand-900 flex items-center gap-3">
            Lựa chọn nổi bật
            <span className="text-[10px] font-black text-brand-400 uppercase tracking-[0.2em] border-l-2 border-brand-100 pl-3 ml-1">
              Đề xuất hàng tháng
            </span>
          </h2>
      </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 xl:col-span-5 bg-white rounded-[2.5rem] border-2 border-slate-100 overflow-hidden shadow-sm group hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-700">
            <div className="aspect-[4/3] bg-white flex items-center justify-center relative overflow-hidden p-12">
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <Image
                  src={mainBrand.logo?.url || "/images/main/brands/cocoon-logo.jpg"}
                  alt={mainBrand.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{
                    imageRendering: "-webkit-optimize-contrast",
                    objectFit: "contain"
                  }}
                  className="p-8 group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
            <div className="p-10 flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-4xl font-black text-brand-900 group-hover:text-brand-500 transition-colors uppercase tracking-tight">
                    {mainBrand.name}
                  </h3>
                </div>
                <span className="inline-block px-3 py-1 bg-brand-500 text-brand-100 text-[10px] font-black uppercase tracking-widest rounded-lg w-fit">
                  Sustainable Luxury
                </span>
              </div>
              <p className="text-slate-700 font-semibold leading-relaxed max-w-sm text-lg">
                {mainBrand.description || "Dẫn đầu trong việc sản xuất mỹ phẩm hữu cơ với công nghệ hiện đại và thiết kế đột phá."}
              </p>
              <Link
                href={`/products?brandId=${mainBrand.id}`}
                className="inline-flex items-center gap-3 px-10 py-3.5 bg-brand-600 hover:bg-brand-700 !text-white font-black rounded-2xl shadow-xl shadow-brand-600/20 transition-all hover:-translate-y-1 w-fit"
              >
                Xem sản phẩm
              </Link>
            </div>
          </div>
          
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col gap-6">
            {secondaryBrands.map((brand) => (
              <div key={brand.id} className="flex-1 bg-white rounded-[2.5rem] border-2 border-slate-100 overflow-hidden shadow-sm group hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-700 flex flex-col sm:flex-row relative">
                <div className="sm:w-1/3 bg-white flex items-center justify-center relative overflow-hidden">
                  <div className="relative z-10 w-full h-full p-8 flex items-center justify-center">
                    <Image
                      src={brand.logo?.url || "/images/main/brands/cocoon-logo.jpg"}
                      alt={brand.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      style={{
                        imageRendering: "-webkit-optimize-contrast",
                        objectFit: "contain"
                      }}
                      className="p-10 group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                </div>
                <div className="p-10 flex flex-col justify-center flex-1">
                  <h3 className="text-2xl font-black text-brand-900 group-hover:text-brand-500 transition-colors uppercase tracking-tight mb-2">
                    {brand.name}
                  </h3>
                  <p className="text-base text-slate-700 font-semibold leading-relaxed mb-6 line-clamp-2 lg:line-clamp-none max-w-xs">
                    {brand.description || "Phong cách làm đẹp tối giản kết hợp với tính ứng dụng cao cho lối sống hiện đại."}
                  </p>
                  <Link
                    href={`/products?brandId=${brand.id}`}
                    className="inline-flex items-center gap-2 text-brand-600 font-black text-xs uppercase tracking-widest hover:pl-2 transition-all"
                  >
                    Khám phá ngay
                  </Link>
                </div>
              </div>
            ))}
          </div>
      </div>
    </section>
  );
}
