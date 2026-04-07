"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SWTBreadcrumb from "@/src/@core/component/AntD/SWTBreadcrumb";
import {
  User,
  Package,
  Star,
  TicketPercent,
} from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";
import SWTAvatar from "@/src/@core/component/AntD/SWTAvatar";
import SWTCard from "@/src/@core/component/AntD/SWTCard";

const menu = [
  {
    name: "Thông tin cá nhân",
    icon: User,
    path: "/profile",
  },
  {
    name: "Lịch sử đơn hàng",
    icon: Package,
    path: "/profile/orders",
  },
  {
    name: "Quản lý điểm thưởng",
    icon: Star,
    path: "/profile/points",
  },
  {
    name: "Quản lý mã giảm giá",
    icon: TicketPercent,
    path: "/profile/vouchers",
  },
];

import { useState, useEffect } from "react";
import ProfileSkeleton, { ProfileSidebarSkeleton } from "./components/ProfileSkeleton";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { currentUser, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentMenu = menu.find((m) =>
    pathname.startsWith(m.path)
  );

  const breadcrumbItems = [
    {
      title: <Link href="/">Trang chủ</Link>,
    },
    {
      title: <Link href="/profile">Tài khoản</Link>,
    },
  ];
  if (currentMenu && pathname !== "/profile") {
    breadcrumbItems.push({
      title: <span>{currentMenu.name}</span>,
    });
  }
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-6">
      <SWTBreadcrumb items={breadcrumbItems} />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <aside className="md:col-span-1">
          <div className="sticky top-24 space-y-4">
            {!mounted ? (
              <ProfileSidebarSkeleton />
            ) : (
              <SWTCard className="!p-0 !rounded-2xl !border-none !shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-brand-50 to-rose-50 p-6 flex flex-col items-center text-center">
                  <div className="relative mb-3">
                    <SWTAvatar 
                      size={80} 
                      src={currentUser?.avatar} 
                      className="border-4 border-white shadow-md bg-white" 
                    />
                    <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg leading-tight truncate w-full px-2">
                    {currentUser?.name || "Khách hàng"}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-medium">Tài khoản thành viên</p>
                </div>

                <div className="p-3 bg-white">
                  <nav className="flex flex-col gap-1">
                    {menu.map((item) => {
                      const Icon = item.icon;
                      const active = pathname === item.path;

                      return (
                        <Link
                          key={item.path}
                          href={item.path}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
                          ${
                            active
                              ? "bg-brand-500 text-white font-semibold shadow-md shadow-brand-200 hover:text-white hover:bg-brand-600"
                              : "text-gray-600 hover:bg-gray-50 hover:text-brand-600"
                          }`}
                        >
                          <Icon 
                            size={18} 
                            className={`transition-colors duration-300 ${active ? "text-white" : "text-gray-400 group-hover:text-brand-500"}`} 
                          />
                          <span className="text-sm">{item.name}</span>
                          {active && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></div>}
                        </Link>
                      );
                    })}
                  </nav>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => logout()}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-300 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                      </div>
                      <span className="text-sm font-medium">Đăng xuất</span>
                    </button>
                  </div>
                </div>
              </SWTCard>
            )}

            <SWTCard className="!bg-brand-50 !rounded-2xl border-1 !border-brand-100 !mt-4" bodyClassName="!p-4">
               <p className="text-xs text-brand-700 font-bold mb-1 italic">Bạn cần hỗ trợ?</p>
               <p className="text-[10px] text-brand-600 leading-relaxed font-medium">Nếu có bất kỳ thắc mắc nào, hãy liên hệ với chúng tôi ngay nhé!</p>
               <button className="mt-2 text-[10px] text-white bg-brand-500 hover:bg-brand-600 px-3 py-1.5 rounded-full font-bold transition-all">
                 Liên hệ ngay
               </button>
            </SWTCard>

          </div>
        </aside>
        <main className="md:col-span-3 min-h-[600px]">
          {children}
        </main>

      </div>

    </div>
  );
}