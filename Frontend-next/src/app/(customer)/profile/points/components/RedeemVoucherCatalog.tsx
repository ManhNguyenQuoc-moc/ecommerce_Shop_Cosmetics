"use client";

import React, { useMemo } from "react";
import SWTEmpty from "@/src/@core/component/AntD/SWTEmpty";
import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import { getVouchers } from "@/src/services/customer/voucher/voucher.service";
import { authStorage } from "@/src/@core/utils/authStorage";
import SWTCard from "@/src/@core/component/AntD/SWTCard";
import { TicketPercent, Copy, Calendar, Info, Gem, Gift } from "lucide-react";
import { showNotificationSuccess } from "@/src/@core/utils/message";
import { Tooltip, Tag } from "antd";
import SWTLoading from "@/src/@core/component/AntD/SWTLoading";
import { VoucherResponseDto as VoucherDTO } from "@/src/services/models/voucher/output.dto";

export default function RedeemVoucherCatalog() {
  const user = authStorage.getUser();
  
  // Cache key should include userId to differentiate between users
  const cacheKey = useMemo(() => {
    const userId = user?.id || "guest";
    return `redeem_vouchers_${userId}`;
  }, [user?.id]);
  
  const { data: vouchers, isLoading } = useFetchSWR(
    cacheKey,
    () => getVouchers(),
    { revalidateOnFocus: false, revalidateOnMount: true }
  );

  const allVoucher = vouchers || [];
  // Only show active vouchers that require points AND haven't been used by current user
  const now = new Date();
  const redeemableVouchers = allVoucher.filter(v => {
    const endDate = new Date(v.valid_until);
    const isNotExpired = now <= endDate && v.isActive;
    const isNotOuted = v.used_count < v.usage_limit;
    const requiresPoints = v.point_cost && v.point_cost > 0;
    const notUsedByUser = !v.is_used_by_user;  // ← Only show if user hasn't redeemed it yet
    return isNotExpired && isNotOuted && requiresPoints && notUsedByUser;
  });

  return (
    <div className="min-h-100">
      <div className="bg-linear-to-r from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-orange-900/10 p-4 sm:p-5 rounded-2xl border border-amber-200 dark:border-amber-800/50 flex flex-col gap-3 mb-8 shadow-sm">
        <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-white shadow-md flex-shrink-0">
                <Gift size={24} />
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-black text-amber-600 dark:text-amber-500 m-0 leading-tight">Đổi Voucher Bằng Điểm</h3>
                <p className="text-xs sm:text-sm font-medium text-amber-700/70 dark:text-amber-500/70 m-0 mt-1">Chỉ hiển thị các ưu đãi bạn chưa đổi. Điểm sẽ được trừ khi áp dụng tại thanh toán!</p>
            </div>
        </div>
      </div>

      {isLoading && redeemableVouchers.length === 0 ? (
        <SWTLoading tip="Đang tải danh sách ưu đãi..." />
      ) : redeemableVouchers.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {redeemableVouchers.map((voucher: VoucherDTO) => (
             <RedeemCard key={voucher.id} voucher={voucher} />
          ))}
        </div>
      ) : (
        <SWTEmpty 
          description="Bạn đã đổi hết các ưu đãi hoặc không có ưu đãi nào để đổi."
          className="py-20"
        />
      )}
    </div>
  );
}

function RedeemCard({ voucher }: { voucher: VoucherDTO }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(voucher.code);
    showNotificationSuccess(`Đã sao chép mã: ${voucher.code}`);
  };

  return (
    <SWTCard className="relative rounded-2xl border-none shadow-sm overflow-hidden hover:shadow-md transition-all" bodyClassName="flex flex-col sm:flex-row p-0">
      {/* Left side - Icon/Type */}
      <div className="w-full sm:w-28 flex flex-row sm:flex-col items-center justify-start sm:justify-center gap-3 sm:gap-0 border-b sm:border-b-0 sm:border-r border-dashed border-amber-200/50 px-4 py-4 sm:py-6 relative bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/10">
        <div className="absolute -top-3 -right-3 w-6 h-6 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-full hidden sm:block" />
        <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-full hidden sm:block" />

        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md flex-shrink-0">
          <TicketPercent size={22} className="drop-shadow-sm" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-center text-amber-600 dark:text-amber-500 sm:mt-2">
          {voucher.type === "PERCENTAGE" ? "Giảm %" : voucher.type === "FREE_SHIPPING" ? "Free Ship" : "Giảm tiền"}
        </span>
      </div>

      {/* Right side - Content */}
      <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex justify-between items-start gap-2 mb-2">
            <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base line-clamp-2">
              {voucher.program_name}
            </h3>
            <Tag color="gold" className="rounded-full m-0 font-bold flex items-center gap-1 border-amber-200 text-amber-600 bg-amber-50 dark:bg-amber-900/30 dark:border-amber-500/30 dark:text-amber-400 whitespace-nowrap text-xs flex-shrink-0">
                <Gem size={11} className="fill-amber-500 text-amber-500" />
                {(voucher.point_cost || 0).toLocaleString("vi-VN")}đ
            </Tag>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-xs line-clamp-2 leading-relaxed mb-3">
            {voucher.description || "Không có mô tả"}
          </p>

          <div className="flex flex-wrap gap-2 mb-4 text-[11px]">
            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 whitespace-nowrap">
              <Calendar size={13} className="flex-shrink-0" />
              <span>HSD: {new Date(voucher.valid_until).toLocaleDateString("vi-VN")}</span>
            </div>
            {voucher.min_order_value && voucher.min_order_value > 0 && (
              <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                <Info size={13} className="flex-shrink-0" />
                <span>Từ {voucher.min_order_value.toLocaleString("vi-VN")}₫</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-brand-500 font-bold text-[11px] bg-brand-50 dark:bg-brand-900/30 px-2 py-1 rounded-full border border-brand-100 dark:border-brand-500/30 w-fit">
             <span>Dùng: {voucher.used_count || 0}/{voucher.usage_limit || 100}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 sm:border-t-0 sm:pt-0 sm:mt-0 sm:border-none">
          <div className="px-3 py-2 rounded-lg border border-dashed font-mono font-bold text-sm tracking-widest bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/50 truncate">
            {voucher.code}
          </div>
          <Tooltip title="Sao chép mã giảm giá">
            <button
              onClick={handleCopy}
              className="px-3 sm:px-4 py-2 flex items-center gap-1 sm:gap-2 justify-center rounded-lg bg-amber-500 text-white font-bold text-sm hover:bg-amber-600 transition-all shadow-md shadow-amber-500/25 active:scale-95 whitespace-nowrap flex-shrink-0"
            >
              <Copy size={16} /> 
              <span className="hidden sm:inline">Nhận Mã</span>
              <span className="sm:hidden">Sao chép</span>
            </button>
          </Tooltip>
        </div>
      </div>
    </SWTCard>
  );
}
