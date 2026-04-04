"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import SWTTabs from "@/src/@core/component/AntD/SWTTabs";
import SimpleDashboard from "./components/dashboard/SimpleDashboard";
import AdvancedDashboard from "./components/dashboard/AdvancedDashboard";
import SWTBreadcrumb from "@/src/@core/component/AntD/SWTBreadcrumb";
import { LayoutDashboard } from "lucide-react";
import useSWTTitle from "@/src/@core/hooks/useSWTTitle";

export default function AdminDashboardPage() {
  useSWTTitle("Thống Kê Hệ Thống | Admin");
  const [isLoading, setIsLoading] = useState(false);
  const tabsItems = [
    {
      key: "simple",
      label: "Tổng Quan Kinh Doanh",
      children: <SimpleDashboard />,
    },
    {
      key: "advanced",
      label: "Phân Tích Chi Tiết",
      children: <AdvancedDashboard />,
    }
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-brand-600 gap-4">
        <Loader2 size={40} className="animate-spin" />
        <span className="text-sm font-medium text-slate-500">Đang tải biểu đồ...</span>
      </div>
    );
  }

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

      <div className="bg-transparent rounded-2xl">
        <SWTTabs 
          items={tabsItems}
          defaultActiveKey="simple"
          size="large"
          className="!admin-dashboard-tabs"
        />
      </div>
    </div>
  );
}