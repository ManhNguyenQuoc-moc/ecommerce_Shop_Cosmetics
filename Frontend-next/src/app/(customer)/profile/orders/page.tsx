"use client";

import React, { use } from "react";
import SWTCard from "@/src/@core/component/AntD/SWTCard";
import OrdersClient from "./OrdersClient";

type Props = {
  searchParams: Promise<{
    status?: string;
    page?: string;
  }>;
};

export default function OrdersPage({ searchParams }: Props) {
  const resolvedSearchParams = use(searchParams);
  const activeTab = resolvedSearchParams.status || "ALL";
  const page = Number(resolvedSearchParams.page || 1);

  return (
    <div className="space-y-6 animate-fade-in">
      <SWTCard className="!mb-6 !rounded-2xl !border-none !shadow-sm overflow-hidden" bodyClassName="!p-4">
        <div className="px-4 mb-4 mt-4">
          <h1 className="text-2xl font-bold text-gray-900">Lịch sử đơn hàng</h1>
          <p className="text-sm text-gray-500 mt-1">Theo dõi và quản lý các đơn hàng của bạn</p>
        </div>
        
        <OrdersClient 
          initialData={undefined} 
          initialTab={activeTab}
          initialPage={page}
        />
      </SWTCard>
    </div>
  );
}