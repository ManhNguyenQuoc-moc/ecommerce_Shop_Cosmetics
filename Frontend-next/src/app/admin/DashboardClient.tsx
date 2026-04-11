"use client";

import React from "react";
import SWTTabs from "@/src/@core/component/AntD/SWTTabs";
import SimpleDashboard from "./components/dashboard/SimpleDashboard";
import AdvancedDashboard from "./components/dashboard/AdvancedDashboard";

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
