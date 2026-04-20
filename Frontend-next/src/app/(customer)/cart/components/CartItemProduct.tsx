"use client";

import Image from "next/image";
import { CartItem } from "@/src/stores/useCartStore";
import { Heart, Trash2 } from "lucide-react";

type Props = {
  item: CartItem;
  onRemove?: (id: string) => void;
  outOfStock?: boolean;
};

export default function CartItemProduct({ item, onRemove, onWishlist, outOfStock = false }: Props) {
  return (
    <div className={`flex gap-4 items-start py-2 relative ${outOfStock ? "opacity-50" : ""}`}>
      {outOfStock && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <span className="bg-status-error-bg text-status-error-text text-xs font-bold px-2 py-0.5 rounded-full border border-status-error-border shadow-sm">
            Hết hàng
          </span>
        </div>
      )}
      {/* Product Image */}
      <div className="relative w-16 h-16 flex-shrink-0 bg-bg-muted rounded-lg border border-border-default overflow-hidden">
        <Image
          src={item.image || ""}
          alt={item.productName}
          width={100}
          height={100}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-1 min-w-0">
        <div className="mb-1">
          {item.brandName && (
            <p className="text-xs font-bold text-text-muted uppercase tracking-wider">
              {item.brandName}
            </p>
          )}
          <h3 className="text-sm font-bold text-text-main truncate leading-tight">
            {item.productName}
          </h3>
        </div>
        {/* Actions Section */}
        <div className="flex items-center gap-4 mt-auto pt-1">
          <div className="h-3 w-[1px] bg-border-default" /> {/* Divider */}
          <button
            onClick={() => onRemove?.(item.id)}
            className="flex items-center gap-1 text-xs text-text-muted hover:text-status-error-text transition-colors"
            title="Xóa khỏi giỏ hàng"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}