"use client";

import React, { use } from "react";
import SWTCard from "@/src/@core/component/AntD/SWTCard";
import VouchersClient from "./VouchersClient";

type Props = {
  searchParams: Promise<{
    status?: string;
  }>;
};

export default function VouchersPage({ searchParams }: Props) {
  const resolvedSearchParams = use(searchParams);
  const activeTab = resolvedSearchParams.status || "VALID";

  return (
    <div className="space-y-6 animate-fade-in">
      <SWTCard className="!mb-6 !rounded-2xl !border-none !shadow-sm overflow-hidden" bodyClassName="!p-4">
        <div className="px-4 mb-4 mt-4">
          <h1 className="text-2xl font-bold text-gray-900">Mã giảm giá</h1>
          <p className="text-sm text-gray-500 mt-1">Sử dụng mã để tiết kiệm tối đa cho đơn hàng của bạn</p>
        </div>
        
        <VouchersClient initialData={undefined} initialTab={activeTab} />
      </SWTCard>
    </div>
  );
}