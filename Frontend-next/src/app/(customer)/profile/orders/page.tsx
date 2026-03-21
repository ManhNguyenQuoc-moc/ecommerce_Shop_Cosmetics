"use client";

import { useState } from "react";
import SWTTabs from "@/src/@core/component/AntD/SWTTabs";
import AntSpin from "@/src/@core/component/AntD/AntSpin";
import SWTEmpty from "@/src/@core/component/AntD/SWTEmpty";
import SWTCard from "@/src/@core/component/AntD/SWTCard";
import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import { getOrders } from "@/src/services/customer/order.service";
import OrderCard from "./components/OrderCard";
import { OrderStatus } from "@/src/services/models/customer/order.dto";

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("ALL");

  const { data: response, isLoading } = useFetchSWR(
    ["orders", activeTab],
    () => getOrders(activeTab === "ALL" ? undefined : (activeTab as OrderStatus))
  );

  const allOrders = response?.data || [];
  const pendingOrders = allOrders.filter(o => o.status === "PENDING");
  const processingOrders = allOrders.filter(o => o.status === "PROCESSING");
  const shippingOrders = allOrders.filter(o => o.status === "SHIPPING");
  const completedOrders = allOrders.filter(o => o.status === "COMPLETED");
  const cancelledOrders = allOrders.filter(o => o.status === "CANCELLED");

  const tabItems = [
    { key: "ALL", label: "Tất cả", prefix: { value: allOrders.length } },
    { key: "PENDING", label: "Chờ xác nhận", prefix: { value: pendingOrders.length } },
    { key: "PROCESSING", label: "Đang xử lý", prefix: { value: processingOrders.length } },
    { key: "SHIPPING", label: "Đang giao", prefix: { value: shippingOrders.length } },
    { key: "COMPLETED", label: "Hoàn thành", prefix: { value: completedOrders.length } },
    { key: "CANCELLED", label: "Đã huỷ", prefix: { value: cancelledOrders.length } },
  ];

  const orders = activeTab === "ALL" ? allOrders : allOrders.filter(o => o.status === activeTab);

  return (
    <div className="space-y-6">
      <SWTCard className="!mb-6 !rounded-2xl !border-none !shadow-sm overflow-hidden" bodyClassName="!p-4">
        <div>
        <h1 className="text-2xl font-bold text-gray-900">Lịch sử đơn hàng</h1>
        <p className="text-sm text-gray-500 mt-1">Theo dõi và quản lý các đơn hàng của bạn</p>
      </div>
        <SWTTabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className="px-4"
          items={tabItems}
        />
      <div className="space-y-4 min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <AntSpin size="large" />
            <p className="text-gray-400 text-sm animate-pulse">Đang tải danh sách đơn hàng...</p>
          </div>
        ) : orders.length > 0 ? (
          orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))
        ) : (
          <SWTEmpty 
            description={
              activeTab === "ALL" 
                ? "Chưa có đơn hàng nào." 
                : "Không tìm thấy đơn hàng nào ở trạng thái này."
            }
            className="py-20"
          />
        )}
      </div>
       </SWTCard>
    </div>
  );
}