"use client";

import { useState } from "react";
import SWTTabs from "@/src/@core/component/AntD/SWTTabs";
import { ProfileListSkeleton } from "../components/ProfileSkeleton";
import SWTEmpty from "@/src/@core/component/AntD/SWTEmpty";
import SWTCard from "@/src/@core/component/AntD/SWTCard";
import SWTPagination from "@/src/@core/component/AntD/SWTPagination";
import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import { getOrders } from "@/src/services/customer/order.service";
import OrderCard from "./components/OrderCard";
import { OrderStatus } from "@/src/services/models/customer/order.dto";

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("ALL");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const { data: response, isLoading, mutate } = useFetchSWR(
    ["orders", activeTab, page],
    () => getOrders(activeTab === "ALL" ? undefined : (activeTab as OrderStatus), page, pageSize)
  );

  const orders = response?.data || [];
  const total = response?.total || 0;

  const tabItems = [
    { key: "ALL", label: "Tất cả" },
    { key: "PENDING", label: "Chờ xác nhận" },
    { key: "CONFIRMED", label: "Đã xác nhận" },
    { key: "SHIPPING", label: "Đang giao" },
    { key: "DELIVERED", label: "Hoàn thành" },
    { key: "CANCELLED", label: "Đã huỷ" },
  ];

  return (
    <div className="space-y-6">
      <SWTCard className="!mb-6 !rounded-2xl !border-none !shadow-sm overflow-hidden" bodyClassName="!p-4">
        <div className="px-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Lịch sử đơn hàng</h1>
          <p className="text-sm text-gray-500 mt-1">Theo dõi và quản lý các đơn hàng của bạn</p>
        </div>
        
        <SWTTabs
          activeKey={activeTab}
          onChange={(key) => {
            setActiveTab(key);
            setPage(1);
          }}
          className="px-4 mb-6"
          items={tabItems}
        />

        <div className="space-y-4 min-h-[400px]">
          {isLoading ? (
            <ProfileListSkeleton />
          ) : orders.length > 0 ? (
            <>
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} onUpdate={mutate} />
              ))}
              
              {total > pageSize && (
                <div className="flex justify-center pt-6 pb-4">
                  <SWTPagination 
                    current={page}
                    total={total}
                    pageSize={pageSize}
                    onChange={setPage}
                    showSizeChanger={false}
                  />
                </div>
              )}
            </>
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