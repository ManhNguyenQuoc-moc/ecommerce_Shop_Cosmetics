"use client";

import { useState } from "react";
import SWTTabs from "@/src/@core/component/AntD/SWTTabs";
import { ProfileListSkeleton } from "../components/ProfileSkeleton";
import SWTEmpty from "@/src/@core/component/AntD/SWTEmpty";
import SWTCard from "@/src/@core/component/AntD/SWTCard";
import { getVouchers } from "@/src/services/customer/voucher.service";
import VoucherCard from "./components/VoucherCard";
import { TicketPercent } from "lucide-react";
import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";

export default function VouchersPage() {
  const [activeTab, setActiveTab] = useState("VALID");

  const { data: vouchers, isLoading } = useFetchSWR(
    "vouchers",
    () => getVouchers()
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

  return (
    <div className="space-y-6">
      <SWTCard className="!mb-6 !rounded-2xl !border-none !shadow-sm overflow-hidden" bodyClassName="!p-4">
         <div>
        <h1 className="text-2xl font-bold text-gray-900">Mã giảm giá</h1>
        <p className="text-sm text-gray-500 mt-1">Sử dụng mã để tiết kiệm tối đa cho đơn hàng của bạn</p>
      </div>
        <SWTTabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className="px-4"
          items={tabItems}
        />
        <div className="min-h-[400px]">
        {isLoading && filteredVouchers.length === 0 ? (
          <ProfileListSkeleton />
        ) : filteredVouchers.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredVouchers.map((voucher) => (
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
      </SWTCard>
    </div>
  );
}