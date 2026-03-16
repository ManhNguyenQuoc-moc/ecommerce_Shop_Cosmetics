"use client";

import Image from "next/image";
import { CartItem } from "./CartTable";

type Props = {
  item: CartItem;
};

export default function CartItemProduct({ item }: Props) {
  return (
    <div className="flex gap-3 items-center">

      <div className="w-16 h-16 relative bg-gray-100 rounded overflow-hidden">
        <Image
          src={item.image}
          alt={item.productName}
          fill
          className="object-cover"
        />
      </div>

      <div>
        <p className="font-semibold text-sm">
          {item.brand}
        </p>

        <p className="text-sm text-gray-600">
          {item.productName}
        </p>

        <div className="flex gap-4 text-sm text-gray-500 mt-1">
          <button>♡ Yêu thích</button>
          <button className="text-red-500">Xóa</button>
        </div>
      </div>

    </div>
  );
}