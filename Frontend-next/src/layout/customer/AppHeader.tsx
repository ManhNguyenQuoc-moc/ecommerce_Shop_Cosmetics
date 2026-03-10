"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  Search,
  ShoppingCart,
  Heart,
  User,
} from "lucide-react";
import MenuCustomer from "../components/header/MenuCustomer"
import AppSideBar from "./AppSideBar";
import { customerCategories } from "@/src/@core/http/routes/customer-categories";

export default function CustomerHeader() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const cartCount = 3;

  return (
    <header className="border-b sticky top-0 bg-white z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 gap-4">
        <button
          className="lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={24} />
        </button>
        <Link href="/" className="font-bold text-xl text-brand-500">
          Cosmetics<span className="text-black">Shop</span>
        </Link>
        <div className="hidden md:flex flex-1 max-w-xl mx-6 relative">
          <input
            placeholder="Tìm sản phẩm..."
            className="w-full border rounded-full px-4 py-2 pl-10"
          />
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/wishlist"
            className="hidden sm:flex p-2 hover:bg-gray-100 rounded-full"
          >
            <Heart size={22} />
          </Link>
          <div className="hidden sm:flex p-2 hover:bg-gray-100 rounded-full cursor-pointer">
            <User size={22} />
          </div>
          <Link
            href="/cart"
            className="relative p-2 hover:bg-gray-100 rounded-full">
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

        </div>
      </div>

      <div className="px-4 pb-3 md:hidden">
        <div className="relative">
          <input
            placeholder="Tìm kiếm..."
            className="w-full bg-gray-100 rounded-lg px-4 py-2 pl-10 text-sm"
          />
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>
    <div className="hidden lg:block border-t">
  <div className="max-w-7xl mx-auto h-[60px] flex items-center justify-center">
    <MenuCustomer categories={customerCategories} />
  </div>
</div>
      <AppSideBar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        categories={customerCategories}
      />
    </header>
  );
}