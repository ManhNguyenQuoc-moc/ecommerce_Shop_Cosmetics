"use client";

import SWTBreadcrumb from "@/src/@core/component/AntD/SWTBreadcrumb";
import CartTable from "./components/CartTable";
import CartSummary from "./components/CartSummary";
import { useEffect } from "react";
import { useCartStore } from "@/src/stores/useCartStore";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const setItems = useCartStore((s) => s.setItems);
  useEffect(() => {
    if (items.length === 0) {
      setItems([
        {
          id: "c1",
          productId: "p1",
          variantId: "v1",
          productName: "Kem Dưỡng La Roche-Posay Phục Hồi Da",
          brand: "LA ROCHE-POSAY",
          image:
            "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6",
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
          image:
            "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908",
          price: 850000,
          originalPrice: 980000,
          quantity: 2,  
        },
      ]);
    }
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto">
      <SWTBreadcrumb
        items={[
          { title: "Trang chủ", href: "/" },
          { title: "Giỏ hàng" },
        ]}
      />

      <h1 className="text-2xl font-semibold">
        Giỏ hàng ({items.length} sản phẩm)
      </h1>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <CartTable />
        </div>

        <div className="col-span-12 lg:col-span-4">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}