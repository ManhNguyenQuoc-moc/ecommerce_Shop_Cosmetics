"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SWTTabs from "@/src/@core/component/AntD/SWTTabs";
import SWTEmpty from "@/src/@core/component/AntD/SWTEmpty";
import { ProfileListSkeleton } from "../components/ProfileSkeleton";
import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import { getVouchers } from "@/src/services/customer/voucher/voucher.service";
import VoucherCard from "./components/VoucherCard";

interface VouchersClientProps {
  initialData?: any[];
  initialTab: string;
}

export default function VouchersClient({ initialData, initialTab }: VouchersClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const activeTab = searchParams.get("status") || "VALID";

  const { data: vouchers, isLoading } = useFetchSWR(
    "vouchers",
    () => getVouchers(),
    {
      fallbackData: initialData,
      revalidateOnFocus: false,
    }
  );

  const allVoucher = vouchers || [];
  const validVouchers = allVoucher.filter(v => !v.is_used && !v.is_expired);
  const usedVouchers = allVoucher.filter(v => v.is_used);
  const expiredVouchers = allVoucher.filter(v => v.is_expired);

  const tabItems = [
    { key: "VALID", label: "Mã có hiệu lực", prefix: { value: validVouchers.length } },
    { key: "USED", label: "Đã sử dụng", prefix: { value: usedVouchers.length } },
    { key: "EXPIRED", label: "Hết hạn", prefix: { value: expiredVouchers.length } },
  ];

  const filteredVouchers = activeTab === "VALID" ? validVouchers : activeTab === "USED" ? usedVouchers : expiredVouchers;

  const handleTabChange = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("status", key);
    router.push(`?${params.toString()}`);
  };

  return (
    <>
      <SWTTabs
        activeKey={activeTab}
        onChange={handleTabChange}
        className="px-4"
        items={tabItems}
      />
      <div className="min-h-[400px] mt-4">
        {isLoading && filteredVouchers.length === 0 ? (
          <ProfileListSkeleton />
        ) : filteredVouchers.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredVouchers.map((voucher: any) => (
              <VoucherCard key={voucher.id} voucher={voucher} />
            ))}
          </div>
        ) : (
          <SWTEmpty 
            description={
              activeTab === "VALID" 
                ? "Chưa có mã giảm giá nào có hiệu lực." 
                : "Không tìm thấy mã giảm giá nào."
            }
            className="py-20"
          />
        )}
      </div>
    </>
  );
}
