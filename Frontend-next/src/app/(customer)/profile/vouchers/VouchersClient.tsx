"use client";

import React, { useMemo } from "react";
import useSWTTitle from "@/src/@core/hooks/useSWTTitle";
import { useSearchParams, useRouter } from "next/navigation";
import SWTTabs from "@/src/@core/component/AntD/SWTTabs";
import SWTEmpty from "@/src/@core/component/AntD/SWTEmpty";
import SWTLoading from "@/src/@core/component/AntD/SWTLoading";
import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import { getVouchers } from "@/src/services/customer/voucher/voucher.service";
import { authStorage } from "@/src/@core/utils/authStorage";
import VoucherCard from "./components/VoucherCard";

interface VouchersClientProps {
  initialData?: any[];
  initialTab: string;
}

export default function VouchersClient({ initialData, initialTab }: VouchersClientProps) {
  useSWTTitle("Mã Giảm Giá");
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const activeTab = searchParams.get("status") || "VALID";
  const user = authStorage.getUser();
  
  // Cache key should include userId to differentiate between users
  const cacheKey = useMemo(() => {
    const userId = user?.id || "guest";
    return `vouchers_${userId}_includeExpired=true`;
  }, [user?.id]);

  const { data: vouchers, isLoading } = useFetchSWR(
    cacheKey,
    () => getVouchers(true),
    {
      fallbackData: initialData,
      revalidateOnFocus: true,  // Refetch when tab regains focus
      revalidateOnMount: true,
    }
  );

  const allVoucher = vouchers || [];
  
  console.log("VouchersClient - Data received:", { vouchers, isLoading, allVoucher });
  
  const now = new Date();
  
  // VALID: Not expired, is active, not exhausted (usage_limit), and NOT used by current user
  const validVouchers = allVoucher.filter(v => {
    const endDate = new Date(v.valid_until);
    const isNotExpired = now <= endDate && v.isActive;
    const isNotOuted = v.used_count < v.usage_limit;
    const notUsedByUser = !v.is_used_by_user;  // ← Check if user hasn't used it
    const isValid = isNotExpired && isNotOuted && notUsedByUser;
    
    console.log(`[VALID] ${v.code}: expired=${!isNotExpired}, outed=${!isNotOuted}, usedByUser=${v.is_used_by_user}, result=${isValid}`);
    return isValid;
  });
  
  // USED: Only vouchers that CURRENT USER has already used
  const usedVouchers = allVoucher.filter(v => v.is_used_by_user);
  
  // EXPIRED/UNAVAILABLE: Hết hạn, hết lượt, hoặc inactive - nhưng chỉ show nếu user chưa dùng
  const expiredVouchers = allVoucher.filter(v => {
    const endDate = new Date(v.valid_until);
    const isExpired = now > endDate || !v.isActive;
    const isOutedStock = v.used_count >= v.usage_limit;
    const notUsedByUser = !v.is_used_by_user;  // Don't show in expired if user already used it
    const shouldShow = (isExpired || isOutedStock) && notUsedByUser;
    
    console.log(`[EXPIRED] ${v.code}: expired=${isExpired}, outOfStock=${isOutedStock}, usedByUser=${v.is_used_by_user}, result=${shouldShow}`);
    return shouldShow;
  });

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
          <SWTLoading tip="Đang tải danh sách mã giảm giá..." />
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
