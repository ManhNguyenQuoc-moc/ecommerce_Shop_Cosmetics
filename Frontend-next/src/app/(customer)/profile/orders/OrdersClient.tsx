"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SWTCard from "@/src/@core/component/AntD/SWTCard";
import SWTTabs from "@/src/@core/component/AntD/SWTTabs";
import SWTEmpty from "@/src/@core/component/AntD/SWTEmpty";
import SWTPagination from "@/src/@core/component/AntD/SWTPagination";
import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import { getOrders } from "@/src/services/customer/order.service";
import OrderCard from "./components/OrderCard";
import { OrderStatus, OrderListResponseDTO, OrderDTO } from "@/src/services/models/customer/order.dto";
import { ProfileListSkeleton } from "../components/ProfileSkeleton";

interface OrdersClientProps {
  initialData?: OrderListResponseDTO;
  initialTab: string;
  initialPage: number;
}

export default function OrdersClient({ initialData, initialTab, initialPage }: OrdersClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const activeTab = searchParams.get("status") || "ALL";
  const page = Number(searchParams.get("page") || 1);
  const pageSize = 6;

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
    { key: "ALL", label: "Tất cả" ,},
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
    <div className="flex flex-col gap-6 ">
      <SWTCard 
        className="!border-none !shadow-2xl !rounded-3xl overflow-hidden !bg-bg-card/80 backdrop-blur-xl transition-all duration-500"
        bodyClassName="!p-0"
      >
        <div className="px-6 py-5 border-b border-border-default/30 bg-bg-muted/10">
          <SWTTabs
            activeKey={activeTab}
            onChange={handleTabChange}
            items={tabItems}
            className="admin-tabs-compact"
          />
        </div>
        <div className={`min-h-[500px] p-4 transition-all duration-300 ${isValidating ? "opacity-60 grayscale-[0.2]" : "opacity-100"}`}>
          {showLoading ? (
            <div className="p-8">
              <ProfileListSkeleton/>
            </div>
          ) : orders.length > 0 ? (
            <div className="divide-y divide-border-default/20">
              {orders.map((order: OrderDTO) => (
                <OrderCard key={order.id} order={order} onUpdate={mutate} />
              ))}
            </div>
          ) : (
            <div className="py-32 flex flex-col items-center justify-center animate-fade-in text-center p-6">
              <SWTEmpty 
                description={
                  <div className="flex flex-col items-center gap-3">
                    <p className="text-xs font-black text-text-main uppercase tracking-widest opacity-80">
                      {activeTab === "ALL" 
                        ? "Hành trình mua sắm của bạn trống trải..." 
                        : `Không có đơn hàng nào đang ${tabItems.find(t => t.key === activeTab)?.label.toLowerCase()}`
                      }
                    </p>
                    <p className="text-xs text-gray-900 font-bold italic opacity-50 tracking-wide max-w-[250px]">
                      Hãy khám phá các sản phẩm tuyệt vời của chúng tôi để bắt đầu đơn hàng đầu tiên.
                    </p>
                  </div>
                }
                className="scale-110 opacity-70"
              />
            </div>
          )}
        </div>
        <div className="px-8 py-5 border-t border-border-default/20 bg-bg-muted/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          {total > pageSize && !showLoading && (
            <SWTPagination 
              current={page}
              total={total}
              pageSize={pageSize}
              onChange={handlePageChange}
              showSizeChanger={false}
              className="!m-0 scale-90 sm:scale-100 origin-right transition-transform px-2 py-1 rounded-xl bg-bg-card shadow-sm border border-border-default/50"
            />
          )}
        </div>
      </SWTCard>
    </div>
  );
}
