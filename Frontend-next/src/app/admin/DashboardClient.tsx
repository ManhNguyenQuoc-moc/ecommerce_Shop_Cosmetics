"use client";

import React from "react";
import SWTTabs from "@/src/@core/component/AntD/SWTTabs";
import dynamic from "next/dynamic";
import AdminDashboardLoading from "./components/AdminDashboardLoading";

const SimpleDashboard = dynamic(() => import("./components/dashboard/SimpleDashboard"), {
  loading: () => <AdminDashboardLoading />,
});

const AdvancedDashboard = dynamic(() => import("./components/dashboard/AdvancedDashboard"), {
  loading: () => <AdminDashboardLoading />,
});

export default function DashboardClient() {
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

  return (
    <div className="bg-transparent rounded-2xl">
      <SWTTabs 
        items={tabsItems}
        defaultActiveKey="simple"
        size="large"
        className="!admin-dashboard-tabs"
      />
    </div>
  );
}
