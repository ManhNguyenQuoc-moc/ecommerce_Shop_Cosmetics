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

      <div className="grid grid-cols-12 gap-6">

        {/* Sidebar */}
        <aside className="col-span-3 bg-white border rounded-xl p-4 h-fit">

          <h2 className="font-semibold mb-4 text-lg">
            Tài khoản của tôi
          </h2>

          <div className="flex flex-col gap-2">

            {menu.map((item) => {

              const Icon = item.icon;
              const active = pathname === item.path;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition
                  ${
                    active
                      ? "bg-pink-50 text-brand-600 font-semibold"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              );
            })}

          </div>

        </aside>

        {/* Content */}
        <main className="col-span-9 bg-white border rounded-xl p-6">
          {children}
        </main>

      </div>

    </div>
  );
}