"use client";

import React, { Suspense, useTransition } from "react";
import { Truck, Info } from "lucide-react";
import SWTBreadcrumb from "@/src/@core/component/AntD/SWTBreadcrumb";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";
import useSWTTitle from "@/src/@core/hooks/useSWTTitle";
import POTable from "./components/POTable";
import POFilters from "./components/POFilters";

export default function PurchasesPage() {
  useSWTTitle("Quản Lý Nhập Hàng | Admin");
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <SWTBreadcrumb
            items={[
              { title: "Trang chủ", href: "/admin" },
              { title: "Quản lý Nhập hàng" },
            ]}
          />
          <div className="relative mt-3 mb-2 overflow-hidden bg-gradient-to-r from-amber-500 to-orange-600 text-white px-5 py-2.5 rounded-tl-xl rounded-tr-3xl rounded-br-3xl rounded-bl-md shadow-lg shadow-amber-500/40 border border-white/20 flex items-center gap-3 w-fit group/title cursor-default">
            <div className="absolute inset-0 bg-white/20 -skew-x-12 animate-sweep" />
            <Truck size={28} className="drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] animate-pulse shrink-0" />
            <h2 className="!mb-0 text-2xl font-black tracking-tight drop-shadow-md whitespace-nowrap">
              Quản lý Nhập hàng (PO)
            </h2>
          </div>
          <p className="text-amber-600 dark:text-amber-400 text-sm font-semibold uppercase tracking-widest drop-shadow-sm">
            Tạo phiếu nhập, duyệt và theo dõi trạng thái biên nhận hàng hóa.
          </p>
        </div>
        <SWTTooltip
          title={<span className="text-sm">Theo dõi các đơn nhập hàng từ thương hiệu và quản lý kho.</span>}
          placement="left"
          color="orange"
        >
          <div className="!h-11 !w-11 flex items-center justify-center bg-amber-50 hover:bg-amber-500/10 dark:bg-slate-800 dark:hover:bg-slate-700 text-amber-600 dark:text-orange-400 rounded-xl cursor-help transition-all shadow-sm border border-amber-200 dark:border-slate-700 group">
            <Info size={22} className="stroke-[2.5] group-hover:scale-110 transition-transform" />
          </div>
        </SWTTooltip>
      </div>

      {/* Main Content */}
      <div className="p-6 bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl shadow-sm dark:shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-slate-200 dark:border-amber-500/20 transition-colors">
        <Suspense>
          <POFilters startTransition={startTransition} />
          <POTable isPending={isPending} />
        </Suspense>
      </div>
    </div>
  );
}
