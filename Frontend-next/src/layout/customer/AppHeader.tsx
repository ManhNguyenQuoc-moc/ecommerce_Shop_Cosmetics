"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import UserDropdown from "../components/header/UserDropDown";
import Cart from "../components/header/Cart"
import {
  Menu,
  Search,
  Heart,
  Sparkles,
  Flower,
  Zap,
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
    <>
      {/* Layout Spacer to prevent content jump - Static height matches initial Header height */}
      <div className="h-[150px] md:h-[160px] lg:h-[180px]" />

    <header
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ease-in-out bg-brand-50
      ${scrolled 
        ? "border-b border-brand-200/50 shadow-xl shadow-brand-900/5 py-2.5" 
        : "py-5 shadow-lg shadow-brand-900/5"}
    `}
    >

      {/* Premium Gradient Overlay - Fades out on scroll for stability */}
      <div className={`absolute inset-0 bg-gradient-to-r from-brand-25 via-brand-50 to-brand-25 transition-opacity duration-500 ${scrolled ? "opacity-0" : "opacity-100"}`} />

      {/* Decorative Cosmetic Icons Layer (Living Background) - High visibility */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.2] z-[1]">
          <Sparkles className="absolute top-[20%] left-[12%] w-5 h-5 text-brand-300 animate-pulse" />
          <Heart className="absolute bottom-[35%] left-[22%] w-4 h-4 text-brand-400 animate-bounce delay-700" />
          <Flower className="absolute top-[45%] right-[12%] w-6 h-6 text-brand-500/40 animate-spin duration-[12s]" />
          <Zap className="absolute bottom-[25%] right-[28%] w-4 h-4 text-brand-200 animate-pulse delay-1000" />
          <Sparkles className="absolute top-[15%] left-[55%] w-3 h-3 text-white/40 animate-ping" />
      </div>


        {/* Premium Top Accent Bar removed */}

        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 gap-8 relative z-10 transition-all duration-700">
          <button
            className="lg:hidden p-2 hover:bg-brand-500/10 rounded-xl transition-colors group"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} className="text-brand-900 group-hover:text-brand-600 transition-colors" />
          </button>

          <Link href="/" className="group flex items-center gap-3">
            <div className="relative overflow-hidden w-10 h-10 md:w-11 md:h-11 bg-brand-500 rounded-xl flex items-center justify-center transform rotate-12 group-hover:rotate-0 transition-all duration-500 shadow-xl shadow-brand-500/30">
              {/* Hiệu ứng quét sáng */}
              <div className="absolute inset-0 bg-white/40 animate-sweep z-0 pointer-events-none mix-blend-overlay" />
              <span className="relative z-10 text-white font-black text-2xl italic drop-shadow-sm">C</span>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl md:text-2xl text-brand-900 tracking-tight leading-none">
                COSMETICS
              </span>
              <span className="font-bold text-[10px] md:text-[11px] text-brand-600 tracking-[0.3em] leading-none mt-1.5 uppercase">
                Premium Beauty Shop
              </span>
            </div>
          </Link>

          {/* Persistent Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4 relative group">
            <input
              placeholder="Tìm kiếm mỹ phẩm chính hãng..."
              className="w-full bg-white border border-brand-200/60 rounded-2xl px-5 py-2.5 pl-12 text-sm text-brand-900 placeholder:text-gray-400 outline-none focus:border-brand-500/70 focus:ring-4 focus:ring-brand-500/10 transition-all shadow-sm group-hover:border-brand-300"
            />
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            <Link
              href="/wishlist"
              className="hidden sm:flex items-center justify-center w-11 h-11 rounded-2xl bg-white border border-brand-200/60 hover:border-brand-500/40 text-brand-900 hover:text-brand-600 transition-all group shadow-sm"
            >
              <Heart size={20} className="group-hover:fill-brand-400/20 transition-all" />
            </Link>

            <div className="relative">
              <Cart />
            </div>

            <div className="hidden sm:block">
              <UserDropdown />
            </div>
          </div>
        </div>

        {/* Mobile Search - Collapse logic */}
        <div className={`overflow-hidden transition-all duration-500 ease-in-out md:hidden ${scrolled ? "max-h-0 opacity-0 -translate-y-4" : "max-h-[80px] opacity-100 translate-y-0"}`}>
          <div className="px-6 pt-4 pb-2">
            <div className="relative">
              <input
                placeholder="Tìm kiếm..."
                className="w-full bg-white border border-brand-200/60 rounded-xl px-4 py-2.5 pl-11 text-sm text-brand-900 outline-none focus:ring-2 focus:ring-brand-500/30 shadow-sm"
              />
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Menu Navigation - Collapses on Scroll */}
        <div className={`hidden lg:block overflow-hidden transition-all duration-500 ease-in-out origin-top ${scrolled ? "max-h-0 opacity-0 -translate-y-4" : "max-h-[76px] opacity-100 translate-y-0"}`}>
          <div className="pt-5 border-t border-brand-200/50 mt-2">
            <div className="max-w-7xl mx-auto h-[48px] flex items-center justify-center">
              <MenuCustomer categories={customerCategories} />
            </div>
          </div>
        </div>

        <AppSideBar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          categories={customerCategories}
        />
      </header>
    </>
  );
}