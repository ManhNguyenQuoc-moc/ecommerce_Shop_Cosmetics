"use client";
import { Drawer, Tag, Timeline, Spin } from "antd";
import { OrderDto, OrderStatus } from "@/src/services/models/order/output.dto";
import { useOrder, updateOrderStatus } from "@/src/services/admin/order.service";
import { showNotificationSuccess, showNotificationError } from "@/src/@core/utils/message";
import { useState } from "react";
import { Package, User, MapPin, CreditCard, Clock, CheckCircle2, Truck, XCircle, Undo2 } from "lucide-react";
import Image from "next/image";
import SWTCard from "@/src/@core/component/AntD/SWTCard";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import SWTSteps from "@/src/@core/component/AntD/SWTSteps";

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

// Harmonized status styles for both Light and Dark themes
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

  const renderStatusButtons = () => {
    if (!order) return null;
    const nextStatuses = getNextStatuses(order.current_status);
    if (nextStatuses.length === 0) return null;

    return (
      <div className="flex flex-col gap-3 mt-2 p-4 bg-slate-50 dark:bg-slate-800/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Thao tác xử lý:</span>
        <div className="flex flex-wrap gap-2">
          {nextStatuses.map((s) => (
            <SWTButton
              key={s}
              size="sm"
              loading={updating}
              onClick={() => handleStatusUpdate(s)}
              variant="outlined"
              startIcon={statusIcons[s]}
              className={`!w-fit !h-9 !text-[11px] uppercase font-bold !rounded-full ${getStatusClasses(s)}`}
            >
              {statusLabels[s]}
            </SWTButton>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Drawer
      title={
        <div className="flex items-center justify-between w-full !pr-8">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-0.5">Quản lý đơn hàng</span>
            <span className="text-xl font-black text-slate-800 dark:text-white">#{order?.code || "..."}</span>
          </div>
          {order && (
            <div className={`px-4 py-1.5 rounded-full border text-[11px] font-black uppercase tracking-tight ${getStatusClasses(order.current_status)}`}>
              {statusLabels[order.current_status]}
            </div>
          )}
        </div>
      }
      width={720}
      onClose={onClose}
      open={open}
      styles={{
        body: { padding: 24 },
        header: { borderBottom: '1px solid var(--color-gray-lighter)' }
      }}
      className="dark:[&_.ant-drawer-content]:!bg-[#030712] dark:[&_.ant-drawer-header]:!bg-[#030712] dark:[&_.ant-drawer-header]:!border-slate-900 dark:[&_.ant-drawer-title]:!text-white"
    >
      {isLoading ? (
        <div className="h-full flex items-center justify-center">
          <Spin size="large" />
        </div>
      ) : order ? (
        <div className="flex flex-col gap-6">
          {/* Status Progress Section */}
          <SWTCard bodyClassName="p-6 flex flex-col gap-8 bg-white dark:bg-slate-900/40 border-slate-100 dark:border-slate-800/50">
            <SWTSteps
              current={["PENDING", "CONFIRMED", "SHIPPING", "DELIVERED"].indexOf(order.current_status)}
              size="small"
              items={[
                { title: "Chờ xác nhận" },
                { title: "Đã xác nhận" },
                { title: "Giao nhận" },
                { title: "Hoàn tất" },
              ]}
            />
            {renderStatusButtons()}
          </SWTCard>

          <div className="grid grid-cols-2 gap-6">
            {/* Customer Info */}
            <div className="flex flex-col gap-3">
              <h4 className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <User size={14} className="text-brand-500" />
                Khách hàng
              </h4>
              <SWTCard bodyClassName="p-6 bg-slate-50/50 dark:bg-slate-900/20 border-slate-100/50 dark:border-slate-800/30">
                <p className="font-black text-slate-800 dark:text-white text-base mb-1">{order.customer_name}</p>
                <div className="flex flex-col gap-1 mt-2">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{order.customer_email}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{order.customer_phone}</p>
                </div>
                {order.user && (
                  <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
                    <span className="text-[10px] font-black text-slate-400 uppercase block mb-1.5 opacity-60">Tài khoản:</span>
                    <div className="inline-flex px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                      {order.user.email}
                    </div>
                  </div>
                )}
              </SWTCard>
            </div>

            {/* Shipping & Payment */}
            <div className="flex flex-col gap-3">
              <h4 className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <CreditCard size={14} className="text-brand-500" />
                Vận chuyển & Thanh toán
              </h4>
              <SWTCard bodyClassName="p-6 flex flex-col gap-4 bg-slate-50/50 dark:bg-slate-900/20 border-slate-100/50 dark:border-slate-800/30">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Phương thức:</span>
                  <span className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase">{order.payment_method}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Trạng thái:</span>
                  <div className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${order.payment_status === 'PAID' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' : 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20'}`}>
                    {order.payment_status === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                  </div>
                </div>
                <div className="mt-2 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex items-start gap-3">
                  <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{order.shipping_address}</p>
                </div>
              </SWTCard>
            </div>
          </div>

          {/* Product Items */}
          <div className="flex flex-col gap-3">
            <h4 className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <Package size={14} className="text-brand-500" />
              Danh mục sản phẩm
            </h4>
            <SWTCard bodyClassName="overflow-hidden bg-white dark:bg-slate-900/40 border-slate-100 dark:border-slate-800/50">
              <div className="flex flex-col">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-5 p-5 border-b last:border-0 border-slate-50 dark:border-slate-800 hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors">
                    <div className="w-16 h-16 rounded-xl bg-slate-50 dark:bg-slate-800 overflow-hidden relative border border-slate-100 dark:border-slate-700 flex-shrink-0 shadow-sm">
                      <Image
                        src={item.variant.image || "/images/placeholder.png"}
                        alt={item.variant.product.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-tight mb-1 truncate">{item.variant.product.name}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[10px] font-black bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded uppercase tracking-tighter">{item.variant.color || "Standard"}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Số lượng: <span className="text-slate-800 dark:text-slate-200">{item.quantity}</span></span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-brand-500 text-base mb-0.5">{formatVND(item.price)}</p>
                      {item.variant.price !== item.price && (
                        <p className="text-[10px] text-slate-400 line-through font-medium">{formatVND(item.variant.price || item.price)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/30 p-6 flex justify-between items-center border-t border-slate-100 dark:border-slate-800">
                <span className="text-sm text-slate-400 font-black uppercase tracking-[0.2em] opacity-60">Thành tiền:</span>
                <span className="text-2xl font-black text-brand-600 dark:text-brand-400">{formatVND(order.total_amount)}</span>
              </div>
            </SWTCard>
          </div>

          {/* Activity Timeline */}
          <div className="flex flex-col gap-3 pb-10">
            <h4 className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <Clock size={14} className="text-brand-500" />
              Dòng thời gian đơn hàng
            </h4>
            <SWTCard bodyClassName="p-6 bg-white dark:bg-slate-900/40 border-slate-100 dark:border-slate-800/50">
              <Timeline
                className="dark:[&_.ant-timeline-item-tail]:!border-slate-800/50 [&_.ant-timeline-item-content]:!text-slate-500 mt-2"
                items={order.status_history.map(history => ({
                  dot: <div className={`p-1 rounded-full border ${getStatusClasses(history.status)}`}>{statusIcons[history.status]}</div>,
                  children: (
                    <div className="flex flex-col gap-1.5 ml-2">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-black text-slate-700 dark:text-slate-200 capitalize">{statusLabels[history.status]}</span>
                        <span className="text-[10px] text-slate-400 font-bold opacity-60 tracking-wider font-mono">{new Date(history.createdAt).toLocaleString("vi-VN")}</span>
                      </div>
                      {history.note && (
                        <p className="text-xs italic bg-brand-50/30 dark:bg-brand-500/5 p-3 rounded-xl border border-brand-100/50 dark:border-brand-500/10 text-slate-600 dark:text-slate-400">
                          {history.note}
                        </p>
                      )}
                    </div>
                  )
                }))}
              />
            </SWTCard>
          </div>
        </div>
      ) : null}
    </Drawer>
  );
}
