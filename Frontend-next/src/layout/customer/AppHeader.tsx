"use client";
import Link from "next/link";
import { Suspense, useState } from "react";
import {
  Menu,
  Sparkles,
  Flower,
  Heart,
  Zap,
} from "lucide-react";
import SWTIconButton from "@/src/@core/component/SWTIconButton";
import MenuCustomer from "../components/header/MenuCustomer";
import AppSideBar from "./AppSideBar";
import HeaderSearchInput from "./HeaderSearchInput";
import { customerCategories, getDynamicCategories } from "@/src/@core/http/routes/customer-categories";
import { useCustomerCategories } from "@/src/services/customer/category/category.hook";
import { CategoryResponseDto } from "@/src/services/models/category/output.dto";
import { BrandResponseDto } from "@/src/services/customer/home/customer.service";

interface CustomerHeaderProps {
  initialCategories?: CategoryResponseDto[];
  initialBrands?: BrandResponseDto[];
}

// Children components for header sections
interface HeaderProps extends CustomerHeaderProps {
  children?: React.ReactNode;
  scrolled?: boolean;
  setSidebarOpen?: (open: boolean) => void;
}

function HeaderSearchFallback() {
  return (
    <>
      <div className="hidden md:flex flex-1 mx-2 relative group h-10.5">
        <div className="h-full w-full rounded-2xl border border-brand-200/60 bg-white/80 shadow-sm animate-pulse" />
      </div>

      <div className="md:hidden w-full py-2.5 border-t border-brand-200/40">
        <div className="h-10.5 rounded-lg border border-brand-200/60 bg-white/80 shadow-sm animate-pulse" />
      </div>
    </>
  );
}

