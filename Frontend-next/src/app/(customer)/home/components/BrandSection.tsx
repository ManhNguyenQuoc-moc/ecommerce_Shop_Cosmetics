"use client";
import Image from "next/image";
import { Award } from "lucide-react";

type Brand = {
  name: string;
  logo: string;
  banner: string;
};

type Props = {
  brands: Brand[];
  loading?: boolean;
};

export default function BrandSection({
  brands,
  loading = false,
}: Props) {
  const skeletonArray = Array.from({ length: 8 });

  return (
    <>
      {/* TITLE */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-brand-200">
          <Award size={20} fill="currentColor" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase italic">Thương hiệu nổi bật</h2>
      </div>


      {/* CONTAINER */}
      <section className="bg-white/40 backdrop-blur-xl p-6 rounded-2xl shadow-sm border border-white/20">

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {(loading ? skeletonArray : brands).map((brand, index) => (
            <div
              key={index}
              className="relative aspect-[4/3] rounded-xl overflow-hidden group cursor-pointer"
            >
              {loading ? (
                <div className="w-full h-full bg-gray-200 animate-pulse" />
              ) : (
                <>
                  {/* Banner */}
                  <Image
                    src={(brand as Brand).banner}
                    alt={(brand as Brand).name}
                    fill
                    className="object-cover group-hover:scale-110 transition duration-500"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-70 group-hover:opacity-90 transition" />

                  {/* Logo */}
                  <div className="absolute inset-0 flex items-center justify-center translate-y-6">
                   <div className="bg-white rounded-xl shadow-md w-[120px] h-[60px] relative overflow-hidden">
                    <Image
                      src={(brand as Brand).logo}
                      alt={(brand as Brand).name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}