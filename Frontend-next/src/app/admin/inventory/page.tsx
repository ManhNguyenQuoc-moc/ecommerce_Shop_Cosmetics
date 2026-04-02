"use client";

import React, { Suspense, useTransition } from "react";
import useSWTTitle from "@/src/@core/hooks/useSWTTitle";
import SWTBreadcrumb from "@/src/@core/component/AntD/SWTBreadcrumb";
import SWTTabs from "@/src/@core/component/AntD/SWTTabs";
import { Package, Activity, Info } from "lucide-react";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import InventoryTable from "./components/InventoryTable";
import InventoryFilters from "./components/InventoryFilters";
import InventoryCharts from "./components/InventoryCharts";

export default function InventoryPage() {
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
        <div className="mt-4 p-6 bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl shadow-sm border border-slate-200 dark:border-blue-500/20 transition-colors">
          <InventoryFilters startTransition={startTransition} />
          <InventoryTable isPending={isPending} />
        </div>
      )
    },
    {
      key: "analytics",
      label: "Phân tích kho",
      children: (
        <div className="mt-4 p-6 bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl shadow-sm border border-slate-200 dark:border-purple-500/20 transition-colors">
          <InventoryCharts />
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in relative z-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <SWTBreadcrumb items={[
            { title: "Trang chủ", href: "/admin" },
            { title: "Tồn kho" }
          ]} />
          <div className="relative mt-2 overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2.5 rounded-tl-xl rounded-tr-3xl rounded-br-3xl rounded-bl-md shadow-lg shadow-blue-500/40 border border-white/20 flex items-center gap-3 w-fit group/title cursor-default mt-3 mb-2">
            <div className="absolute inset-0 bg-white/20 -skew-x-12 animate-sweep" />
            <Package size={28} className="drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] animate-pulse shrink-0" />
            <h2 className="!mb-0 text-2xl font-black tracking-tight drop-shadow-md whitespace-nowrap">
              Quản lý Tồn kho
            </h2>
          </div>
          <p className="text-blue-500 dark:text-cyan-400 text-sm font-semibold uppercase tracking-widest drop-shadow-sm">
             Theo dõi số lượng hàng, hạn sử dụng và lịch sử nhập xuất.
          </p>
        </div>

        <SWTTooltip
          title={<span className="text-sm">Quản lý lô hàng, hạn sử dụng và phân tích tồn kho thực tế.</span>}
          placement="left"
          color="blue"
        >
          <div className="!h-11 !w-11 flex items-center justify-center bg-blue-50 hover:bg-blue-500/10 dark:bg-slate-800 dark:hover:bg-slate-700 text-blue-600 dark:text-blue-400 rounded-xl cursor-help transition-all shadow-sm border border-blue-200 dark:border-slate-700 group">
            <Info size={22} className="stroke-[2.5] group-hover:scale-110 transition-transform" />
          </div>
        </SWTTooltip>
      </div>

      <div className="w-full">
        <Suspense>
          <SWTTabs
            activeKey={activeTab}
            onChange={onTabChange}
            items={tabItems}
            className="[&_.ant-tabs-nav]:!mb-0 [&_.ant-tabs-nav]:after:!hidden [&_.ant-tabs-tab]:!px-6 [&_.ant-tabs-tab]:!py-3 [&_.ant-tabs-tab-active]:!bg-blue-500/10 [&_.ant-tabs-tab]:!rounded-t-2xl transition-all"
          />
        </Suspense>
      </div>
    </div>
  );
}
