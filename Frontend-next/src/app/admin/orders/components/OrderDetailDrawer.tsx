import { OrderStatus } from "@/src/services/models/order/output.dto";
import { useOrder, updateOrderStatus, updateOrderPaymentStatus } from "@/src/services/admin/order.service";
import { showNotificationSuccess, showNotificationError } from "@/src/@core/utils/message";
import { useState } from "react";
import { Package, User, MapPin, CreditCard, Clock, CheckCircle2, Truck, XCircle, Undo2, ChevronRight, Hash } from "lucide-react";
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
    PENDING: "border-blue-100 bg-blue-50 text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400",
    CONFIRMED: "border-amber-100 bg-amber-50 text-amber-600 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400",
    SHIPPING: "border-cyan-100 bg-cyan-50 text-cyan-600 dark:border-cyan-500/20 dark:bg-cyan-500/10 dark:text-cyan-400",
    DELIVERED: "border-emerald-100 bg-emerald-50 text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400",
    CANCELLED: "border-rose-100 bg-rose-50 text-rose-600 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400",
    RETURNED: "border-fuchsia-100 bg-fuchsia-50 text-fuchsia-600 dark:border-fuchsia-500/20 dark:bg-fuchsia-500/10 dark:text-fuchsia-400",
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
      showNotificationSuccess(`Đã cập nhật trạng thái đơn hàng: ${statusLabels[newStatus]}`);
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
      showNotificationSuccess(`Đã cập nhật trạng thái thanh toán: ${newStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}`);
      mutate();
      onUpdate?.();
    } catch (err: any) {
      showNotificationError(err.message || "Không thể cập nhật trạng thái thanh toán");
    } finally {
      setUpdating(false);
    }
  };

  const renderStatusButtons = () => {
    if (!order) return null;
    const nextStatuses = getNextStatuses(order.current_status);
    const canConfirmPayment = order.payment_status === "UNPAID" && (order.current_status === "DELIVERED" || order.current_status === "SHIPPING");

    if (nextStatuses.length === 0 && !canConfirmPayment) return null;
    return (
      <div className="flex flex-col gap-3 mt-4 p-5 bg-slate-50/50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10">
        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Thao tác xử lý:</span>
        <div className="flex flex-wrap gap-2.5">
          {nextStatuses.map((s) => (
            <SWTButton
              key={s}
              size="sm"
              loading={updating}
              onClick={() => handleStatusUpdate(s)}
              variant="outlined"
              startIcon={statusIcons[s]}
              className={`!w-fit !h-10 !px-5 !text-[11px] uppercase font-black !rounded-xl transition-all hover:scale-105 active:scale-95 ${getStatusClasses(s)}`}
            >
              {statusLabels[s]}
            </SWTButton>
          ))}
          {canConfirmPayment && (
            <SWTButton
              size="sm"
              loading={updating}
              onClick={() => handlePaymentUpdate("PAID")}
              variant="outlined"
              startIcon={<CreditCard size={16} />}
              className="!w-fit !h-10 !px-5 !text-[11px] uppercase font-black !rounded-xl border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-all hover:scale-105 active:scale-95"
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
        <div className="grid grid-cols-3 items-center w-full !pr-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-white/5 flex items-center justify-center">
              <Package size={16} className="text-slate-400" />
            </div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ORDER DETAIL</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-brand-500 font-black uppercase tracking-[0.3em] mb-0.5">Chi tiết đơn hàng</span>
            <div className="flex items-center gap-1.5 font-black text-xl text-slate-800 dark:text-white">
              <Hash size={18} className="text-slate-300 dark:text-slate-600" />
              <span>{order?.code || "..."}</span>
            </div>
          </div>
          <div className="flex justify-end">
            {order && (
              <div className={`px-4 py-1.5 rounded-xl border text-[11px] font-black uppercase tracking-wider shadow-sm ${getStatusClasses(order.current_status)}`}>
                {statusLabels[order.current_status]}
              </div>
            )}
          </div>
        </div>
      }
      width={1000}
      onClose={onClose}
      open={open}
      styles={{
        body: { 
          padding: 24,
          margin: 16,
          backgroundColor: 'transparent',
          borderRadius: '1.5rem'
        },
        header: { 
          borderBottom: '1px solid var(--color-gray-lighter)', 
          padding: '16px 24px' 
        }
      }}
    >
      {isLoading ? (
        <div className="h-full flex items-center justify-center">
          <SWTSpin size="large" />
        </div>
      ) : order ? (
        <div className="flex flex-col gap-8">
          {/* Progress & Actions Section */}
          <SWTCard bodyClassName="!p-10 bg-white dark:bg-slate-900/40 border-slate-100 dark:border-white/5 rounded-[2rem] shadow-sm">
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
            {renderStatusButtons()}
          </SWTCard>

          {/* Main Content Grid: 40/60 Split */}
          <div className="grid grid-cols-12 gap-8 items-start">
            {/* Left Column: Information (40%) */}
            <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
              {/* Customer Card */}
              <div className="flex flex-col gap-3">
                <h4 className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                  <User size={14} className="text-brand-500" />
                  Thông tin khách hàng
                </h4>
                <SWTCard bodyClassName="p-6 bg-slate-50/50 dark:bg-white/5 border-slate-100 dark:border-white/10 rounded-2xl">
                  <div className="flex items-center gap-4 mb-5 pb-5 border-b border-slate-100 dark:border-white/5">
                    <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-500 font-black text-xl">
                      {order.customer_name?.[0]}
                    </div>
                    <div>
                      <p className="font-black text-slate-800 dark:text-white text-lg leading-tight">{order.customer_name}</p>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-tight mt-0.5">Khách vãng lai</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center group">
                      <span className="text-[11px] text-slate-400 font-bold uppercase">Email:</span>
                      <span className="text-sm font-black text-slate-700 dark:text-slate-300">{order.customer_email}</span>
                    </div>
                    <div className="flex justify-between items-center group">
                      <span className="text-[11px] text-slate-400 font-bold uppercase">Điện thoại:</span>
                      <span className="text-sm font-black text-slate-700 dark:text-slate-300">{order.customer_phone}</span>
                    </div>
                  </div>
                </SWTCard>
              </div>

              {/* Shipping & Payment Card */}
              <div className="flex flex-col gap-3">
                <h4 className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                  <CreditCard size={14} className="text-brand-500" />
                  Vận chuyển & Thanh toán
                </h4>
                <SWTCard bodyClassName="p-6 flex flex-col gap-5 bg-slate-50/50 dark:bg-white/5 border-slate-100 dark:border-white/10 rounded-2xl">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] text-slate-400 font-bold uppercase">Phương thức:</span>
                    <div className="flex items-center gap-2 text-[11px] font-black text-slate-700 dark:text-slate-200 uppercase bg-slate-100 dark:bg-white/10 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/5">
                       <CreditCard size={14} className="opacity-50" />
                       {order.payment_method}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] text-slate-400 font-bold uppercase">Trạng thái:</span>
                    <div className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase border shadow-sm ${order.payment_status === 'PAID' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400' : 'bg-orange-500/10 text-orange-600 border-orange-500/20 dark:text-orange-400'}`}>
                      {order.payment_status === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                    </div>
                  </div>
                  <div className="mt-2 pt-5 border-t border-slate-100 dark:border-white/5">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center shrink-0">
                        <MapPin size={18} className="text-slate-400" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Địa chỉ nhận hàng:</span>
                        <p className="text-sm text-slate-600 dark:text-slate-300 font-black leading-relaxed">{order.shipping_address}</p>
                      </div>
                    </div>
                  </div>
                </SWTCard>
              </div>
            </div>

            {/* Right Column: Order Items & Pricing (60%) */}
            <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <h4 className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                  <Package size={14} className="text-brand-500" />
                  Danh mục kiện hàng
                </h4>
                <SWTCard bodyClassName="overflow-hidden bg-white dark:bg-slate-900/40 border-slate-100 dark:border-white/5 rounded-[2rem] shadow-sm">
                  <div className="flex flex-col">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-5 p-6 border-b last:border-0 border-slate-50 dark:border-white/5 hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                        <div className="w-20 h-20 rounded-2xl bg-slate-50 dark:bg-brand-500/5 overflow-hidden relative border border-slate-100 dark:border-white/10 flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                          <Image
                            src={item.variant?.image || "/images/placeholder.png"}
                            alt={item.variant?.product?.name || "Product"}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-slate-800 dark:text-slate-100 text-base leading-tight mb-1.5 hover:text-brand-500 cursor-pointer transition-colors">{item.variant?.product?.name}</p>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 px-3 py-1 rounded-lg uppercase tracking-tighter border border-slate-200 dark:border-white/5">{item.variant?.color || "Standard"}</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">QTY: <span className="text-slate-800 dark:text-slate-200 text-sm ml-1">{item.quantity}</span></span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-brand-600 dark:text-brand-400 text-lg mb-0.5">{formatVND(item.price)}</p>
                          {item.variant?.price !== item.price && (
                            <p className="text-xs text-slate-400 line-through font-bold opacity-60 italic">{formatVND(item.variant?.price || item.price)}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Summary Section */}
                  <div className="bg-slate-50/50 dark:bg-white/[0.02] p-8 border-t border-slate-100 dark:border-white/10">
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase tracking-widest pl-1">
                        <span>Tổng giá trị hàng:</span>
                        <span className="text-slate-600 dark:text-slate-400">{formatVND(order.total_amount)}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase tracking-widest pl-1">
                        <span>Phí vận chuyển (Ưu đãi):</span>
                        <span className="text-emerald-500">Miễn phí</span>
                      </div>
                      <div className="mt-4 pt-6 border-t border-slate-200 dark:border-white/10 flex justify-between items-center">
                        <span className="text-sm text-slate-800 dark:text-white font-black uppercase tracking-[0.2em]">Tổng cộng:</span>
                        <span className="text-3xl font-black text-brand-600 dark:text-brand-400 shadow-brand-500/20 drop-shadow-sm">{formatVND(order.total_amount)}</span>
                      </div>
                    </div>
                  </div>
                </SWTCard>
              </div>
            </div>
          </div>

          {/* Activity Timeline Section (Full Width) */}
          <div className="flex flex-col gap-4 pb-20">
            <h4 className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
              <Clock size={14} className="text-brand-500" />
              Lịch sử trạng thái đơn hàng
            </h4>
            <SWTCard bodyClassName="p-10 bg-white dark:bg-slate-900/40 border-slate-100 dark:border-white/5 rounded-[2rem] shadow-sm">
              <SWTTimeline
                className="dark:[&_.ant-timeline-item-tail]:!border-white/10 [&_.ant-timeline-item-content]:!text-slate-500 mt-4 pl-2"
                items={order.status_history.map((history, idx) => ({
                  dot: (
                    <div className={`p-2 rounded-xl border shadow-sm ${getStatusClasses(history.status)}`}>
                      {statusIcons[history.status]}
                    </div>
                  ),
                  children: (
                    <div className="flex flex-col gap-2 ml-4">
                      <div className="flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                           <span className="text-base font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight">{statusLabels[history.status]}</span>
                           <ChevronRight size={14} className="text-slate-300 dark:text-slate-700 group-hover:translate-x-1 transition-transform" />
                        </div>
                        <span className="text-xs text-slate-400 font-mono font-bold bg-slate-50 dark:bg-white/5 px-3 py-1 rounded-lg border border-slate-100 dark:border-white/5">{new Date(history.createdAt).toLocaleString("vi-VN", { dateStyle: 'medium', timeStyle: 'short' })}</span>
                      </div>
                      {history.note && (
                        <div className="relative mt-1">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-500 rounded-full opacity-20" />
                          <p className="text-xs italic bg-slate-50 dark:bg-white/[0.02] p-4 rounded-xl border border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-400 ml-3">
                            "{history.note}"
                          </p>
                        </div>
                      )}
                    </div>
                  )
                }))}
              />
            </SWTCard>
          </div>
        </div>
      ) : null}
    </SWTDrawer>
  );
}
