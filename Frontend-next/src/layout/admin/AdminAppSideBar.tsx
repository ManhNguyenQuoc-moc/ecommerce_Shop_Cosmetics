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
      className={`h-screen bg-slate-950 flex flex-col border-r border-slate-800 shadow-xl z-50 fixed lg:relative transition-all duration-300 ease-in-out
        ${showLabel ? "w-[260px]" : "w-[88px]"}
        ${!isExpanded && isHovered ? "absolute h-screen shadow-2xl" : ""}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
    >
      
      {/* Brand Logo */}
      <div className={`h-[76px] flex items-center border-b border-slate-800/60 ${showLabel ? "px-6" : "px-0 justify-center"}`}>
        <Link href="/admin" className="flex items-center gap-3 w-full group overflow-hidden">
          <div className={`flex-shrink-0 bg-brand-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/30 transform transition-transform group-hover:scale-105 ${showLabel ? "w-9 h-9" : "w-11 h-11 mx-auto"}`}>
            <span className={`text-white font-black italic leading-none drop-shadow-sm ${showLabel ? "text-xl" : "text-2xl"}`}>C</span>
          </div>
          {showLabel && (
            <div className="flex flex-col whitespace-nowrap animate-fade-in">
              <span className="font-black text-[16px] tracking-tight leading-none text-white">
                COSMETICS
              </span>
              <span className="font-bold text-[9px] text-brand-400 tracking-[0.2em] leading-none mt-1.5 uppercase">
                Admin Panel
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        {showLabel && (
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2 mt-2 whitespace-nowrap animate-fade-in">
            Hệ thống
          </div>
        )}
        
        {adminNavItems.map((item) => {
          const active = pathname === item.path || (pathname.startsWith(item.path) && item.path !== "/admin");

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`group flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300
              ${showLabel ? "gap-3.5" : "justify-center"}
              ${active ? "bg-brand-500/10 text-brand-400" : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"}`}
            >
              <div className={`p-2 rounded-lg transition-colors flex-shrink-0 ${active ? "bg-brand-500 text-white shadow-md shadow-brand-500/20" : "bg-transparent group-hover:bg-slate-700"}`}>
                <item.icon size={20} strokeWidth={active ? 2.5 : 2} />
              </div>
              {showLabel && <span className="whitespace-nowrap animate-fade-in">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer Details */}
      {showLabel && (
        <div className="p-4 border-t border-slate-800/60 whitespace-nowrap animate-fade-in">
          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-brand-500/10 blur-xl rounded-full translate-x-1/2 -translate-y-1/2" />
            <p className="text-xs text-slate-400 leading-relaxed relative z-10">
              Hệ thống Quản trị <span className="text-white font-semibold flex-shrink-0">C Cosmetics</span> <br/>
              Phiên bản 2.0.1
            </p>
          </div>
        </div>
      )}

    </aside>
  );
}