export default function CustomerHeader({
  initialCategories = [],
  initialBrands = [],
  children,
  scrolled = false,
  setSidebarOpen = () => {}
}: HeaderProps) {
  const [sidebarOpen, setLocalSidebarOpen] = useState(false);
  
  const handleSidebarOpen = (open: boolean) => {
    setLocalSidebarOpen(open);
    setSidebarOpen(open);
  };

  const { categories: apiCategories } = useCustomerCategories({
    fallbackData: initialCategories,
    revalidateOnFocus: false,
    revalidateIfStale: false,
    revalidateOnMount: false,
  });

  const categoriesToUse = apiCategories && apiCategories.length > 0
    ? apiCategories
    : (initialCategories.length > 0 ? initialCategories : []);

  const dynamicCategories = categoriesToUse.length > 0
    ? getDynamicCategories(categoriesToUse)
    : customerCategories;

  return (
    <>
      <div className="h-[150px] md:h-[160px] lg:h-[180px]" />
      <header
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-[250ms] ease-out bg-brand-50
      ${scrolled
            ? "border-b border-brand-200/50 shadow-xl shadow-brand-900/5 py-2.5"
            : "py-5 shadow-lg shadow-brand-900/5"}
    `}
      >
        <div className={`absolute inset-0 bg-gradient-to-r from-brand-25 via-brand-50 to-brand-25 transition-opacity duration-500 ${scrolled ? "opacity-0" : "opacity-100"}`} />

        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.2] z-[1]">
          <Sparkles className="absolute top-[20%] left-[12%] w-5 h-5 text-brand-300 animate-pulse" />
          <Heart className="absolute bottom-[35%] left-[22%] w-4 h-4 text-brand-400 animate-bounce delay-700" />
          <Flower className="absolute top-[45%] right-[12%] w-6 h-6 text-brand-500/40 animate-spin duration-[12s]" />
          <Zap className="absolute bottom-[25%] right-[28%] w-4 h-4 text-brand-200 animate-pulse delay-1000" />
          <Sparkles className="absolute top-[15%] left-[55%] w-3 h-3 text-white/40 animate-ping" />
        </div>

        {/* Mobile + Desktop: Main content area */}
        <div className="w-full">
          {/* Mobile: Column layout - Logo + Buttons on top, Search below */}
          <div className="md:hidden flex flex-col px-4 sm:px-6 relative z-10">
            {/* Top row: Menu + Logo + Buttons */}
            <div className="flex items-center justify-between py-4 sm:py-5 gap-2 sm:gap-3">
              <SWTIconButton
                onClick={() => handleSidebarOpen(true)}
                icon={<Menu size={24} className="text-brand-900 group-hover:text-brand-600 transition-colors" />}
                className="p-1.5 sm:p-2 -ml-2 sm:-ml-3 hover:bg-brand-500/10 rounded-xl transition-colors group shrink-0"
              />

              {/* Logo */}
              <Link href="/" className="group flex items-center gap-2 shrink-0 flex-1">
                <div className="relative overflow-hidden w-9 h-9 sm:w-10 sm:h-10 bg-brand-500 rounded-xl flex items-center justify-center transform rotate-12 group-hover:rotate-0 transition-all duration-500 shadow-xl shadow-brand-500/30 shrink-0">
                  <div className="absolute inset-0 bg-white/40 animate-sweep z-0 pointer-events-none mix-blend-overlay" />
                  <span className="relative z-10 text-white font-black text-xl italic drop-shadow-sm">C</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-lg sm:text-xl text-brand-900 tracking-tight leading-none">
                    COSMETICS
                  </span>
                </div>
              </Link>

              {/* Action Buttons (Cart + Avatar) on right */}
              {children}
            </div>
            
            {/* Bottom row: Search full width */}
            <Suspense fallback={<HeaderSearchFallback />}>
              <HeaderSearchInput />
            </Suspense>
          </div>

          {/* Desktop: Search + Buttons on one row with logo */}
          <div className="hidden md:flex max-w-7xl mx-auto w-full items-center justify-start px-4 sm:px-6 gap-3 sm:gap-4 md:gap-4 relative z-10 transition-all duration-700">
            <SWTIconButton
              onClick={() => handleSidebarOpen(true)}
              icon={<Menu size={24} className="text-brand-900 group-hover:text-brand-600 transition-colors" />}
              className="lg:hidden p-1.5 sm:p-2 -ml-1 sm:-ml-2 hover:bg-brand-500/10 rounded-xl transition-colors group shrink-0"
            />

            <Link href="/" className="group flex items-center gap-2 sm:gap-3 shrink-0">
              <div className="relative overflow-hidden w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 bg-brand-500 rounded-xl flex items-center justify-center transform rotate-12 group-hover:rotate-0 transition-all duration-500 shadow-xl shadow-brand-500/30 shrink-0">
                <div className="absolute inset-0 bg-white/40 animate-sweep z-0 pointer-events-none mix-blend-overlay" />
                <span className="relative z-10 text-white font-black text-2xl italic drop-shadow-sm">C</span>
              </div>
              <div className="flex flex-col">
                <span className="font-black text-xl md:text-2xl text-brand-900 tracking-tight leading-none">
                  COSMETICS
                </span>
                <span className="hidden sm:block font-bold text-[10px] md:text-[11px] text-brand-600 tracking-[0.3em] leading-none mt-1.5 uppercase">
                  Premium Beauty Shop
                </span>
              </div>
            </Link>

            {/* Desktop: Search + Buttons on same row */}
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4 flex-1 md:flex-1">
              <Suspense fallback={<HeaderSearchFallback />}>
                <HeaderSearchInput />
              </Suspense>
              {children}
            </div>
          </div>
        </div>

        {/* Menu Navigation */}
        <div className={`hidden lg:block overflow-hidden transition-all duration-[250ms] ease-out origin-top ${scrolled ? "max-h-0 opacity-0 -translate-y-2" : "max-h-[76px] opacity-100 translate-y-0"}`}>
          <div className="pt-5 border-t border-brand-200/50 mt-2">
            <div className="max-w-7xl mx-auto h-[48px] flex items-center justify-center">
              <Suspense fallback={null}>
                <MenuCustomer categories={dynamicCategories} />
              </Suspense>
            </div>
          </div>
        </div>

        <AppSideBar
          open={sidebarOpen}
          onClose={() => handleSidebarOpen(false)}
          categories={dynamicCategories}
          brands={initialBrands}
        />
      </header>
    </>
  );
}