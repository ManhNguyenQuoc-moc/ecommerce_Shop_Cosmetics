"use client";

import React, { Suspense, useTransition } from "react";
import useSWTTitle from "@/src/@core/hooks/useSWTTitle";
import SWTTabs from "@/src/@core/component/AntD/SWTTabs";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import InventoryTable from "./components/InventoryTable";
import InventoryFilters from "./components/InventoryFilters";
import InventoryCharts from "./components/InventoryCharts";

export default function InventoryClient() {
  useSWTTitle("Quản lý Tồn Kho | Admin");
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeTab = searchParams.get("tab") || "list";

  const onTabChange = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", key);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const tabItems = [
    {
      key: "list",
      label: "Danh sách tồn kho",
      children: (
        <div className="mt-4 p-6 bg-white/80 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200 dark:border-admin-sidebar-border transition-colors">
          <InventoryFilters startTransition={startTransition} />
          <InventoryTable isPending={isPending} />
        </div>
      )
    },
    {
      key: "analytics",
      label: "Phân tích kho",
      children: (
        <div className="mt-4 p-6 bg-white/80 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200 dark:border-admin-sidebar-border transition-colors">
          <InventoryCharts />
        </div>
      )
    }
  ];

  return (
    <div className="w-full">
      <Suspense>
        <SWTTabs
          activeKey={activeTab}
          onChange={onTabChange}
          items={tabItems}
          className="[&_.ant-tabs-nav]:!mb-0 [&_.ant-tabs-nav]:after:!hidden [&_.ant-tabs-tab]:!px-6 [&_.ant-tabs-tab]:!py-3 [&_.ant-tabs-tab-active]:!bg-brand-500/10 [&_.ant-tabs-tab]:!rounded-t-2xl transition-all"
        />
      </Suspense>
    </div>
  );
}
