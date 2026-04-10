"use client";

import React, { useState } from "react";
import { OrderDTO } from "@/src/services/models/customer/order.dto";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import SWTCard from "@/src/@core/component/AntD/SWTCard";
import SWTConfirmModal from "@/src/@core/component/AntD/SWTConfirmModal";
import SWTDivider from "@/src/@core/component/AntD/SWTDivider";
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

  const formatVND = (v: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v || 0);

  return (
    <>
      <SWTCard className="!mb-4 !rounded-2xl !border-none !shadow-sm overflow-hidden hover:shadow-md transition-shadow" bodyClassName="p-0">
        {/* Order Header */}
        <div className="px-6 py-4 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
            <span className="text-sm font-black text-gray-900">#{order.code}</span>
            <SWTDivider type="vertical" />
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
              {new Date(order.createdAt).toLocaleDateString("vi-VN")}
            </span>
          </div>
          <OrderStatusTag status={order.current_status} />
        </div>

        {/* Order Items Preview */}
        <div className="px-6 py-5 cursor-pointer hover:bg-gray-50/30 transition-colors" onClick={() => setIsDetailOpen(true)}>
          <div className="flex gap-4">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-100 shrink-0 shadow-sm">
              <Image 
                src={firstItem?.product_image || "/images/placeholder.png"} 
                alt={firstItem?.product_name} 
                fill 
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-gray-900 truncate">{firstItem?.product_name}</h4>
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center gap-2">
                  {firstItem?.variant_name && <span className="text-[10px] font-bold text-gray-400 uppercase">{firstItem.variant_name}</span>}
                  <span className="text-[10px] text-gray-400 font-bold uppercase">x{firstItem?.quantity}</span>
                </div>
                <span className="text-sm font-black text-brand-500">
                  {formatVND(firstItem?.price)}
                </span>
              </div>
              {otherItemsCount > 0 && (
                <p className="text-[10px] text-gray-400 mt-2 font-black uppercase tracking-tighter opacity-70">
                  và {otherItemsCount} sản phẩm khác...
                </p>
              )}
            </div>
          </div>
        </div>

        <SWTDivider className="!my-0 !border-gray-50" />

        {/* Order Footer */}
        <div className="px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Tổng thanh toán:</p>
            <p className="text-xl font-black text-brand-600">
              {formatVND(order.final_amount || order.total_amount)}
            </p>
          </div>
          <div className="flex gap-3">
             {order.current_status === "PENDING" && (
              <SWTButton 
                variant="outlined"
                onClick={() => setShowCancelConfirm(true)}
                className="!text-[11px] !font-black !rounded-full !px-5 !border-rose-200 !text-rose-500 hover:!bg-rose-50"
              >
                Hủy đơn
              </SWTButton>
            )}
            <SWTButton 
              variant="outlined" 
              onClick={() => setIsDetailOpen(true)}
              className="!text-[11px] !font-black !rounded-full !px-5 !border-gray-200 !text-gray-600"
            >
              Chi tiết
            </SWTButton>
            {(order.current_status === "DELIVERED" || order.current_status === "CANCELLED") && (
              <SWTButton 
                className="!text-[11px] !font-black !bg-brand-500 !text-white !rounded-full !px-6 hover:shadow-lg hover:shadow-brand-500/30 transition-shadow"
              >
                Mua lại
              </SWTButton>
            )}
          </div>
        </div>
      </SWTCard>

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
        title="Hủy đơn hàng?"
        description="Bạn chắc chắn muốn hủy đơn hàng này? Thao tác không thể hoàn tác."
        confirmText="Xác nhận hủy"
      />
    </>
  );
}
