"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SWTTabs from "@/src/@core/component/AntD/SWTTabs";
import SWTEmpty from "@/src/@core/component/AntD/SWTEmpty";
import SWTPagination from "@/src/@core/component/AntD/SWTPagination";
import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import { getOrders } from "@/src/services/customer/order.service";
import OrderCard from "./components/OrderCard";
import { OrderStatus } from "@/src/services/models/customer/order.dto";
import { ProfileListSkeleton } from "../components/ProfileSkeleton";

interface OrdersClientProps {
  initialData?: any;
  initialTab: string;
  initialPage: number;
}

export default function OrdersClient({ initialData, initialTab, initialPage }: OrdersClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const activeTab = searchParams.get("status") || "ALL";
  const page = Number(searchParams.get("page") || 1);
  const pageSize = 5;

  const { data: response, isLoading, mutate, isValidating } = useFetchSWR(
    ["orders", activeTab, page],
    () => getOrders(activeTab === "ALL" ? undefined : (activeTab as OrderStatus), page, pageSize),
    {
      fallbackData: (activeTab === initialTab && page === initialPage) ? initialData : undefined,
      revalidateOnFocus: false,
    }
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

  const handleTabChange = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("status", key);
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handlePageChange = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", p.toString());
    router.push(`?${params.toString()}`);
  };

  const showLoading = isLoading && !response;

  return (
    <>
      <SWTTabs
        activeKey={activeTab}
        onChange={handleTabChange}
        className="px-4 mb-6"
        items={tabItems}
      />

      <div className={`space-y-4 min-h-[400px] transition-opacity duration-200 ${isValidating ? "opacity-70" : "opacity-100"}`}>
        {showLoading ? (
          <ProfileListSkeleton />
        ) : orders.length > 0 ? (
          <>
            {orders.map((order: any) => (
              <OrderCard key={order.id} order={order} onUpdate={mutate} />
            ))}
            
            {total > pageSize && (
              <div className="flex justify-center pt-6 pb-4">
                <SWTPagination 
                  current={page}
                  total={total}
                  pageSize={pageSize}
                  onChange={handlePageChange}
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
    </>
  );
}
