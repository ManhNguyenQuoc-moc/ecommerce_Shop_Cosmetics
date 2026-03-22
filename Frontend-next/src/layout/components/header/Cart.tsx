"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import SWTBadge from "@/src/@core/component/SWTBadge";
import {useCartStore} from "@/src/stores/useCartStore";
export default function Cart() {

  const cartCount = useCartStore((s) => s.getCount());

  return (
    <Link
      href="/cart"
      className="relative p-2 hover:bg-brand-500/10 transition-colors rounded-full flex items-center justify-center group/cart"
    >
      <ShoppingCart className="text-brand-900 group-hover/cart:text-brand-600 transition-colors" size={22}/>

      {cartCount > 0 && (
        <div className="absolute -top-1 -right-1">
          <SWTBadge
            variant="solid"
            color="error"
            size="sm"
          >
            {cartCount}
          </SWTBadge>
        </div>
      )}
    </Link>
  );
}