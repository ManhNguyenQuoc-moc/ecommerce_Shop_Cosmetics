"use client";

import { Heart } from "lucide-react";
import ProductCard from "../home/components/ProductCard";
import type { Product } from "@/src/@core/type/Product";

export default function WishlistPage() {

  // MOCK DATA
  const products: Product[] = [
    {
      id: "p1",
      name: "Son môi Dior Rouge 999",
      brand: "Dior",
      image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa",
      price: 850000,
      salePrice: 790000,
      rating: 4.8,
      sold: 1200
    },
    {
      id: "p2",
      name: "Kem dưỡng ẩm Laneige Water Bank",
      brand: "Laneige",
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348",
      price: 650000,
      salePrice: 790000,
      rating: 4.7,
      sold: 980
    }
  ];

  return (
  <div className="max-w-7xl mx-auto py-10">
  <div className="flex items-center gap-3 mb-8">
    <Heart className="text-red-500" size={28} />
    <h1 className="text-2xl font-bold m-0">Wishlist của bạn</h1>
    <span className="text-gray-500 m-0">
      ({products.length} sản phẩm)
    </span>
  </div>
  <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6">
    {products.map((product) => (
      <ProductCard
        key={product.id}
        product={product}
      />
    ))}
  </div>

</div>
  );
}