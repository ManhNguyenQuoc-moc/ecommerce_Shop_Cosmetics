import React from 'react';
import Image from 'next/image';
import { Package, MapPin, CreditCard, Clock, User, CheckCircle2, Truck, XCircle, Undo2, ChevronRight } from 'lucide-react';
import SWTModal from '@/src/@core/component/AntD/SWTModal';
import SWTCard from '@/src/@core/component/AntD/SWTCard';
import SWTSteps from '@/src/@core/component/AntD/SWTSteps';
import SWTTimeline from '@/src/@core/component/AntD/SWTTimeline';
import SWTSpin from '@/src/@core/component/AntD/SWTSpin';
import SWTDivider from '@/src/@core/component/AntD/SWTDivider';
import { OrderDTO, OrderStatus } from '@/src/services/models/customer/order.dto';
import { useFetchSWR } from '@/src/@core/hooks/useFetchSWR';
import { getOrderDetails } from '@/src/services/customer/order.service';

interface Props {
  orderId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const statusLabels: Record<OrderStatus, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  SHIPPING: "Đang giao hàng",
  DELIVERED: "Đã giao hàng",
  CANCELLED: "Đã hủy",
  RETURNED: "Trả hàng/Hoàn tiền",
};

const statusIcons: Record<OrderStatus, React.ReactNode> = {
  PENDING: <Clock size={16} />,
  CONFIRMED: <CheckCircle2 size={16} />,
  SHIPPING: <Truck size={16} />,
  DELIVERED: <CheckCircle2 size={16} />,
  CANCELLED: <XCircle size={16} />,
  RETURNED: <Undo2 size={16} />,
};

const getStatusClasses = (status: OrderStatus) => {
  const mapping: Record<OrderStatus, string> = {
    PENDING: "border-blue-100 bg-blue-50 text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400",
    CONFIRMED: "border-amber-100 bg-amber-50 text-amber-600 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400",
    SHIPPING: "border-cyan-100 bg-cyan-50 text-cyan-600 dark:border-cyan-500/20 dark:bg-cyan-500/10 dark:text-cyan-400",
    DELIVERED: "border-emerald-100 bg-emerald-50 text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400",
    CANCELLED: "border-rose-100 bg-rose-50 text-rose-600 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400",
    RETURNED: "border-fuchsia-100 bg-fuchsia-50 text-fuchsia-600 dark:border-fuchsia-500/20 dark:bg-fuchsia-500/10 dark:text-fuchsia-400",
  };
  return mapping[status] || "";
};

