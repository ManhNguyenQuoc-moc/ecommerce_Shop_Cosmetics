import React from 'react';
import { Ticket, Info } from "lucide-react";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";
import SWTBreadcrumb from "@/src/@core/component/AntD/SWTBreadcrumb";
import DiscountsClient from "./DiscountsClient";

export default function DiscountsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <SWTBreadcrumb items={[
            { title: "Trang chủ", href: "/admin" },
            { title: "Vouchers" }
          ]} />
          <div className="flex items-center gap-3.5 mt-4 mb-2">
            <Ticket size={32} className="text-brand-500 shrink-0" />
            <h2 className="!mb-0 text-3xl font-black tracking-tight text-brand-600 dark:text-admin-accent whitespace-nowrap">
              Quản lý Voucher
            </h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-widest">
             Quản lý các mã giảm giá, voucher và ưu đãi khách hàng.
          </p>
        </div>
        <SWTTooltip
          title={<span className="text-sm">Quản lý các chương trình khuyến mãi, mã giảm giá và voucher.</span>}
          placement="left"
          color="pink"
        >
          <div className="!h-11 !w-11 flex items-center justify-center bg-rose-50 hover:bg-rose-500/10 dark:bg-slate-800 dark:hover:bg-slate-700 text-rose-600 dark:text-admin-accent rounded-xl cursor-help transition-all shadow-sm border border-rose-200 dark:border-slate-700 group">
            <Info size={22} className="stroke-[2.5] group-hover:scale-110 transition-transform" />
          </div>
        </SWTTooltip>
      </div>

      <DiscountsClient />
    </div>
  );
}
