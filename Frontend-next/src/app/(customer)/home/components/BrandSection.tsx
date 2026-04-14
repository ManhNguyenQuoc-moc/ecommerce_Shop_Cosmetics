"use client";
import Image from "next/image";
import Link from "next/link";
import { Award } from "lucide-react";
import { BrandResponseDto } from "@/src/services/models/brand/output.dto";

type Props = {
  brands: BrandResponseDto[];
  loading?: boolean;
};

export default function BrandSection({
  brands,
  loading = false,
}: Props) {
  const skeletonArray = Array.from({ length: 3 });

  if (!loading && (!brands || brands.length === 0)) return null;

  const featuredBrands = brands.slice(0, 3);
  const remainingBrands = brands.slice(3);

  return (
    <section className="flex flex-col gap-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-brand-200">
            <Award size={20} fill="currentColor" />
          </div>
          <h2 className="text-2xl !mb-0 font-black text-gray-900 tracking-tight uppercase italic">Thương hiệu nổi bật</h2>
        </div>
        <Link href="/brands" className="group flex items-center gap-2 !text-brand-600 font-black text-xs uppercase tracking-widest hover:gap-3 transition-all">
          Xem tất cả
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 xl:col-span-5 rounded-[2rem] overflow-hidden group hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-700 bg-white border-2 border-slate-50">
          <div className="aspect-[16/9] flex items-center justify-center relative overflow-hidden p-12">
            {loading ? (
              <div className="w-32 h-32 bg-gray-200 animate-pulse rounded-full" />
            ) : (
              <div className="relative w-full h-full transition-transform duration-700 group-hover:scale-110">
                <Image
                  src={featuredBrands[0]?.logo?.url || "/images/placeholder.png"}
                  alt={featuredBrands[0]?.name}
                  fill
                  className="object-contain"
                />
              </div>
            )}
          </div>
          {!loading && featuredBrands[0] && (
            <div className="p-8 flex flex-col items-center text-center gap-4 bg-slate-50/50">
              <div className="flex flex-col items-center gap-1">
                <h3 className="text-2xl font-black text-brand-900 group-hover:text-brand-500 transition-colors uppercase tracking-tight">
                  {featuredBrands[0].name}
                </h3>
                <span className="inline-block px-3 py-1 bg-brand-500 text-brand-100 text-[10px] font-black uppercase tracking-widest rounded-lg w-fit">
                  Top Trending
                </span>
              </div>
              <p className="text-slate-600 font-semibold leading-relaxed max-w-xs text-sm line-clamp-2">
                {featuredBrands[0].description || "Dẫn đầu xu hướng mỹ phẩm cao cấp."}
              </p>
              <Link
                href={`/products?brandId=${featuredBrands[0].id || featuredBrands[0].name}`}
                className="inline-flex items-center gap-2 px-8 py-2.5 !bg-brand-600 hover:!bg-brand-700 !text-white font-black rounded-xl shadow-xl shadow-brand-600/20 transition-all hover:-translate-y-1 w-fit text-sm"
              >
                Khám phá ngay
              </Link>
            </div>
          )}
        </div>

        <div className="lg:col-span-6 xl:col-span-7 flex flex-col gap-6">
          {((loading ? skeletonArray : featuredBrands.slice(1, 3)) as BrandResponseDto[]).map((brand, idx) => (
            <div key={idx} className="flex-1 rounded-[2rem] overflow-hidden group hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-700 flex flex-col sm:flex-row bg-white border-2 border-slate-50">
              <div className="sm:w-2/5 flex items-center justify-center relative overflow-hidden p-8">
                {loading ? (
                  <div className="w-20 h-20 bg-gray-200 animate-pulse rounded-full" />
                ) : (
                  <div className="relative w-full h-full transition-transform duration-700 group-hover:scale-110">
                    <Image
                      src={brand.logo?.url || "/images/placeholder.png"}
                      alt={brand.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
              </div>
              {!loading && (
                <div className="p-8 flex flex-col justify-center flex-1 bg-slate-50/30">
                  <h3 className="text-xl font-black text-brand-900 group-hover:text-brand-500 transition-colors uppercase tracking-tight mb-1">
                    {brand.name}
                  </h3>
                  <p className="text-xs text-slate-600 font-semibold leading-relaxed mb-4 line-clamp-2 max-w-xs">
                    {brand.description || "Phong cách đẳng cấp và bền vững."}
                  </p>
                  <Link
                    href={`/products?brandId=${brand.id || brand.name}`}
                    className="inline-flex items-center gap-2 !text-brand-600 font-black text-xs uppercase tracking-widest hover:pl-2 transition-all"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {remainingBrands.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 pt-4">
          {remainingBrands.map((brand: BrandResponseDto, index) => (
            <Link
              key={index}
              href={`/products?brandId=${brand.id || brand.name}`}
              className="rounded-2xl p-6 flex flex-col items-center justify-center gap-4 hover:shadow-xl hover:shadow-brand-500/10 transition-all group border-0 bg-white"
            >
              <div className="relative w-full aspect-[2/1] transition-transform duration-500 group-hover:scale-110">
                <Image
                  src={brand.logo?.url || "/images/placeholder.png"}
                  alt={brand.name}
                  fill
                  className="object-contain filter grayscale group-hover:grayscale-0 transition-opacity"
                />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-brand-600 transition-colors">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}