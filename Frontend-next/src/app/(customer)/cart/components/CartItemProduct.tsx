"use client";

import Image from "next/image";
import { CartItem } from "@/src/stores/useCartStore";
import { Heart, Trash2 } from "lucide-react";

type Props = {
  item: CartItem;
  onRemove?: (id: string) => void;
};

export default function CartItemProduct({ item, onRemove }: Props) {
  return (
    <div className="flex gap-4 items-start py-2">
      {/* Product Image */}
      <div className="relative w-16 h-16 flex-shrink-0 bg-gray-50 rounded-lg border border-gray-100 overflow-hidden">
        <Image
          src={item.image}
          alt={item.productName}
          fill
          sizes="80px"
          className="object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-1 min-w-0">
        <div className="mb-1">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            {typeof item.brand === "object" ? (item.brand as any).name : item.brand}
          </p>
          <h3 className="text-sm font-semibold text-gray-800 truncate leading-tight">
            {item.productName}
          </h3>
        </div>
        {/* Actions Section */}
        <div className="flex items-center gap-4 mt-auto pt-1">
          <button 
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-rose-500 transition-colors group"
            title="Yêu thích"
          >
            <Heart size={16} className="group-hover:fill-rose-500 transition-all" />
          </button>
          <div className="h-3 w-[1px] bg-gray-200" /> {/* Divider */}
          <button
            onClick={() => onRemove?.(item.id)}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 transition-colors"
            title="Xóa khỏi giỏ hàng"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}