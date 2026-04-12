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
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className="flex flex-row items-center gap-5 px-4 mb-2">
        <div className="flex flex-col">
            <h1 className="text-3xl font-black text-text-main uppercase tracking-tight m-0">Mã giảm giá</h1>
            <p className="text-[11px] text-text-muted font-black uppercase tracking-widest opacity-60 mt-1">Sử dụng mã để tiết kiệm tối đa cho đơn hàng của bạn</p>
        </div>
      </div>
      
      <SWTCard className="!rounded-[40px] !border-none !shadow-2xl !bg-bg-card/50 backdrop-blur-xl" bodyClassName="!p-6">
        <VouchersClient initialData={undefined} initialTab={activeTab} />
      </SWTCard>
    </div>
  );
}