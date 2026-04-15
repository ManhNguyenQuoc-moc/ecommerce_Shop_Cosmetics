"use client";

import React, { useState } from "react";
import { OrderDTO } from "@/src/services/models/customer/order.dto";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import SWTCard from "@/src/@core/component/AntD/SWTCard";
import SWTConfirmModal from "@/src/@core/component/AntD/SWTConfirmModal";
import OrderStatusTag from "./OrderStatusTag";
import OrderDetailModal from "./OrderDetailModal";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";
import Image from "next/image";
import { Eye, Trash2, RotateCcw, CreditCard, ShoppingBag, Clock, Ticket } from "lucide-react";
import { cancelOrder } from "@/src/services/customer/order/order.service";
import { showNotificationSuccess, showNotificationError } from "@/src/@core/utils/message";

interface Props {
  order: OrderDTO;
  onUpdate?: () => void;
}

export default function OrderCard({ order, onUpdate }: Props) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const firstItem = order.items[0];
  const otherItemsCount = order.items.length - 1;

  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      await cancelOrder(order.id);
      showNotificationSuccess("Đã hủy đơn hàng thành công");
      setShowCancelConfirm(false);
      onUpdate?.();
    } catch (err: any) {
      showNotificationError(err.message || "Không thể hủy đơn hàng");
    } finally {
      setIsCancelling(false);
    }
  };

  const formatVND = (v: number) =>
    new Intl.NumberFormat("vi-VN").format(v || 0) + " đ";

  return (
    <div className=" bg-brand-50  border border-brand-200 rounded-2xl rounded-2xl shadow-sm overflow-hidden mb-4 hover:shadow-md transition-all duration-300">
      {/* Header: Shop/Mall info and Status */}
      <div className="px-5 py-3 flex items-center justify-between border-b border-slate-50">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-brand-50 flex items-center justify-center">
            <ShoppingBag size={14} className="text-brand-500" />
            
          </div>
            <span className="text-sm font-black text-slate-800 tracking-tight">#{order.code}</span>
        </div>
        <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-400 font-medium"> 
                {new Date(order.createdAt).toLocaleDateString("vi-VN")}
            </span>
            <div className="w-[1px] h-3 bg-slate-200" />
           
            {order.voucher_code && (
              <span className="text-[10px] font-black text-brand-500 bg-brand-50 px-1.5 py-0.5 rounded-md w-fit flex items-center gap-1">
                <Ticket size={10} /> {order.voucher_code}
              </span>
            )}
            <OrderStatusTag status={order.current_status} className="!border-none !shadow-none !p-0 !bg-transparent !text-brand-500" />
        </div>
      </div>

      {/* Body: Product Info */}
      <div className="p-5 flex gap-4">
        <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-100 bg-slate-50 grow-0 shrink-0">
          <Image
            src={firstItem?.product_image || "/images/placeholder.png"}
            alt="product"
            fill
            className="object-cover"
            unoptimized
          />
          {otherItemsCount > 0 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1.5px]">
              <span className="text-white text-xs font-black">+{otherItemsCount}</span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div className="flex flex-col gap-1">
            <h4 className="text-[15px] font-bold text-slate-800 line-clamp-1">
              {firstItem?.product_name}
            </h4>
            <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Số lượng: {firstItem?.quantity}</span>
                <span className="text-xs text-slate-300">|</span>
                <div className="text-xs font-bold text-slate-400 flex items-center gap-1">
                    <CreditCard size={12} /> {order.payment_method}
                </div>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
              <span className="text-sm font-bold text-slate-800">
                  {formatVND(firstItem?.price)}
              </span>
          </div>
        </div>
      </div>

      {/* Summary Row */}
      <div className="px-5 py-4 border-t border-slate-50 bg-slate-50/30 flex items-center justify-between">
        <div className="text-[11px] text-slate-400 font-medium italic">
            {order.items.length} kiện hàng
        </div>
        <div className="flex items-center gap-4">
            {order.discount_amount && order.discount_amount > 0 && (
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-brand-500 bg-brand-50/50 px-2 py-1 rounded-lg">
                    <span>Giảm:</span>
                    <span>-{formatVND(order.discount_amount)}</span>
                </div>
            )}
            <div className="flex items-center gap-2">
                <span className="text-sm text-slate-800 font-medium">Thành tiền:</span>
                <span className="text-xl font-black text-brand-600">
                    {formatVND(order.final_amount || order.total_amount)}
                </span>
            </div>
        </div>
      </div>

      {/* Actions Row */}
    <div className="px-6 py-4 flex items-center justify-end gap-3 w-full border-t border-slate-50">
    {/* Nút Xem chi tiết */}
    <SWTButton
        onClick={() => setIsDetailOpen(true)}
        className="!w-fit !px-6 !h-9 !rounded-xl !bg-slate-100 !text-slate-600 !border-none !font-bold hover:!bg-slate-200 transition-all"
    >
        Xem chi tiết
    </SWTButton>

    {/* Nút Hủy đơn */}
    {order.current_status === "PENDING" && (
        <SWTButton
            onClick={() => setShowCancelConfirm(true)}
            className="!w-fit !px-6 !h-9 !rounded-xl !bg-rose-50 !text-rose-500 !border-none !font-bold hover:!bg-rose-100 transition-all"
        >
            Hủy đơn
        </SWTButton>
    )}

    {/* Nút Mua lại */}
    {(order.current_status === "DELIVERED" || order.current_status === "CANCELLED") && (
        <SWTButton
            className="!w-fit !px-8 !h-9 !rounded-xl !bg-[#FDE7F0] !text-[#D14D72] !border-none !font-black hover:!bg-[#fbcfe0] transition-all shadow-sm"
        >
            Mua lại
        </SWTButton>
    )}
</div>
      {/* Modals Logic */}
      <OrderDetailModal orderId={order.id} isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} />
      <SWTConfirmModal
        open={showCancelConfirm}
        variant="danger"
        loading={isCancelling}
        onConfirm={handleCancel}
        onCancel={() => setShowCancelConfirm(false)}
        title="Xác nhận hủy đơn?"
        description="Thao tác này sẽ hủy toàn bộ đơn hàng hiện tại. Bạn có chắc chắn không?"
        confirmText="Hủy ngay"
        cancelText="Đóng"
      />
    </div>
  );
}