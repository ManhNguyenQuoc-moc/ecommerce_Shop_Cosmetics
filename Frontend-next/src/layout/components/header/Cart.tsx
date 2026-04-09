"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import SWTBadge from "@/src/@core/component/SWTBadge";
import { useEffect } from "react";
import {useCartStore} from "@/src/stores/useCartStore";

export default function Cart() {
  const fetchCart = useCartStore((s) => s.fetchCart);
  const cartCount = useCartStore((s) => s.getCount());

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <Link
      href="/cart"
      className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-white border border-brand-200/60 hover:border-brand-500/40 text-brand-900 hover:text-brand-600 transition-all group shadow-sm"
    >
      <ShoppingCart className="group-hover:fill-brand-400/20 transition-all" size={20}/>

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