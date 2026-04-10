import { OrderStatus } from "@/src/services/models/order/output.dto";
import { useOrder, updateOrderStatus, updateOrderPaymentStatus } from "@/src/services/admin/order.service";
import { showNotificationSuccess, showNotificationError } from "@/src/@core/utils/message";
import { useState } from "react";
import { Package, User, CreditCard, Clock, CheckCircle2, Truck, XCircle, Undo2, ChevronRight, Hash, ShieldCheck, MapPin } from "lucide-react";
import Image from "next/image";
import SWTCard from "@/src/@core/component/AntD/SWTCard";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import SWTSteps from "@/src/@core/component/AntD/SWTSteps";
import SWTDrawer from "@/src/@core/component/AntD/SWTDrawer";
import SWTTimeline from "@/src/@core/component/AntD/SWTTimeline";
import SWTSpin from "@/src/@core/component/AntD/SWTSpin";

interface OrderDetailDrawerProps {
  orderId: string | null;
  open: boolean;
  onClose: () => void;
  onUpdate?: () => void;
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
  PENDING: <Clock size={16} />,
  CONFIRMED: <CheckCircle2 size={16} />,
  SHIPPING: <Truck size={16} />,
  DELIVERED: <CheckCircle2 size={16} />,
  CANCELLED: <XCircle size={16} />,
  RETURNED: <Undo2 size={16} />,
};

const getStatusClasses = (status: OrderStatus) => {
  const mapping: Record<OrderStatus, string> = {
    PENDING: "border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-400",
    CONFIRMED: "border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400",
    SHIPPING: "border-cyan-200 bg-cyan-50 text-cyan-600 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-400",
    DELIVERED: "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400",
    CANCELLED: "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400",
    RETURNED: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-600 dark:border-fuchsia-500/30 dark:bg-fuchsia-500/10 dark:text-fuchsia-400",
  };
  return mapping[status] || "";
};

