"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavItems } from "@/src/@core/http/routes/admin-nav";
import { useSidebar } from "@/src/context/SidebarContext";

export default function AdminAppSideBar() {
  const pathname = usePathname();
  const { isExpanded, isHovered, isMobileOpen, setIsHovered } = useSidebar();

  const showLabel = isExpanded || isHovered || isMobileOpen;

  return (
    <aside 
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`h-screen bg-white/90 dark:bg-slate-950/85 backdrop-blur-xl border-r border-slate-200 dark:border-admin-sidebar-border flex flex-col shadow-xl z-50 fixed lg:relative transition-all duration-300 ease-in-out
        ${showLabel ? "w-[320px]" : "w-[105px]"}
        ${!isExpanded && isHovered ? "absolute h-screen shadow-2xl" : ""}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
    >
      
      {/* Brand Logo */}
      <div className={`h-[90px] flex items-center border-b border-border-default dark:border-border-brand ${showLabel ? "px-6" : "px-0 justify-center"}`}>
        <Link href="/admin" className={`group flex items-center shrink-0 ${showLabel ? "gap-3" : ""}`}>
          <div className={`relative overflow-hidden flex-shrink-0 bg-brand-500 rounded-xl flex items-center justify-center shadow-xl shadow-brand-500/30 transform rotate-12 group-hover:rotate-0 transition-all duration-500 ${showLabel ? "w-10 h-10" : "w-11 h-11"}`}>
            {/* Hiệu ứng quét sáng */}
            <div className="absolute inset-0 bg-white/40 animate-sweep z-0 pointer-events-none mix-blend-overlay rounded-xl" />
            <span className={`relative z-10 text-white font-black italic leading-none drop-shadow-sm select-none ${showLabel ? "text-xl" : "text-2xl"}`}>C</span>
          </div>
          {showLabel && (
            <div className="flex flex-col whitespace-nowrap animate-fade-in transition-all duration-700">
              <span className="font-black text-xl md:text-2xl text-brand-900 dark:text-white tracking-tight leading-none uppercase">
                COSMETICS
              </span>
              <span className="font-bold text-[10px] md:text-[11px] text-brand-600 dark:text-brand-500 tracking-[0.3em] leading-none mt-1.5 uppercase">
                Admin Panel
              </span>
            </div>
          )}
        </Link>
      </div>

{/* Navigation */}
   <nav className="flex-1 p-3 space-y-1 overflow-y-auto !scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {showLabel && (
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5 px-3 mt-2 whitespace-nowrap animate-fade-in">
            Hệ thống
          </div>
        )}
        
        {adminNavItems.map((item) => {
          const active = pathname === item.path || (pathname.startsWith(item.path) && item.path !== "/admin");

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`group flex items-center px-3 py-2.5 rounded-xl text-sm transition-all duration-300 border border-transparent
              ${showLabel ? "gap-3" : "justify-center"}
              ${active ? "bg-gradient-to-r from-brand-500 to-rose-600 dark:bg-none dark:bg-brand-500/10 !text-white dark:text-brand-500 border-transparent dark:border-border-brand shadow-sm" : "text-text-sub hover:text-brand-600 dark:hover:text-brand-500 hover:bg-bg-muted dark:hover:bg-brand-500/5 dark:hover:border-border-brand/20"}`}
            >
              <div className={`p-1.5 rounded-lg transition-all duration-300 flex-shrink-0 ${active ? "bg-white/20 dark:bg-brand-500 text-white" : "bg-transparent text-text-muted group-hover:text-brand-500"}`}> 
                <item.icon size={20} strokeWidth={active ? 2.5 : 2} />
              </div>
              {showLabel && (
                <span className="whitespace-nowrap animate-fade-in text-[14.5px] font-medium tracking-tight">
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showLabel ? "max-h-[150px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="w-[320px] p-4 border-t border-border-default dark:border-border-brand whitespace-nowrap">
          <div className="bg-bg-muted rounded-xl p-4 border border-border-default dark:border-border-brand relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-16 h-16 bg-brand-500/10 blur-xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <p className="text-xs text-text-muted leading-relaxed relative z-10">
              Hệ thống Quản trị <span className="text-brand-500 font-bold flex-shrink-0">C Cosmetics</span> <br/>
              Phiên bản 2.0.1
            </p>
          </div>
        </div>
      </div>

    </aside>
  );
}