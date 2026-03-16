"use client";

import SWTBreadcrumb from "@/src/@core/component/AntD/SWTBreadcrumb";
import CartTable from "./components/CartTable";
import CartSummary from "./components/CartSummary";

type CartItem = {
  id: string;
  productId: string;
  variantId: string;

  productName: string;
  brand: string;
  image: string;

  price: number;
  originalPrice?: number;

  quantity: number;
};

export default function CartPage() {


  const cartItems: CartItem[] = [
    {
      id: "c1",
      productId: "p1",
      variantId: "v1",

      productName: "Kem Dưỡng La Roche-Posay Phục Hồi Da",
      brand: "LA ROCHE-POSAY",
      image: "/images/products/larocheposay.jpg",

      price: 599000,
      originalPrice: 880000,

      quantity: 1,
    },
    {
      id: "c2",
      productId: "p2",
      variantId: "v3",

      productName: "Son Dior Rouge 999",
      brand: "Dior",
      image: "/images/products/dior999.jpg",

      price: 850000,
      originalPrice: 980000,

      quantity: 2,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

      <SWTBreadcrumb
        items={[
          { title: "Trang chủ", href: "/" },
          { title: "Giỏ hàng" },
        ]}
      />

      {/* Title */}
      <h1 className="text-2xl font-semibold">
        Giỏ hàng ({cartItems.length} sản phẩm)
      </h1>

      {/* Layout */}
      <div className="grid grid-cols-12 gap-6">

        {/* LEFT */}
        <div className="col-span-12 lg:col-span-8">
          <CartTable items={cartItems} />
        </div>

        {/* RIGHT */}
        <div className="col-span-12 lg:col-span-4">
          <CartSummary items={cartItems} />
        </div>

      </div>

    </div>
  );
}