import React from "react";
import { LayoutDashboard } from "lucide-react";
import AdminPageHeader from "./components/AdminPageHeader";
import DashboardClient from "./DashboardClient";

export const metadata = {
  title: "Thống Kê Hệ Thống | Admin",
};

export const dynamic = "force-dynamic";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Thống Kê Hệ Thống"
        subtitle="Theo dõi hiệu suất mỹ phẩm và doanh thu hệ thống."
        icon={<LayoutDashboard size={32} />}
        breadcrumbs={[
          { title: "Trang chủ", href: "/admin" },
          { title: "Dashboard" }
        ]}
      />

      <DashboardClient />
    </div>
  );
}