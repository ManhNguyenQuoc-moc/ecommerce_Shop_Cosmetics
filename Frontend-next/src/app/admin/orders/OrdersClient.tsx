"use client";

import React, { useState } from 'react';
import OrderFilters from "./components/OrderFilters";
import OrderTable from "./components/OrderTable";
import SWTTabs from "@/src/@core/component/AntD/SWTTabs";
import { useOrders, OrderQueryParams } from "@/src/services/admin/order.service";
import OrderDetailDrawer from "./components/OrderDetailDrawer";
import { OrderDto } from "@/src/services/models/order/output.dto";

export default function OrdersClient() {
  const [params, setParams] = useState<OrderQueryParams>({
    page: 1,
    pageSize: 6,
  });

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { orders, total, isLoading, mutate } = useOrders(params);

  const handleParamChange = (newParams: Partial<OrderQueryParams>) => {
    setParams(prev => ({ ...prev, ...newParams, page: newParams.page || 1 }));
  };

  const handleClear = () => {
    setParams({ page: 1, pageSize: 6 });
  };

  const handleView = (order: OrderDto) => {
    setSelectedOrderId(order.id);
    setIsDrawerOpen(true);
  };

  return (
    <div className="p-0 bg-white/80 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200 dark:border-admin-sidebar-border transition-colors overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
         <SWTTabs
          activeKey={params.status || "ALL"}
          onChange={(key) => handleParamChange({ status: key === "ALL" ? undefined : key as any })}
          items={[
            { key: "ALL", label: "Tất cả" },
            { key: "PENDING", label: "Chờ xác nhận" },
            { key: "CONFIRMED", label: "Đã xác nhận" },
            { key: "SHIPPING", label: "Đang giao" },
            { key: "DELIVERED", label: "Đã giao" },
            { key: "CANCELLED", label: "Đã hủy" },
            { key: "RETURNED", label: "Trả hàng" }
          ]}
        />
      </div>

      <div className="p-6">
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
