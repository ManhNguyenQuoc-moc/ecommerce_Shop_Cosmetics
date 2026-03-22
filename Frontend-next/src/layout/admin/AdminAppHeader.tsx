"use client";

import { Bell, Search, ChevronDown, UserSquare2, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { adminNavItems } from "@/src/@core/http/routes/admin-nav";
import { useSidebar } from "@/src/context/SidebarContext";

export default function AdminAppHeader() {
  const pathname = usePathname();
  const { toggleSidebar, toggleMobileSidebar } = useSidebar();
  
  // Find current active route name
  const currentNav = adminNavItems.find(item => 
    pathname === item.path || (pathname.startsWith(item.path) && item.path !== "/admin")
  );
  const title = currentNav ? currentNav.name : "Admin Dashboard";

  return (
    <header className="h-[76px] bg-white border-b border-slate-200/60 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40 shadow-sm shadow-slate-100/50">
      
      {/* Left: Hamburger & Dynamic Title */}
      <div className="flex items-center gap-3 md:gap-4">
        <button 
          onClick={() => {
            if (window.innerWidth >= 1024) toggleSidebar();
            else toggleMobileSidebar();
          }}
          className="p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
          <Menu size={24} />
        </button>
        <h1 className="font-bold text-lg md:text-xl text-slate-800 tracking-tight hidden sm:block">
          {title}
        </h1>
      </div>

      {/* Center/Right: Search */}
      <div className="flex-1 max-w-md px-4 md:px-8 hidden md:block">
        <div className="relative group">
          <input 
            type="text" 
            placeholder="Tìm kiếm mã đơn hàng, sản phẩm..." 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-700 outline-none focus:bg-white focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/10 transition-all shadow-sm group-hover:border-slate-300"
          />
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 md:gap-4">

        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
          <Bell size={20} />
          {/* Red Ping Dot */}
          <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        </button>

        <div className="w-px h-8 bg-slate-200 mx-1 md:mx-2" />

        {/* Profile Dropdown Trigger */}
        <div className="flex items-center gap-3 cursor-pointer p-1.5 pr-2 md:pr-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group">
          <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center overflow-hidden border border-brand-100 group-hover:scale-105 transition-transform duration-300">
            <UserSquare2 size={24} strokeWidth={1.5} />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-bold text-slate-800 leading-none">Quản trị viên</span>
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider mt-1">Super Admin</span>
          </div>
          <ChevronDown size={16} className="text-slate-400 ml-1 group-hover:translate-y-0.5 transition-transform hidden sm:block" />
        </div>

      </div>
    </header>
  );
}