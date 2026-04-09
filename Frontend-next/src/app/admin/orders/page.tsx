"use client";

import React, { useState } from 'react';
import OrderFilters from "./components/OrderFilters";
import OrderTable from "./components/OrderTable";
import { ClipboardList, Info } from "lucide-react";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";
import SWTBreadcrumb from "@/src/@core/component/AntD/SWTBreadcrumb";
import useSWTTitle from "@/src/@core/hooks/useSWTTitle";
import { useOrders, OrderQueryParams } from "@/src/services/admin/order.service";
import OrderDetailDrawer from "./components/OrderDetailDrawer";
import { OrderDto } from "@/src/services/models/order/output.dto";

export default function OrdersPage() {
  useSWTTitle("Quản Lý Đơn Hàng | Admin");

  const [params, setParams] = useState<OrderQueryParams>({
    page: 1,
    pageSize: 10,
  });

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { orders, total, isLoading, mutate } = useOrders(params);

  const handleParamChange = (newParams: Partial<OrderQueryParams>) => {
    setParams(prev => ({ ...prev, ...newParams, page: newParams.page || 1 }));
  };

  const handleClear = () => {
    setParams({ page: 1, pageSize: 10 });
  };

  const handleView = (order: OrderDto) => {
    setSelectedOrderId(order.id);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <SWTBreadcrumb items={[
            { title: "Trang chủ", href: "/admin" },
            { title: "Quản lý đơn hàng" }
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
        <OrderFilters 
            params={params} 
            onParamChange={handleParamChange} 
            onClear={handleClear} 
        />
        <OrderTable 
            orders={orders}
            total={total}
            isLoading={isLoading}
            page={params.page || 1}
            pageSize={params.pageSize || 6}
            onPaginationChange={(page, pageSize) => handleParamChange({ page, pageSize })}
            onView={handleView}
        />
      </div>

      <OrderDetailDrawer 
          orderId={selectedOrderId}
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onUpdate={mutate}
      />
    </div>
  );
}
