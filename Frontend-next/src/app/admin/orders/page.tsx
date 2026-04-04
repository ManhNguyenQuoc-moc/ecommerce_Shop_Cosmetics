"use client";

import React from 'react';
import OrderFilters from "./components/OrderFilters";
import OrderTable from "./components/OrderTable";
import { ClipboardList, Info } from "lucide-react";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import SWTBreadcrumb from "@/src/@core/component/AntD/SWTBreadcrumb";
import useSWTTitle from "@/src/@core/hooks/useSWTTitle";

export default function OrdersPage() {
  useSWTTitle("Quản Lý Đơn Hàng | Admin");
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <SWTBreadcrumb items={[
            { title: "Trang chủ", href: "/admin" },
            { title: "Orders" }
          ]} />
          <div className="flex items-center gap-3.5 mt-4 mb-2">
            <ClipboardList size={32} className="text-brand-500 shrink-0" />
            <h2 className="!mb-0 text-3xl font-black tracking-tight text-brand-600 dark:text-admin-accent whitespace-nowrap">
              Quản lý Đơn hàng
            </h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-widest">
            Theo dõi, xử lý và cập nhật trạng thái các đơn hàng của hệ thống.
          </p>
        </div>
        <SWTTooltip
          title={<span className="text-sm">Theo dõi đơn hàng, trạng thái thanh toán và vận chuyển từ khách hàng.</span>}
          placement="left"
          color="pink"
        >
          <div className="!h-11 !w-11 flex items-center justify-center bg-brand-50 hover:bg-brand-500/10 dark:bg-slate-800 dark:hover:bg-slate-700 text-brand-600 dark:text-admin-accent rounded-xl cursor-help transition-all shadow-sm border border-brand-200 dark:border-slate-700 group">
            <Info size={22} className="stroke-[2.5] group-hover:scale-110 transition-transform" />
          </div>
        </SWTTooltip>
      </div>

      {/* Main Content */}
      <div className="p-6 bg-white/80 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200 dark:border-admin-sidebar-border transition-colors">
        <OrderFilters />
        <OrderTable />
      </div>
    </div>
  );
}
