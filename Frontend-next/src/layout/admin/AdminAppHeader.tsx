"use client";

import { Bell, Menu, ChevronDown, User, LogOut, Sun, Moon } from "lucide-react";
import SWTIconButton from "@/src/@core/component/SWTIconButton";
import { usePathname, useRouter } from "next/navigation";
import { adminNavItems } from "@/src/@core/http/routes/admin-nav";
import { useSidebar } from "@/src/context/SidebarContext";
import { SWTInputSearch } from "@/src/@core/component/AntD/SWTInput";
import SWTAvatar from "@/src/@core/component/AntD/SWTAvatar";
import { useAuth } from "@/src/context/AuthContext";
import { Dropdown } from "antd";
import type { MenuProps } from "antd";
import { useTheme } from "@/src/context/ThemeContext";

export default function AdminAppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { toggleSidebar, toggleMobileSidebar } = useSidebar();
  const { currentUser, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  
  // Find current active route name
  const currentNav = adminNavItems.find(item => 
    pathname === item.path || (pathname.startsWith(item.path) && item.path !== "/admin")
  );
  const title = currentNav ? currentNav.name : "Admin Dashboard";

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const accountMenu: MenuProps = {
    items: [
      {
        key: 'profile',
        label: (
          <div className="flex items-center gap-2 text-slate-700 font-medium px-2 py-1" onClick={() => router.push('/admin/profile')}>
            <User size={16} className="text-pink-500" />
            <span>Hồ sơ cá nhân</span>
          </div>
        ),
      },
      {
        type: 'divider',
      },
      {
        key: 'logout',
        label: (
          <div className="flex items-center gap-2 text-red-500 font-medium px-2 py-1 hover:text-red-600" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Đăng xuất</span>
          </div>
        ),
      },
    ],
  };

  return (
    <header className="h-[90px] shrink-0 bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-pink-500/20 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40 shadow-sm dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-colors duration-300">
      
      {/* Left: Hamburger & Dynamic Title */}
      <div className="flex items-center gap-3 md:gap-4">
        <SWTIconButton
          onClick={() => {
            if (window.innerWidth >= 1024) toggleSidebar();
            else toggleMobileSidebar();
          }}
          icon={<Menu size={24} />}
          className="p-2 -ml-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white transition-colors"
        />
        <h2 className="!mb-0 font-bold text-lg md:text-xl text-slate-800 dark:text-white tracking-tight hidden sm:block dark:drop-shadow-[0_0_5px_rgba(255,255,255,0.4)]">
          {title}
        </h2>
      </div>

      {/* Center/Right: Search */}
      <div className="flex-1 max-w-md px-4 md:px-8 hidden md:block">
        <div className="relative group">
          <SWTInputSearch 
            placeholder="Tìm kiếm mã đơn hàng, sản phẩm..." 
            className="w-full !rounded-xl !bg-slate-100 dark:!bg-slate-800/80 !border-slate-200 dark:!border-slate-700 text-slate-800 dark:!text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 md:gap-4">
        
        {/* Theme Toggle */}
        <SWTIconButton
          onClick={toggleTheme}
          icon={isDark ? <Sun size={20} className="text-brand-500" /> : <Moon size={20} className="text-slate-600" />}
          className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white transition-colors"
        />

        {/* Notifications */}
        <SWTIconButton
          icon={<Bell size={20} />}
          className="relative p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white transition-colors"
        />
        {/* Red Ping Dot */}
        <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-brand-500 dark:bg-pink-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse shadow-sm dark:shadow-[0_0_8px_#ff007f]" />

        <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-1 md:mx-2" />

        {/* Profile Dropdown Trigger */}
        <Dropdown menu={accountMenu} trigger={['click']} placement="bottomRight">
          <div className="flex items-center gap-3 cursor-pointer p-1.5 pr-2 md:pr-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent dark:hover:border-pink-500/30 transition-all group">
            <SWTAvatar 
              size={36} 
              src={currentUser?.avatar} 
              className="border-slate-200 dark:border-pink-500/50 shadow-sm dark:shadow-[0_0_10px_rgba(255,0,128,0.3)] group-hover:scale-105"
            />
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-bold text-slate-800 dark:text-white leading-none dark:drop-shadow-sm">{currentUser?.name || "Quản trị viên"}</span>
              <span className="text-[10px] uppercase font-bold text-brand-600 dark:text-pink-400 tracking-widest mt-1">Super Admin</span>
            </div>
            <ChevronDown size={16} className="text-slate-400 dark:text-pink-400 ml-1 group-hover:translate-y-0.5 transition-transform hidden sm:block" />
          </div>
        </Dropdown>

      </div>
    </header>
  );
}