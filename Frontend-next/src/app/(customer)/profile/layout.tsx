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

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { currentUser } = useAuth();

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

      {/* Breadcrumb */}
      <SWTBreadcrumb items={breadcrumbItems} />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* Sidebar */}
        <aside className="md:col-span-1 space-y-4">
          <SWTCard className="!p-4 !rounded-2xl !border-none !shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <SWTAvatar size={48} src={currentUser?.avatar} className="bg-brand-100" />
              <div className="overflow-hidden">
                 <p className="text-xs text-gray-500">Tài khoản của</p>
                 <p className="font-bold text-gray-800 truncate">{currentUser?.name || "Khách hàng"}</p>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              {menu.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                    ${
                      active
                        ? "bg-brand-50 text-brand-600 font-bold shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-brand-500"
                    }`}
                  >
                    <Icon size={20} className={active ? "text-brand-600" : "text-gray-400"} />
                    <span className="text-sm">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </SWTCard>
        </aside>

        {/* Content */}
        <main className="md:col-span-3 min-h-[600px]">
          {children}
        </main>

      </div>

    </div>
  );
}