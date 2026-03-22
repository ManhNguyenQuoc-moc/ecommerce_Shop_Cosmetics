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
      className={`h-screen bg-white/90 dark:bg-slate-950/85 backdrop-blur-xl border-r border-slate-200 dark:border-pink-500/20 flex flex-col shadow-xl z-50 fixed lg:relative transition-all duration-300 ease-in-out
        ${showLabel ? "w-[260px]" : "w-[88px]"}
        ${!isExpanded && isHovered ? "absolute h-screen shadow-2xl" : ""}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
    >
      
      {/* Brand Logo */}
      <div className={`h-[90px] flex items-center border-b border-slate-200 dark:border-cyan-500/20 ${showLabel ? "px-6" : "px-0 justify-center"}`}>
        <Link href="/admin" className="flex items-center gap-3 w-full group overflow-hidden">
          <div className={`flex-shrink-0 bg-gradient-to-br from-brand-400 to-rose-600 dark:from-cyan-400 dark:to-fuchsia-600 rounded-xl flex items-center justify-center shadow-md dark:shadow-[0_0_15px_rgba(0,240,255,0.4)] transform transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 ${showLabel ? "w-9 h-9" : "w-11 h-11 mx-auto"}`}>
            <span className={`text-white font-black italic leading-none drop-shadow-md ${showLabel ? "text-xl" : "text-2xl"}`}>C</span>
          </div>
          {showLabel && (
            <div className="flex flex-col whitespace-nowrap animate-fade-in">
              <span className="font-black text-[16px] tracking-tight leading-none text-slate-800 dark:text-cyan-50 dark:drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]">
                COSMETICS
              </span>
              <span className="font-bold text-[9px] text-brand-600 dark:text-fuchsia-400 tracking-[0.2em] leading-none mt-1.5 uppercase dark:drop-shadow-[0_0_5px_rgba(255,0,128,0.5)]">
                Admin Panel
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        {showLabel && (
          <div className="text-xs font-bold text-slate-400 dark:text-cyan-600/80 uppercase tracking-widest mb-4 px-2 mt-2 whitespace-nowrap animate-fade-in">
            Hệ thống
          </div>
        )}
        
        {adminNavItems.map((item) => {
          const active = pathname === item.path || (pathname.startsWith(item.path) && item.path !== "/admin");

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`group flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border border-transparent
              ${showLabel ? "gap-3.5" : "justify-center"}
              ${active ? "bg-gradient-to-r from-brand-500 to-rose-600 dark:bg-none dark:bg-cyan-500/10 text-white dark:text-cyan-300 border-transparent dark:border-cyan-500/30 shadow-md shadow-brand-500/30 dark:shadow-[0_0_15px_rgba(0,240,255,0.15)]" : "text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-fuchsia-300 hover:bg-slate-100 dark:hover:bg-fuchsia-500/10 dark:hover:border-fuchsia-500/20"}`}
            >
              <div className={`p-2 rounded-lg transition-all duration-300 flex-shrink-0 ${active ? "bg-white/20 dark:bg-gradient-to-br dark:from-cyan-400 dark:to-fuchsia-600 text-white shadow-sm dark:shadow-[0_0_10px_rgba(0,240,255,0.4)]" : "bg-transparent text-slate-400 dark:text-slate-500 group-hover:text-brand-500 dark:group-hover:text-fuchsia-400"}`}>
                <item.icon size={20} strokeWidth={active ? 2.5 : 2} />
              </div>
              {showLabel && <span className="whitespace-nowrap animate-fade-in drop-shadow-sm">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer Details */}
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showLabel ? "max-h-[150px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="w-[260px] p-4 border-t border-slate-200 dark:border-cyan-500/20 whitespace-nowrap">
          <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-4 border border-slate-200 dark:border-cyan-500/20 relative overflow-hidden shadow-sm dark:shadow-[0_0_10px_rgba(0,240,255,0.05)]">
            <div className="absolute top-0 right-0 w-16 h-16 bg-brand-500/10 dark:bg-fuchsia-500/20 blur-xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed relative z-10">
              Hệ thống Quản trị <span className="text-brand-500 dark:text-cyan-400 font-bold flex-shrink-0 dark:drop-shadow-[0_0_2px_rgba(0,240,255,0.8)]">C Cosmetics</span> <br/>
              Phiên bản 2.0.1
            </p>
          </div>
        </div>
      </div>

    </aside>
  );
}