"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import SWTBadge from "@/src/@core/component/SWTBadge";
export default function Cart() {
  const cartCount = 3;

  return (
    <Link
      href="/cart"
      className="relative p-2 hover:bg-gray-100 rounded-full flex items-center justify-center"
    >
      <ShoppingCart className="text-black" size={22}/>
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