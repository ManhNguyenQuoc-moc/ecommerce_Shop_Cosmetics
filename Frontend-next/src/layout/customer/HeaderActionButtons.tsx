"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import Cart from "../components/header/Cart";
import UserDropdown from "../components/header/UserDropDown";
import { useAuth } from "@/src/context/AuthContext";

export default function HeaderActionButtons() {
  const { currentUser } = useAuth();
  const wishlistHref = useMemo(() => (currentUser ? "/wishlist" : "/login"), [currentUser]);

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0">
      {/* Wishlist - Show on all screens */}
      <Link
        href={wishlistHref}
        prefetch={false}
        className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white border border-brand-200/60 hover:border-brand-500/40 text-brand-900 hover:text-brand-600 transition-all group shadow-sm"
      >
        <Heart size={18} className="group-hover:fill-brand-400/20 transition-all" />
      </Link>

      {/* Cart */}
      <Cart />

      {/* User Dropdown - Show on all screens */}
      <UserDropdown />
    </div>
  );
}
