import React from "react";
import SWTBreadcrumb from "@/src/@core/component/AntD/SWTBreadcrumb";
import { LayoutDashboard } from "lucide-react";
import DashboardClient from "./DashboardClient";

export const metadata = {
  title: "Thống Kê Hệ Thống | Admin",
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="mb-4">
        <SWTBreadcrumb items={[
          { title: "Trang chủ", href: "/admin" },
          { title: "Dashboard" }
        ]} />
        <div className="flex items-center gap-3.5 mt-4 mb-2">
          <LayoutDashboard size={32} className="text-brand-500 shrink-0" />
          <h2 className="!mb-0 text-3xl font-black tracking-tight text-brand-600 dark:text-admin-accent whitespace-nowrap">
            Thống Kê Hệ Thống
          </h2>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-widest mt-1">
          Theo dõi hiệu suất mỹ phẩm và doanh thu hệ thống.
        </p>
      </div>

      <DashboardClient />
    </div>
  );
}