"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import UserDropdown from "../components/header/UserDropDown";
import Cart from "../components/header/Cart"
import {
  Menu,
  Search,
  Heart,
} from "lucide-react";
import MenuCustomer from "../components/header/MenuCustomer"
import AppSideBar from "./AppSideBar";
import { customerCategories } from "@/src/@core/http/routes/customer-categories";

export default function CustomerHeader() {
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
  const handleScroll = () => {
    setScrolled(window.scrollY > 10);
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
  return (
    <header
  className={`sticky top-0 z-50 transition-all duration-300
  ${scrolled ? "bg-white shadow-md border-b" : "bg-transparent"}
`}
>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 gap-4">
        <button
          className="lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={24} />
        </button>
        <Link href="/" className="font-bold text-2xl text-brand-500">
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
  <div className="flex items-center gap-2">
  <Link
    href="/wishlist"
    className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition">
    <Heart size={20} className="text-red-500" />
  </Link>
  <div className="relative">
    <Cart/>
  </div>
  <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition">
    <UserDropdown />
  </div>
</div>
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