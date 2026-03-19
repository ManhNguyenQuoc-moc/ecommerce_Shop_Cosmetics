"use client";

import Image from "next/image";
import { useCartStore} from "@/src/stores/useCartStore";
import {useCheckoutStore} from "@/src/stores/useCheckoutStore"

export default function OrderItems() {
const mode = useCheckoutStore((s) => s.mode);
const checkoutItems = useCheckoutStore((s) => s.items);
const cartItems = useCartStore((s) => s.items);

const items = mode === "buy_now" ? checkoutItems : cartItems;
  return (
    <div className="bg-white p-5 rounded-xl shadow space-y-4">
      <h2 className="text-lg font-semibold">Sản phẩm</h2>

      <div className="space-y-4 max-h-80 overflow-auto">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3 items-center">

            <div className="relative w-14 h-14 rounded-md overflow-hidden bg-gray-100">
              <Image
                src={item.image}
                alt={item.productName}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium line-clamp-2">
                {item.productName}
              </p>
              <p className="text-xs text-gray-500">
                x{item.quantity}
              </p>
            </div>

            <div className="text-sm font-semibold">
              {(item.price * item.quantity).toLocaleString()}đ
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}