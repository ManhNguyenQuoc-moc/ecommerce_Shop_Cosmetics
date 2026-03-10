"use client";

import Image from "next/image";

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
      <div className="flex justify-between items-center my-6">
        <h2 className="text-xl font-bold text-brand-700">
          Thương hiệu nổi bật
        </h2>
      </div>

      {/* CONTAINER */}
      <section className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
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