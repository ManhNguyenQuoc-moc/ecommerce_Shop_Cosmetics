"use client";

import React, { useState } from "react";
import { OrderDTO } from "@/src/services/models/customer/order.dto";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import SWTCard from "@/src/@core/component/AntD/SWTCard";
import SWTConfirmModal from "@/src/@core/component/AntD/SWTConfirmModal";
import OrderStatusTag from "./OrderStatusTag";
import OrderDetailModal from "./OrderDetailModal";
import Image from "next/image";
import { cancelOrder } from "@/src/services/customer/order.service";
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
  const totalQuantity = order.items.reduce((acc, item) => acc + item.quantity, 0);

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
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v || 0);

  return (
    <SWTCard className="!rounded-2xl !border !border-border-default/60 !shadow-sm overflow-hidden mb-4 hover:shadow-md transition-shadow">
      {/* 1. Header: Thông tin mã đơn và ngày đặt */}
      <div className="px-5 py-3.5 flex items-center justify-between border-b border-border-default/40 bg-bg-muted/5 gap-3">
        <div className="flex items-center gap-2 sm:gap-3 text-sm">
          <span className="font-bold text-text-main">#{order.code}</span>
          <span className="w-1 h-1 rounded-full bg-text-muted/40"></span>
          <span className="text-text-muted">
            {new Date(order.createdAt).toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </span>
        </div>
        <OrderStatusTag status={order.current_status} className="!text-xs !px-3 !py-1 !rounded-full !font-medium shadow-sm" />
      </div>

      {/* 2. Body: Sản phẩm (Clickable để mở Modal) */}
      <div 
        className="p-5 cursor-pointer group hover:bg-bg-muted/5 transition-colors"
        onClick={() => setIsDetailOpen(true)}
      >
        <div className="flex items-start gap-4 sm:gap-5">
          <div className="relative w-16 h-16 rounded-xl border border-border-default/50 overflow-hidden shrink-0 bg-white shadow-sm">
            <Image
              src={firstItem?.product_image || "/images/placeholder.png"}
              alt={firstItem?.product_name || "product"}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              unoptimized
            />
            {otherItemsCount > 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-xs font-semibold">+{otherItemsCount}</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <h4 className="text-base font-semibold text-text-main line-clamp-2 leading-snug group-hover:text-brand-500 transition-colors mb-1.5">
              {firstItem?.product_name} - {firstItem?.variant_name || "No variant"} 
            </h4>
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <span className="font-medium">x{firstItem?.quantity}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Footer: Thanh toán & Nút bấm */}
      <div className="px-5 py-4 border-t border-border-default/40 flex flex-col md:flex-row justify-between items-center gap-5">
        <div className="flex items-center justify-between md:justify-start gap-6 w-full md:w-auto">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-text-muted font-medium">Thanh toán</span>
            <span className="text-sm font-bold text-text-main uppercase">{order.payment_method}</span>
          </div>
          <div className="hidden sm:block w-px h-8 bg-border-default/50"></div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-text-muted font-medium">Tổng tiền ({totalQuantity} SP)</span>
            <div className="text-sm font-bold text-brand-500">
              {formatVND(order.final_amount || order.total_amount)}
            </div>
          </div>
        </div>

        {/* Nút thao tác (Chống móp méo, rớt dòng) */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end shrink-0">
          {order.current_status === "PENDING" && (
            <SWTButton
              variant="outlined"
              onClick={() => setShowCancelConfirm(true)}
              className="!bg-red-500/10 !border-red-500/20 !text-red-600 dark:!text-red-400 !rounded-xl font-bold !h-10 !px-6 hover:!bg-red-500/20 transition-all shadow-sm !min-w-max whitespace-nowrap"
            >
              Hủy
            </SWTButton>
          )}
          <SWTButton
            variant="text"
            onClick={() => setIsDetailOpen(true)}
            className="!bg-green-500/10 !text-green-600 !rounded-xl font-bold !h-10 !px-6 hover:!bg-green-500/20 transition-all shadow-sm !min-w-max whitespace-nowrap"
          >
            Chi tiết
          </SWTButton>
          {(order.current_status === "DELIVERED" || order.current_status === "CANCELLED") && (
            <SWTButton
              className="!bg-brand-500 !text-white !rounded-xl font-bold !h-10 !px-6 hover:!bg-brand-600 transition-all shadow-sm !min-w-max whitespace-nowrap"
            >
              Mua lại
            </SWTButton>
          )}
        </div>
      </div>

      {/* Modals */}
      <OrderDetailModal
        orderId={order.id}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />

      <SWTConfirmModal
        open={showCancelConfirm}
        variant="danger"
        loading={isCancelling}
        onConfirm={handleCancel}
        onCancel={() => setShowCancelConfirm(false)}
        title="Xác nhận hủy đơn?"
        description="Đơn hàng của bạn đang trong trạng thái chờ xử lý. Bạn có chắc muốn hủy không? Thao tác này không thể hoàn tác."
        confirmText="Hủy ngay"
        cancelText="Đóng"
      />
    </SWTCard>
  );
}