export default function OrderDetailModal({ orderId, isOpen, onClose }: Props) {
  const { data: order, isLoading } = useFetchSWR(
    orderId ? ["order-detail", orderId] : null,
    () => getOrderDetails(orderId!)
  );

  const formatVND = (v: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v || 0);

  return (
    <SWTModal
      title={
        <div className="flex items-center justify-between w-full pr-10">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Chi tiết đơn hàng</span>
            <span className="text-xl font-black text-gray-900">#{order?.code || "..."}</span>
          </div>
          {order && (
            <div className={`px-4 py-1.5 rounded-full border text-[11px] font-black uppercase tracking-tight ${getStatusClasses(order.current_status)}`}>
              {statusLabels[order.current_status]}
            </div>
          )}
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={800}
      centered
      bodyClassName="!p-0"
    >
      <div className="max-h-[80vh] overflow-y-auto custom-scrollbar">
        {isLoading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4">
            <SWTSpin size="large" />
            <p className="text-sm text-gray-400 font-medium">Đang tải thông tin đơn hàng...</p>
          </div>
        ) : order ? (
          <div className="p-6 space-y-8">
            {/* Status Progress */}
            <SWTCard bodyClassName="!p-8 bg-white border-gray-100 shadow-sm rounded-2xl">
              <SWTSteps
                sizeVariant="lg"
                current={order.current_status === "DELIVERED" ? 4 : ["PENDING", "CONFIRMED", "SHIPPING", "DELIVERED"].indexOf(order.current_status)}
                status={(order.current_status === "CANCELLED" || order.current_status === "RETURNED") ? "error" : "process"}
                items={[
                  { title: "Chờ xác nhận" },
                  { title: "Đã xác nhận" },
                  { title: "Giao nhận" },
                  { title: "Hoàn tất" },
                ]}
              />
            </SWTCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Shipping Address */}
              <div className="space-y-3">
                <h4 className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest border-l-2 border-brand-500 pl-2">
                  <MapPin size={14} className="text-brand-500" />
                  Địa chỉ nhận hàng
                </h4>
                <SWTCard bodyClassName="p-5 bg-gray-50/50 border-gray-100 rounded-xl">
                  <p className="text-sm text-gray-700 font-medium leading-relaxed">
                    {order.shipping_address}
                  </p>
                </SWTCard>
              </div>

              {/* Payment Info */}
              <div className="space-y-3">
                <h4 className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest border-l-2 border-brand-500 pl-2">
                  <CreditCard size={14} className="text-brand-500" />
                  Thanh toán
                </h4>
                <SWTCard bodyClassName="p-5 flex flex-col gap-3 bg-gray-50/50 border-gray-100 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-tighter">Phương thức:</span>
                    <span className="text-xs font-black text-gray-700">{order.payment_method}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-tighter">Trạng thái:</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${order.payment_status === 'PAID' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                      {order.payment_status === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                    </span>
                  </div>
                </SWTCard>
              </div>
            </div>

            {/* Product List */}
            <div className="space-y-4">
              <h4 className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest border-l-2 border-brand-500 pl-2">
                <Package size={14} className="text-brand-500" />
                Sản phẩm đã chọn
              </h4>
              <SWTCard bodyClassName="overflow-hidden bg-white border-gray-100 shadow-sm rounded-2xl">
                <div className="divide-y divide-gray-50">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-5 p-5 hover:bg-gray-50/30 transition-colors">
                      <div className="w-16 h-16 rounded-xl bg-gray-50 overflow-hidden relative border border-gray-100 flex-shrink-0 shadow-sm">
                        <Image src={item.product_image || "/images/placeholder.png"} alt={item.product_name} fill className="object-cover" unoptimized />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-sm leading-tight mb-1 truncate">{item.product_name}</p>
                        <div className="flex items-center gap-3">
                          {item.variant_name && <span className="text-[10px] font-bold text-gray-400 uppercase">Loại: {item.variant_name}</span>}
                          <span className="text-[10px] text-gray-400 font-bold uppercase">x{item.quantity}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-brand-500 text-sm">{formatVND(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Total Summary */}
                <div className="bg-gray-50/50 p-6 flex justify-between items-center border-t border-gray-100">
                  <span className="text-xs text-gray-400 font-black uppercase tracking-[0.2em]">Tổng cộng:</span>
                  <div className="text-right">
                    <p className="text-2xl font-black text-brand-600">{formatVND(order.final_amount)}</p>
                  </div>
                </div>
              </SWTCard>
            </div>

            {/* Timeline */}
            <div className="space-y-4 pb-4">
               <h4 className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest border-l-2 border-brand-500 pl-2">
                <Clock size={14} className="text-brand-500" />
                Dòng thời gian
              </h4>
               <SWTCard bodyClassName="p-6 bg-white border-gray-100 rounded-2xl">
                 <SWTTimeline
                  className="mt-2"
                  items={(order as any).status_history?.map((h: any) => ({
                    dot: <div className={`p-1 rounded-full border ${getStatusClasses(h.status)}`}>{statusIcons[h.status as OrderStatus]}</div>,
                    children: (
                      <div className="ml-2 flex justify-between items-start">
                        <span className="text-sm font-bold text-gray-700">{statusLabels[h.status as OrderStatus]}</span>
                        <span className="text-[10px] text-gray-400 font-mono">{new Date(h.createdAt || h.timestamp).toLocaleString("vi-VN")}</span>
                      </div>
                    )
                  }))}
                />
               </SWTCard>
            </div>
          </div>
        ) : null}
      </div>
    </SWTModal>
  );
}
