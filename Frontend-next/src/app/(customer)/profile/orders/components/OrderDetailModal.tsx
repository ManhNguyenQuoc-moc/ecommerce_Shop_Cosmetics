"use client";

import React from 'react';
import Image from 'next/image';
import { Clock, CheckCircle2, Truck, XCircle, Undo2, MapPin, CreditCard, ShoppingBag, Mail, Phone, User } from 'lucide-react';
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
        <div className="flex flex-row items-center justify-between w-full px-6 py-4">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-text-muted font-bold uppercase tracking-wider">Chi tiết đơn hàng</span>
            <span className="text-lg font-black text-text-main leading-none">#{order?.code || "..."}</span>
          </div>
          {order && (
            <div className={`px-4 py-1.5 rounded-full text-[11px] font-black shadow-sm border ${getStatusClasses(order.current_status as any)}`}>
              {statusLabels[order.current_status].toUpperCase()}
            </div>
          )}
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={1000}
      centered
      bodyClassName="!p-0 !bg-[#f8f9fa]" // Màu nền nhẹ để nổi bật các Card trắng
    >
      <div className="max-h-[85vh] overflow-y-auto custom-scrollbar p-6 flex flex-col gap-6">
        {isLoading ? (
          <div className="py-32 flex flex-col items-center justify-center gap-4">
            <SWTSpin size="large" />
            <p className="text-sm text-text-muted font-medium animate-pulse">Đang tải dữ liệu...</p>
          </div>
        ) : order ? (
          <>
            {/* 1. Progress Bar - Giảm padding để tập trung vào nội dung */}
            <SWTCard bodyClassName="!p-8 sm:!px-12">
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
              
              {/* LEFT: Information Panel */}
              <div className="md:col-span-5 flex flex-col gap-6">
                <SWTCard className="!rounded-2xl !border-none shadow-sm" bodyClassName="!p-6">
                  <h4 className="flex items-center gap-2 text-base font-black text-text-main mb-5 border-b border-slate-50 pb-3">
                    <User size={18} className="text-blue-500" />
                    THÔNG TIN NHẬN HÀNG
                  </h4>
                  
                  <div className="space-y-5">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[11px] text-text-muted font-bold uppercase">Người nhận</span>
                      <span className="text-sm font-bold text-text-main">{order.customer_name || "N/A"}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[11px] text-text-muted font-bold uppercase">Điện thoại</span>
                        <div className="flex items-center gap-2 text-sm font-bold text-text-main">
                        {order.customer_phone}
                        </div>
                      </div>
                    </div>
                      <div className="flex flex-col gap-1.5">
                        <span className="text-[11px] text-text-muted font-bold uppercase">Email</span>
                        <div className="flex items-center gap-2 text-sm font-bold text-text-main">
                           {order.customer_email || "N/A"}
                        </div>
                      </div>
                    <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-50">
                      <span className="text-[11px] text-text-muted font-bold uppercase">Địa chỉ giao hàng</span>
                      <div className="flex gap-2">
                        <p className="text-sm text-text-main leading-relaxed font-medium">
                          {order.shipping_address}
                        </p>
                      </div>
                    </div>
                  </div>
                </SWTCard>
                
                <SWTCard className="!rounded-2xl !border-none shadow-sm" bodyClassName="!p-6">
                  <h4 className="flex items-center gap-2 text-base font-black text-text-main mb-5 border-b border-slate-50 pb-3">
                    <CreditCard size={18} className="text-emerald-500" />
                    THANH TOÁN
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-text-muted font-medium">Hình thức</span>
                      <span className="text-sm font-black text-text-main px-2 py-0.5 bg-slate-100 rounded uppercase">{order.payment_method}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-text-muted font-medium">Trạng thái</span>
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${order.payment_status === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                        {order.payment_status === 'PAID' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                      </span>
                    </div>
                  </div>
                </SWTCard>
              </div>

              {/* RIGHT: Products List */}
              <div className="md:col-span-7 h-full">
                <SWTCard className="!rounded-2xl !border-none shadow-sm h-full flex flex-col" bodyClassName="!p-0">
                  <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                    <h4 className="flex items-center gap-2 text-base font-black text-text-main">
                      <ShoppingBag size={18} className="text-indigo-500" />
                      DANH SÁCH SẢN PHẨM
                    </h4>
                    <span className="text-[11px] font-black px-2 py-1 bg-slate-100 text-slate-500 rounded-md">
                      {order.items.length} MẶT HÀNG
                    </span>
                  </div>
                  
                  <div className="flex flex-col max-h-[420px] overflow-y-auto custom-scrollbar">
                    {order.items.map((item, idx) => (
                      <div key={item.id} className={`flex items-center gap-4 px-6 py-5 ${idx !== order.items.length - 1 ? 'border-b border-slate-50' : ''} hover:bg-slate-50/50 transition-colors`}>
                        <div className="relative w-16 h-16 rounded-xl border border-slate-100 overflow-hidden shrink-0 bg-white shadow-sm">
                          <Image src={item.product_image || "/images/placeholder.png"} alt={item.product_name} fill className="object-cover p-1" unoptimized />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                          <p className="font-bold text-text-main text-[14px] line-clamp-1 leading-tight">{item.product_name}</p>
                          <div className="flex items-center gap-3">
                            <span className="text-[11px] font-black text-slate-400">SL: {item.quantity}</span>
                            <span className="text-[11px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded font-bold">
                              {item.variant_name || "Mặc định"}
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-black text-text-main text-[15px] tabular-nums">{formatVND(item.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto p-6 bg-white border-t border-slate-100 flex flex-col gap-4">
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500 font-medium">Tạm tính ({order.items.length} sản phẩm)</span>
                        <span className="text-slate-800 font-bold">{formatVND(order.total_amount)}</span>
                      </div>

                      {order.discount_amount && order.discount_amount > 0 && (
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2">
                             <span className="text-slate-500 font-medium">Mã giảm giá</span>
                             <span className="text-[10px] font-black text-brand-500 bg-brand-50 px-2 py-0.5 rounded flex items-center gap-1 border border-brand-100">
                                <ShoppingBag size={10} /> {order.voucher_code}
                             </span>
                          </div>
                          <span className="text-brand-500 font-bold">-{formatVND(order.discount_amount)}</span>
                        </div>
                      )}

                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500 font-medium">Phí giao hàng ({order.shipping_method === 'express' ? 'Nhanh' : 'Tiêu chuẩn'})</span>
                        <span className="text-slate-800 font-bold">{formatVND(order.shipping_fee)}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-[11px] text-text-muted font-black uppercase tracking-widest">Tổng thanh toán</span>
                        <span className="text-[10px] text-slate-400 italic">Giá đã bao gồm VAT</span>
                      </div>
                      <p className="text-[28px] font-black text-brand-500 tracking-tighter tabular-nums leading-none">
                        {formatVND(order.final_amount)}
                      </p>
                    </div>
                  </div>
                </SWTCard>
              </div>
            </div>

            {/* 3. Status Timeline - Padding đồng nhất với Card trên */}
            <SWTCard className="!rounded-2xl !border-none shadow-sm" bodyClassName="!p-8">
              <h4 className="flex items-center gap-2 text-base font-black text-text-main mb-8 border-b border-slate-50 pb-4">
                <Clock size={18} className="text-slate-400" />
                HÀNH TRÌNH ĐƠN HÀNG
              </h4>
              <div className="pl-4">
                <SWTTimeline
                  items={(order as any).status_history?.map((h: any) => ({
                    dot: (
                      <div className={`p-1.5 rounded-full border shadow-sm bg-white ${getStatusClasses(h.status)}`}>
                        {statusIcons[h.status as OrderStatus]}
                      </div>
                    ),
                    children: (
                      <div className="ml-6 pb-8 flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="flex flex-col gap-2 flex-1">
                          <span className="text-sm font-black text-text-main uppercase tracking-tight">{statusLabels[h.status as OrderStatus]}</span>
                          {h.note && (
                            <p className="text-xs text-text-muted bg-white border border-slate-100 p-3 rounded-xl shadow-sm max-w-2xl leading-relaxed">
                              {h.note}
                            </p>
                          )}
                        </div>
                        <div className="shrink-0 flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg text-[11px] font-bold text-slate-400">
                          <Clock size={12} />
                          <span>{new Date(h.createdAt || h.timestamp).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}</span>
                          <span className="opacity-30">|</span>
                          <span>{new Date(h.createdAt || h.timestamp).toLocaleDateString("vi-VN")}</span>
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

// Đây là phần bạn đang bị thiếu:
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
    PENDING: "bg-blue-50 text-blue-600 border-blue-100",
    CONFIRMED: "bg-amber-50 text-amber-600 border-amber-100",
    SHIPPING: "bg-indigo-50 text-indigo-600 border-indigo-100",
    DELIVERED: "bg-emerald-50 text-emerald-600 border-emerald-100",
    CANCELLED: "bg-rose-50 text-rose-600 border-rose-100",
    RETURNED: "bg-slate-50 text-slate-600 border-slate-100",
  };
  return mapping[status] || "";
};