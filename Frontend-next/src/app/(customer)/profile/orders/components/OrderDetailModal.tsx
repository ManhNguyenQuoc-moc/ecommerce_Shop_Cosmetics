"use client";

import React from 'react';
import Image from 'next/image';
import { Clock, CheckCircle2, Truck, XCircle, Undo2 } from 'lucide-react';
import SWTModal from '@/src/@core/component/AntD/SWTModal';
import SWTCard from '@/src/@core/component/AntD/SWTCard';
import SWTSteps from '@/src/@core/component/AntD/SWTSteps';
import SWTTimeline from '@/src/@core/component/AntD/SWTTimeline';
import SWTSpin from '@/src/@core/component/AntD/SWTSpin';
import { OrderDTO, OrderStatus } from '@/src/services/models/customer/order.dto';
import { useFetchSWR } from '@/src/@core/hooks/useFetchSWR';
import { getOrderDetails } from '@/src/services/customer/order.service';

export type Props = {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderDetailModal({ orderId, isOpen, onClose }: Props) {
  const { data: order, isLoading } = useFetchSWR(
    orderId ? ["order-detail", orderId] : null,
    () => getOrderDetails(orderId!)
  );

  const formatVND = (v: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v || 0);

  return (
    <SWTModal
      title={
        <div className="flex flex-row items-center justify-between w-full pl-6 pt-5 pb-3 pr-12">
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-text-muted font-medium">Chi tiết đơn hàng</span>
              <span className="text-base font-bold text-text-main leading-none">
                #{order?.code || "..."}
              </span>
            </div>
          </div>
          {order && (
            <div className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm border ${getStatusClasses(order.current_status as any)}`}>
              {statusLabels[order.current_status]}
            </div>
          )}
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={1000}
      centered
      bodyClassName="!p-0 !bg-bg-muted/5"
    >
      <div className="max-h-[80vh] overflow-y-auto custom-scrollbar p-6 sm:p-8 flex flex-col gap-6">
        {isLoading ? (
          <div className="py-32 flex flex-col items-center justify-center gap-4">
            <SWTSpin size="large" />
            <p className="text-sm text-text-muted font-medium animate-pulse">Đang tải dữ liệu...</p>
          </div>
        ) : order ? (
          <>
            {/* 1. Progress Bar */}
            <SWTCard bodyClassName="!p-6 sm:!p-8">
              <SWTSteps
                current={order.current_status === "DELIVERED" ? 4 : ["PENDING", "CONFIRMED", "SHIPPING", "DELIVERED"].indexOf(order.current_status)}
                status={(order.current_status === "CANCELLED" || order.current_status === "RETURNED") ? "error" : "process"}
                items={[
                  { title: "Chờ xác nhận" },
                  { title: "Đã xác nhận" },
                  { title: "Đang giao" },
                  { title: "Hoàn tất" },
                ]}
              />
            </SWTCard>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              
              {/* LEFT: Info Panels (Address & Payment) */}
              <div className="md:col-span-5 flex flex-col gap-6">
                <SWTCard className="!rounded-2xl !border-border-default/40 shadow-sm" bodyClassName="!p-6">
                <h4 className="text-xl font-bold text-text-main mb-4">
                    Thông tin nhận hàng
                  </h4>
                 <div className="flex flex-col gap-4 mb-4 pb-4 border-b border-border-default/20">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-text-muted font-medium">Người nhận</span>
                      <span className="text-sm font-bold text-text-main">
                        {order.customer_name || "Khách hàng"}
                      </span>
                    </div>
                    
                    <div className="flex flex-row justify-between gap-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm text-text-muted font-medium">Điện thoại</span>
                        <span className="text-sm font-bold text-text-main">
                          {order.customer_phone || "Đang cập nhật"}
                        </span>
                         <span className="text-sm text-text-muted font-medium">Email</span>
                        <span className="text-sm font-bold text-text-main" title={order.customer_email}>
                          {order.customer_email || "Đang cập nhật"}
                        </span>
                      </div>
                    </div>
                  </div>
                </SWTCard>
                
                {/* Payment Method */}
                <SWTCard className="!rounded-2xl !border-border-default/40 shadow-sm" bodyClassName="!p-6">
                <h4 className="text-xl font-bold text-text-main mb-4">
                    Thanh toán và giao hàng
                  </h4>
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-text-muted font-medium">Phương thức</span>
                      <span className="text-sm font-bold text-text-main uppercase">{order.payment_method}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-text-muted font-medium">Trạng thái</span>
                      <span className={`px-3 py-1 rounded-md text-xs font-bold ${order.payment_status === 'PAID' ? 'bg-[#e6f4ea] text-[#137333]' : 'bg-status-warning-bg text-status-warning-text'}`}>
                        {order.payment_status === 'PAID' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                      </span>
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-text-main mt-6 mb-4">
                    Địa chỉ nhận hàng
                  </h4>
                   <div className="flex flex-col gap-1.5">
                    <p className="text-sm text-text-main leading-relaxed font-medium">
                      {order.shipping_address}
                    </p>
                  </div>
                </SWTCard>
              </div>

              {/* RIGHT: Line Items & Total */}
              <div className="md:col-span-7">
                <SWTCard className="!rounded-2xl !border-border-default/40 shadow-sm overflow-hidden" bodyClassName="!p-0 flex flex-col">
                  {/* Header */}
                  <div className="p-6 pb-2">
                    <h4 className="text-xl font-bold text-text-main">
                      Danh sách sản phẩm ({order.items.length})
                    </h4>
                  </div>
                  
                  {/* Items List */}
                  <div className="flex flex-col max-h-[320px] overflow-y-auto custom-scrollbar">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-start sm:items-center gap-4 px-6 py-4 hover:bg-bg-muted/5 transition-colors">
                        {/* Thumbnail */}
                        <div className="relative w-16 h-16 rounded-xl border border-border-default/30 overflow-hidden shrink-0 bg-white">
                          <Image src={item.product_image || "/images/placeholder.png"} alt={item.product_name} fill className="object-cover p-0.5" unoptimized />
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0 flex flex-col sm:flex-row justify-between gap-4">
                          <div className="flex flex-col gap-1.5 flex-1">
                            <p className="font-bold text-text-main text-sm line-clamp-2 leading-tight">{item.product_name}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-[13px] bg-bg-muted/30 text-text-muted px-2 py-0.5 rounded-md border border-border-default/30 font-medium">
                                {item.variant_name || "Mặc định"}
                              </span>
                              <span className="text-[13px] text-text-muted font-medium">x{item.quantity}</span>
                            </div>
                          </div>
                          {/* Price */}
                          <div className="text-left sm:text-right shrink-0">
                            <p className="font-bold text-text-main text-[15px] tabular-nums">{formatVND(item.price)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-6 py-5 border-t border-border-default/30 flex justify-between items-end gap-4 mt-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-[15px] text-text-muted font-bold">Tổng thanh toán</span>
                      <span className="text-[11px] text-text-muted italic">* Đã bao gồm thuế phí</span>
                    </div>
                    {/* Bôi màu hồng đậm (hoặc lấy màu thương hiệu) cho giá tiền */}
                    <p className="text-[26px] font-bold text-[#F83A7E] tracking-tight tabular-nums leading-none">
                      {formatVND(order.final_amount)}
                    </p>
                  </div>
                </SWTCard>
              </div>
            </div>

            {/* 3. Status Timeline */}
            <SWTCard className="!rounded-2xl !border-border-default/40 shadow-sm" bodyClassName="!p-6 !sm:p-8 !flex flex-col gap-6">
              <h4 className="flex items-center gap-2 text-[15px] font-bold text-text-main pb-2">
                <Clock size={18} className="text-text-muted" />
                Lịch sử hành trình
              </h4>
              <div className="pt-2 pl-2">
                <SWTTimeline
                  items={(order as any).status_history?.map((h: any) => ({
                    dot: (
                      <div className={`p-1.5 rounded-full border shadow-sm bg-white ${getStatusClasses(h.status)}`}>
                        {statusIcons[h.status as OrderStatus]}
                      </div>
                    ),
                    children: (
                      <div className="ml-4 pb-6 flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-6">
                        <div className="flex flex-col gap-1.5 flex-1">
                          <span className="text-sm font-bold text-text-main">{statusLabels[h.status as OrderStatus]}</span>
                          {h.note && (
                            <p className="text-xs text-text-muted bg-bg-muted/30 p-2.5 rounded-lg border border-border-default/40">
                              {h.note}
                            </p>
                          )}
                        </div>
                        <div className="shrink-0 text-left sm:text-right text-xs text-text-muted">
                          <span className="font-medium">{new Date(h.createdAt || h.timestamp).toLocaleTimeString("vi-VN", { timeStyle: 'short' })}</span>
                          <span className="mx-1.5">-</span>
                          <span>{new Date(h.createdAt || h.timestamp).toLocaleDateString("vi-VN", { dateStyle: 'medium' })}</span>
                        </div>
                      </div>
                    )
                  }))}
                />
              </div>
            </SWTCard>
          </>
        ) : null}
      </div>
    </SWTModal>
  );
}

const statusLabels: Record<OrderStatus, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  SHIPPING: "Đang giao hàng",
  DELIVERED: "Đã giao hàng",
  CANCELLED: "Đã hủy",
  RETURNED: "Trả hàng",
};

const statusIcons: Record<OrderStatus, React.ReactNode> = {
  PENDING: <Clock size={14} />,
  CONFIRMED: <CheckCircle2 size={14} />,
  SHIPPING: <Truck size={14} />,
  DELIVERED: <CheckCircle2 size={14} />,
  CANCELLED: <XCircle size={14} />,
  RETURNED: <Undo2 size={14} />,
};

const getStatusClasses = (status: OrderStatus) => {
  const mapping: Record<string, string> = {
    PENDING: "bg-status-info-bg text-status-info-text border-status-info-border",
    CONFIRMED: "bg-status-warning-bg text-status-warning-text border-status-warning-border",
    SHIPPING: "bg-status-info-bg text-status-info-text border-status-info-border",
    DELIVERED: "bg-status-success-bg text-status-success-text border-status-success-border",
    CANCELLED: "bg-status-error-bg text-status-error-text border-status-error-border",
    RETURNED: "bg-status-neutral-bg text-status-neutral-text border-status-neutral-border",
  };
  return mapping[status] || "";
};