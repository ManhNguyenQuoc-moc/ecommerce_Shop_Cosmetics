"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, LayoutGrid } from "lucide-react";
import SWTIconButton from "@/src/@core/component/SWTIconButton";
import { Category } from "@/src/@core/type/category";
import { BrandResponseDto } from "@/src/services/customer/customer.service";
import { Sparkles } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  brands: BrandResponseDto[];
};

export default function AppSideBar({ open, onClose, categories, brands }: Props) {
  const pathname = usePathname();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`
        fixed top-0 left-0 h-screen w-[280px]
        bg-white/95 backdrop-blur-xl border-r border-slate-200
        shadow-2xl z-50
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:hidden
      `}
      >
        {/* Header / Brand Logo */}
        <div className="h-[90px] flex items-center justify-between px-6 border-b border-slate-200/80 shrink-0">
          <Link href="/" className="flex items-center gap-3 group" onClick={onClose}>
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-brand-400 to-rose-600 rounded-xl flex items-center justify-center shadow-md shadow-brand-500/20 transform transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
              <span className="text-white font-black text-xl italic leading-none drop-shadow-md">C</span>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-[16px] tracking-tight leading-none text-slate-800">
                COSMETICS
              </span>
              <span className="font-bold text-[9px] text-brand-600 tracking-[0.2em] leading-none mt-1.5 uppercase">
                Premium Shop
              </span>
            </div>
          </Link>
          <SWTIconButton
            onClick={onClose}
            icon={<X size={20} className="stroke-[2.5]" />}
            className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          />
        </div>

        {/* Categories Menu */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">
            Danh mục sản phẩm
          </div>
          
          {categories.filter(c => c.name.toLowerCase() !== 'thương hiệu').map((category) => {
            const active = pathname === category.path || (category.children?.some(c => pathname === c.path));
            return (
              <div key={category.slug} className="space-y-1">
                <Link
                  href={category.path}
                  onClick={onClose}
                  className={`group flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300
                    ${active 
                      ? "bg-gradient-to-r from-brand-500 to-rose-600 text-white shadow-md shadow-brand-500/30" 
                      : "text-slate-600 hover:text-brand-600 hover:bg-slate-50"
                    }
                  `}
                >
                  <div className={`p-2 rounded-lg transition-all duration-300 flex-shrink-0 
                    ${active 
                      ? "bg-white/20 text-white shadow-sm" 
                      : "bg-transparent text-slate-400 group-hover:text-brand-500"
                    }
                  `}>
                    <LayoutGrid size={18} strokeWidth={active ? 2.5 : 2} />
                  </div>
                  <span>{category.name}</span>
                </Link>
                
                {category.children && (
                  <div className="ml-12 flex flex-col gap-1 border-l border-slate-100 pl-4 py-1">
                    {category.children.map(child => (
                      <Link 
                        key={child.slug}
                        href={child.path}
                        onClick={onClose}
                        className={`text-[13px] py-1.5 transition-colors ${pathname === child.path ? 'text-brand-500 font-bold' : 'text-slate-500 hover:text-brand-600'}`}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          
          {/* Brands Section */}
          <div className="pt-6 mt-6 border-t border-slate-100">
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Thương hiệu phổ biến
              </div>
              <Link 
                href="/brands" 
                onClick={onClose}
                className="text-[11px] font-bold text-brand-500 hover:text-brand-600 transition-colors bg-brand-50 px-2 py-0.5 rounded-full"
              >
                Tất cả
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2 px-2">
              {Array.isArray(brands) && brands.slice(0, 6).map((brand) => (
                <Link
                  key={brand.id}
                  href={`/products?brand=${brand.slug}`}
                  onClick={onClose}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-brand-50 border border-slate-100 hover:border-brand-200 transition-all group"
                >
                  <div className="w-10 h-10 relative bg-white rounded-lg shadow-sm overflow-hidden p-1 border border-slate-100">
                    {brand.logo?.url ? (
                      <img 
                        src={brand.logo.url} 
                        alt={brand.name} 
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <Sparkles size={16} />
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-slate-600 group-hover:text-brand-600 text-center truncate w-full">
                    {brand.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Sidebar Footer Details */}
        <div className="p-6 border-t border-slate-200/80 shrink-0">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-16 h-16 bg-brand-500/10 blur-xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <p className="text-xs text-slate-500 leading-relaxed relative z-10">
              Hỗ trợ khách hàng: <br/>
              <span className="text-brand-500 font-bold block mt-1 text-sm">1900 6868</span>
            </p>
          </div>
        </div>

      </aside>
    </>
  );
}