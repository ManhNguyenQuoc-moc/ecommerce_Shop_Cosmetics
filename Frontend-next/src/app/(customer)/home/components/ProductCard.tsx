"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { Star } from "lucide-react";
import SWTCard from "@/src/@core/component/AntD/SWTCard";
import SWTButton from "@/src/@core/component/AntD/SWTButton";

export type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  salePrice?: number;
  image: string;
  rating?: number;
  sold?: number;
};

type Props = {
  product?: Product;
  loading?: boolean;
};

export default function ProductCard({ product, loading }: Props) {
  return (
    <SWTCard loading={loading} height={420} className="overflow-hidden border-1 border-blue-light-50 hover:border-brand-500">
      {!loading && product && (
        <div className="group cursor-pointer flex flex-col h-full">
          <div className="relative w-full h-44 bg-gray-100">
            <Image
              src={product.image}
              alt={product.name}
              fill
              unoptimized
              className="object-cover group-hover:scale-105 transition"
            />
            {product.salePrice && (
              <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                -
                {Math.round(
                  (1 - product.salePrice / product.price) * 100
                )}
                %
              </div>
            )}
            <button className="absolute top-2 right-2 bg-white/80 backdrop-blur p-1.5 rounded-full hover:bg-red-500 hover:text-white transition">
              <Heart size={16} />
            </button>
          </div>
          <div className="p-3 space-y-1 flex-1">

            <p className="text-xs text-gray-500">
              {product.brand}
            </p>

            <p className="text-sm font-medium line-clamp-2 min-h-[40px]">
              {product.name}
            </p>

            <div className="flex items-center gap-2">
              {product.salePrice ? (
                <>
                  <span className="text-red-600 text-xl font-bold">
                    {product.salePrice.toLocaleString()}đ
                  </span>

                  <span className="text-gray-400  line-through text-sm">
                    {product.price.toLocaleString()}đ
                  </span>
                </>
              ) : (
                <span className="text-blue-600 font-bold">
                  {product.price.toLocaleString()}đ
                </span>
              )}
            </div>

            <div className="flex justify-between text-sm text-gray-500">
              {product.rating && (
  <span className="flex items-center gap-1">
    <Star size={24} className="text-yellow-500 fill-yellow-500" />
    {product.rating}
  </span>
)}
              {product.sold && <span>{product.sold} sold</span>}
            </div>

          </div>

          <div className="p-3 pt-0">
            <SWTButton className="w-full h-[40px]">
            Thêm vào giỏ hàng
            </SWTButton>
          </div>

        </div>
      )}
    </SWTCard>
  );
}