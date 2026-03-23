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
        <div className="relative mt-2 overflow-hidden bg-gradient-to-r from-brand-500 to-rose-600 text-white px-5 py-2.5 rounded-tl-xl rounded-tr-3xl rounded-br-3xl rounded-bl-md shadow-lg shadow-brand-500/40 border border-white/20 flex items-center gap-3 w-fit group/title cursor-default mt-3 mb-2">
          <div className="absolute inset-0 bg-white/20 -skew-x-12 animate-sweep" />
          <LayoutDashboard size={28} className="drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] animate-pulse shrink-0" />
          <h2 className="!mb-0 text-2xl font-black tracking-tight drop-shadow-md whitespace-nowrap">
            Thống Kê Hệ Thống
          </h2>
        </div>
        <p className="mt-3 text-brand-500 dark:text-cyan-400 text-sm font-semibold uppercase tracking-widest drop-shadow-sm dark:drop-shadow-[0_0_5px_rgba(0,240,255,0.3)]">
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