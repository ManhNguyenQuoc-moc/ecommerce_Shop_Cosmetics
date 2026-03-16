"use client";

import Image from "next/image";

type Brand = {
  name: string;
  logo: string;
  banner: string;
};

export default function BrandPage() {

  const brands: Brand[] = [
    {
      name: "Dior",
      logo: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Dior_Logo.svg",
      banner: "https://images.unsplash.com/photo-1596462502278-27bfdc403348",
    },
    {
      name: "Laneige",
      logo: "https://upload.wikimedia.org/wikipedia/commons/5/5b/Laneige_logo.svg",
      banner: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19",
    },
    {
      name: "Innisfree",
      logo: "https://upload.wikimedia.org/wikipedia/commons/3/32/Innisfree_Logo.svg",
      banner: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6",
    },
    {
      name: "MAC",
      logo: "https://upload.wikimedia.org/wikipedia/commons/6/6c/MAC_Cosmetics_logo.svg",
      banner: "https://images.unsplash.com/photo-1586495777744-4413f21062fa",
    },
  ];

  return (
    <div className="max-w-[1250px] mx-auto py-10">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          Tất cả thương hiệu
        </h1>
        <p className="text-gray-500 mt-1">
          Khám phá các thương hiệu mỹ phẩm nổi bật
        </p>
      </div>

      {/* BRAND GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">

        {brands.map((brand, index) => (
          <div
            key={index}
            className="relative aspect-[4/3] rounded-xl overflow-hidden group cursor-pointer"
          >

            {/* Banner */}
            <Image
              src={brand.banner}
              alt={brand.name}
              fill
              className="object-cover group-hover:scale-110 transition duration-500"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-70 group-hover:opacity-90 transition" />

            {/* Logo */}
            <div className="absolute inset-0 flex items-center justify-center translate-y-6">
              <div className="bg-white rounded-xl shadow-md w-[120px] h-[60px] relative overflow-hidden">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  fill
                  className="object-contain"
                />
              </div>
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}