export default function OrderDetailDrawer({ orderId, open, onClose, onUpdate }: OrderDetailDrawerProps) {
  const { order, isLoading, mutate } = useOrder(orderId || undefined);
  const [updating, setUpdating] = useState(false);
  
  const formatVND = (v: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v || 0);

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    if (!orderId) return;
    setUpdating(true);
    try {
      await updateOrderStatus(orderId, newStatus);
      showNotificationSuccess(`Đã cập nhật: ${statusLabels[newStatus]}`);
      mutate();
      onUpdate?.();
    } catch (err: any) {
      showNotificationError(err.message || "Không thể cập nhật trạng thái");
    } finally {
      setUpdating(false);
    }
  };

  const getNextStatuses = (current: OrderStatus): OrderStatus[] => {
    switch (current) {
      case "PENDING": return ["CONFIRMED", "CANCELLED"];
      case "CONFIRMED": return ["SHIPPING", "CANCELLED"];
      case "SHIPPING": return ["DELIVERED", "RETURNED"];
      default: return [];
    }
  };

  const handlePaymentUpdate = async (newStatus: 'PAID' | 'UNPAID') => {
    if (!orderId) return;
    setUpdating(true);
    try {
      await updateOrderPaymentStatus(orderId, newStatus);
      showNotificationSuccess(`Trạng thái thanh toán: ${newStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}`);
      mutate();
      onUpdate?.();
    } catch (err: any) {
      showNotificationError(err.message || "Không thể cập nhật thanh toán");
    } finally {
      setUpdating(false);
    }
  };

  const getSoftActionClasses = (status: OrderStatus) => {
    const mapping: Record<string, string> = {
      CONFIRMED: "!bg-brand-500/10 !border-brand-500/20 !text-brand-500 hover:!bg-brand-500/20",
      SHIPPING: "!bg-blue-500/10 !border-blue-500/20 !text-blue-500 hover:!bg-blue-500/20",
      DELIVERED: "!bg-emerald-500/10 !border-emerald-500/20 !text-emerald-500 hover:!bg-emerald-500/20",
      CANCELLED: "!bg-red-500/10 !border-red-500/20 !text-red-500 hover:!bg-red-500/20",
      RETURNED: "!bg-orange-500/10 !border-orange-500/20 !text-orange-500 hover:!bg-orange-500/20",
    };
    return mapping[status] || "!bg-slate-500/10 !border-slate-500/20 !text-slate-500 hover:!bg-slate-500/20";
  };

  const renderStatusButtons = () => {
    if (!order) return null;
    const nextStatuses = getNextStatuses(order.current_status);
    const canConfirmPayment = order.payment_status === "UNPAID" && (order.current_status === "DELIVERED" || order.current_status === "SHIPPING");

    if (nextStatuses.length === 0 && !canConfirmPayment) return null;
    
    return (
      <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Thao tác xử lý:
        </span>
        <div className="flex flex-row items-center gap-3">
          {nextStatuses.map((s) => (
            <SWTButton
              key={s} 
              size="sm" 
              loading={updating} 
              variant="outlined"
              onClick={() => handleStatusUpdate(s)}
              startIcon={statusIcons[s]}
              className={`!rounded-xl !h-10 px-5 !font-bold shadow-sm !w-auto transition-all ${getSoftActionClasses(s)}`}
            >
              {statusLabels[s]}
            </SWTButton>
          ))}
          
          {canConfirmPayment && (
            <SWTButton
              size="sm" 
              loading={updating} 
              variant="outlined"
              onClick={() => handlePaymentUpdate("PAID")}
              startIcon={<ShieldCheck size={16} />}
              className="!bg-emerald-500/10 !border-emerald-500/20 !text-emerald-500 hover:!bg-emerald-500/20 !rounded-xl !h-10 px-5 !font-bold shadow-sm !w-auto transition-all"
            >
              Xác nhận Thanh toán
            </SWTButton>
          )}
        </div>
      </div>
    );
  };
  return (
    <SWTDrawer
      title={
        <div className="flex flex-col items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-xl text-brand-500 font-bold uppercase tracking-widest">Chi tiết đơn hàng</span>
            </div>
            <div className="flex items-center gap-1 font-black text-lg text-slate-800 dark:text-white">
                <Hash size={16} className="text-brand-500" />
                <span>{order?.code || "..."}</span>
              </div>
          </div>
          {order && (
            <div className={`px-3 py-1.5 rounded-lg border text-xs font-bold uppercase shadow-sm ${getStatusClasses(order.current_status)}`}>
              {statusLabels[order.current_status]}
            </div>
          )}
        </div>
      }
      width={900}
      onClose={onClose}
      open={open}
    >
      {isLoading ? (
        <div className="h-full flex items-center justify-center">
          <SWTSpin size="large" />
        </div>
      ) : order ? (
        <div className="flex flex-col gap-6 pb-10">
          
          {/* Progress & Actions Section */}
          <SWTCard 
            className=" !m-2 !rounded-2xl !border !border-slate-200 dark:!border-slate-700 !shadow-sm !overflow-hidden" 
            bodyClassName="!p-6 !bg-white dark:!bg-slate-900"
          >
            <SWTSteps
              sizeVariant="sm"
              current={order.current_status === "DELIVERED" ? 4 : ["PENDING", "CONFIRMED", "SHIPPING", "DELIVERED"].indexOf(order.current_status)}
              status={(order.current_status === "CANCELLED" || order.current_status === "RETURNED") ? "error" : "process"}
              items={[
                { title: "Chờ xác nhận" },
                { title: "Đã xác nhận" },
                { title: "Giao nhận" },
                { title: "Hoàn tất" },
              ]}
            />
            {renderStatusButtons()}
          </SWTCard>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: Customer & Shipping */}
            <div className="md:col-span-5 flex flex-col gap-6">
              <SWTCard 
                className="!ml-2 !rounded-2xl !border !border-slate-200 dark:!border-slate-700 !shadow-sm !overflow-hidden" 
                bodyClassName="!p-0 !bg-white dark:!bg-slate-900"
              >
                {/* Customer Info */}
                <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 uppercase">
                    <User size={18} className="text-brand-500" /> Khách hàng
                  </h4>
                  <div className="flex flex-col gap-2.5">
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Tên hiển thị</p>
                      <p className="font-bold text-slate-800 dark:text-white text-base">{order.customer_name}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-500 mb-0.5">Điện thoại</p>
                        <p className="font-semibold text-sm text-slate-700 dark:text-slate-300">{order.customer_phone}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-0.5">Email</p>
                        <p className="font-semibold text-sm text-slate-700 dark:text-slate-300 truncate" title={order.customer_email}>{order.customer_email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping & Payment Info */}
                <div className="p-5 bg-slate-50/50 dark:bg-slate-800/20">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 uppercase">
                    <CreditCard size={18} className="text-brand-500" /> Thanh toán & Giao hàng
                  </h4>
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">Phương thức</span>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200 uppercase bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 shadow-sm">
                        {order.payment_method}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">Trạng thái TT</span>
                      <span className={`px-2 py-1 rounded text-[11px] font-bold uppercase border shadow-sm ${order.payment_status === 'PAID' ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-400' : 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-500/10 dark:border-orange-500/30 dark:text-orange-400'}`}>
                        {order.payment_status === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">Vận chuyển</span>
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 uppercase bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 shadow-sm">
                        {order.shipping_method === 'express' ? 'Giao hàng nhanh' : 'Giao hàng tiêu chuẩn'}
                      </span>
                    </div>
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                      <span className="text-xs text-slate-500 flex items-center gap-1 mb-1"><MapPin size={12}/> Địa chỉ nhận:</span>
                      <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{order.shipping_address}</p>
                    </div>
                  </div>
                </div>
              </SWTCard>
            </div>

            {/* RIGHT COLUMN: Order Items */}
            <div className="md:col-span-7 flex flex-col gap-6">
              <SWTCard 
                className=" !mr-2 !rounded-2xl !border !border-slate-200 dark:!border-slate-700 !shadow-sm !overflow-hidden" 
                bodyClassName="!p-0 !bg-white dark:!bg-slate-900 flex flex-col h-full"
              >
                {/* Header Items */}
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
                   <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200 uppercase m-0">
                    <Package size={18} className="text-brand-500" /> Danh sách sản phẩm ({order.items.length})
                  </h4>
                </div>
                <div className="flex flex-col flex-1 max-h-[400px] overflow-y-auto custom-scrollbar">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-start gap-4 p-4 border-b last:border-0 border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden relative border border-slate-200 dark:border-slate-700 flex-shrink-0">
                        <Image
                          src={item.variant?.image || "/images/placeholder.png"}
                          alt={item.variant?.product?.name || "Product"} fill className="object-cover" unoptimized
                        />
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <p className="font-bold text-slate-800 dark:text-slate-200 text-sm truncate mb-1">{item.variant?.product?.name}</p>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 uppercase">{item.variant?.color || "Standard"}</span>
                          <span className="text-[11px] text-slate-500">x {item.quantity}</span>
                        </div>
                      </div>
                      <div className="text-right pt-0.5">
                        <p className="font-bold text-brand-600 dark:text-brand-400 text-sm">{formatVND(item.price)}</p>
                        {item.variant?.price !== item.price && (
                          <p className="text-[10px] text-slate-400 line-through font-medium mt-0.5">{formatVND(item.variant?.price || item.price)}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Summary Section */}
                <div className="p-5 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-700">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-slate-500">
                      <span>Tạm tính:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{formatVND(order.total_amount)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-500">
                      <span>Phí vận chuyển:</span>
                      <span className="font-semibold text-emerald-500">{formatVND(order.shipping_fee)}</span>
                    </div>
                    <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                      <span className="text-sm font-bold text-slate-800 dark:text-white uppercase">Tổng thanh toán:</span>
                      <span className="text-2xl font-black text-brand-600 dark:text-brand-400">{formatVND(order.final_amount)}</span>
                    </div>
                  </div>
                </div>
              </SWTCard>
            </div>
          </div>

          {/* Activity Timeline Section */}
          <SWTCard 
            className="!mx-2 !rounded-2xl !border !border-slate-200 dark:!border-slate-700 !shadow-sm" 
            bodyClassName="!p-6 !bg-white dark:!bg-slate-900"
          >
            <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200 mb-6 uppercase">
              <Clock size={18} className="text-brand-500" /> Lịch sử đơn hàng
            </h4>
            <SWTTimeline
              className="dark:[&_.ant-timeline-item-tail]:!border-slate-700 [&_.ant-timeline-item-content]:!text-slate-500 !mx-2"
              items={order.status_history.map((history) => ({
                dot: (
                  <div className={`p-1.5 rounded-full border shadow-sm bg-white dark:bg-slate-900 ${getStatusClasses(history.status)}`}>
                    {statusIcons[history.status]}
                  </div>
                ),
                children: (
                  <div className="flex flex-col gap-1 ml-2 pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{statusLabels[history.status]}</span>
                      <span className="text-[11px] text-slate-500 font-medium bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                        {new Date(history.createdAt).toLocaleString("vi-VN", { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                    </div>
                    {history.note && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 mt-1 inline-block">
                        {history.note}
                      </p>
                    )}
                  </div>
                )
              }))}
            />
          </SWTCard>
        </div>
      ) : null}
    </SWTDrawer>
  );
}