"use client";

import React from "react";
import SWTEmpty from "@/src/@core/component/AntD/SWTEmpty";
import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import { getVouchers } from "@/src/services/customer/voucher/voucher.service";
import SWTCard from "@/src/@core/component/AntD/SWTCard";
import { TicketPercent, Copy, Calendar, Info, Gem, Gift } from "lucide-react";
import { showNotificationSuccess } from "@/src/@core/utils/message";
import { Tooltip, Tag } from "antd";
import { ProfileListSkeleton } from "../../components/ProfileSkeleton";
import { VoucherResponseDto as VoucherDTO } from "@/src/services/models/voucher/output.dto";

export default function RedeemVoucherCatalog() {
  const { data: vouchers, isLoading } = useFetchSWR(
    "vouchers",
    () => getVouchers(),
    { revalidateOnFocus: false }
  );

  const allVoucher = vouchers || [];
  // Only show active vouchers that require points
  const redeemableVouchers = allVoucher.filter(v => 
    !v.is_used && !v.is_expired && v.point_cost && v.point_cost > 0
  );

  return (
    <div className="min-h-[400px]">
      <div className="bg-gradient-to-r from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-orange-900/10 p-5 rounded-2xl border border-amber-200 dark:border-amber-800/50 flex flex-col md:flex-row items-start md:items-center justify-between mb-8 shadow-sm">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-white shadow-md">
                <Gift size={24} />
            </div>
            <div>
                <h3 className="text-xl font-black text-amber-600 dark:text-amber-500 m-0 leading-tight">Danh sách Ưu đãi Điểm</h3>
                <p className="text-sm font-medium text-amber-700/70 dark:text-amber-500/70 m-0 mt-1">Sử dụng điểm tích lũy của bạn để đổi các Voucher giá trị. Điểm sẽ được trừ khi áp dụng tại màn thanh toán!</p>
            </div>
        </div>
      </div>

      {isLoading && redeemableVouchers.length === 0 ? (
        <ProfileListSkeleton />
      ) : redeemableVouchers.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {redeemableVouchers.map((voucher: VoucherDTO) => (
             <RedeemCard key={voucher.id} voucher={voucher} />
          ))}
        </div>
      ) : (
        <SWTEmpty 
          description="Hiện tại không có ưu đãi nào có thể đổi bằng điểm."
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
    <SWTCard className="relative !mb-4 !rounded-2xl !border-none !shadow-sm overflow-hidden hover:shadow-lg hover:border-amber-200 transition-all" bodyClassName="flex p-0">
      {/* Left side - Icon/Type */}
      <div className="w-28 sm:w-32 flex flex-col items-center justify-center border-r border-dashed border-amber-200/50 px-4 py-6 relative bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/10">
        <div className="absolute -top-3 -right-3 w-6 h-6 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-full" />
        <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-full" />

        <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2 bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md">
          <TicketPercent size={22} className="drop-shadow-sm" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-center text-amber-600 dark:text-amber-500">
          {voucher.type === "PERCENTAGE" ? "Giảm giá %" : voucher.type === "FREE_SHIPPING" ? "Free Ship" : "Giảm tiền mặt"}
        </span>
      </div>

      {/* Right side - Content */}
      <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between min-w-0 bg-white dark:bg-slate-800/50">
        <div>
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-bold text-gray-900 dark:text-white text-base truncate pr-2">
              {voucher.name}
            </h3>
            <Tag color="gold" className="!rounded-full !m-0 font-bold flex items-center gap-1 border-amber-200 text-amber-600 bg-amber-50 dark:bg-amber-900/30 dark:border-amber-500/30 dark:text-amber-400">
                <Gem size={12} className="fill-amber-500 text-amber-500" />
                {voucher.point_cost?.toLocaleString("vi-VN")} điểm
            </Tag>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-xs line-clamp-2 leading-relaxed mb-3">
            {voucher.description}
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
            <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 text-[11px]">
              <Calendar size={13} />
              <span>HSD: {new Date(voucher.end_date).toLocaleDateString("vi-VN")}</span>
            </div>
            {voucher.min_order_value && (
              <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 text-[11px]">
                <Info size={13} />
                <span>Đơn từ {voucher.min_order_value.toLocaleString("vi-VN")}₫</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-brand-500 font-bold text-[11px] bg-brand-50 dark:bg-brand-900/30 px-2 py-0.5 rounded-full border border-brand-100 dark:border-brand-500/30">
               <span>Đã dùng: {voucher.used_count || 0}/{voucher.usage_limit || 100}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="px-3 py-1.5 rounded-lg border border-dashed font-mono font-bold text-sm tracking-widest bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/50">
            {voucher.code}
          </div>
          <Tooltip title="Tiết kiệm điểm và sao chép">
            <button
              onClick={handleCopy}
              className="px-4 py-2 flex items-center gap-2 justify-center rounded-xl bg-amber-500 text-white font-bold hover:bg-amber-600 transition-all shadow-md shadow-amber-500/25 active:scale-95"
            >
              <Copy size={16} /> Nhận Mã
            </button>
          </Tooltip>
        </div>
      </div>
    </SWTCard>
  );
}
