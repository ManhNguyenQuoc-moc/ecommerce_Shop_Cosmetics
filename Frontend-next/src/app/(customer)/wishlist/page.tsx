"use client";

import { Heart } from "lucide-react";
import ProductCard from "../home/components/ProductCard";
import { useWishlistStore } from "@/src/stores/useWishlistStore";

export default function WishlistPage() {
  const products = useWishlistStore((s) => s.items);

  return (
    <div className="max-w-7xl mx-auto py-10">

      <div className="flex items-center gap-3 mb-8">
        <Heart className="text-red-500" size={28} />
        <h1 className="text-2xl font-bold m-0">
          Wishlist của bạn
        </h1>
        <span className="text-gray-500">
          ({products.length} sản phẩm)
        </span>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          Chưa có sản phẩm yêu thích 💔
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}

    </div>
  );
}