import { OrderStatus } from "@/src/enums";
import { getStatusLabel, getStatusVariant } from "@/src/enums/status-config";
import { useOrder } from "@/src/services/admin/order/order.hook";
import { updateOrderStatus, updateOrderPaymentStatus } from "@/src/services/admin/order/order.service";
import { showNotificationSuccess, showNotificationError } from "@/src/@core/utils/message";
import { useState } from "react";
import { Package, User, CreditCard, Clock, CheckCircle2, Truck, XCircle, Undo2, ChevronRight, Hash, ShieldCheck, MapPin, Ticket } from "lucide-react";
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

const statusIcons: Record<string, React.ReactNode> = {
  PENDING: <Clock size={16} />,
  CONFIRMED: <CheckCircle2 size={16} />,
  SHIPPING: <Truck size={16} />,
  DELIVERED: <CheckCircle2 size={16} />,
  CANCELLED: <XCircle size={16} />,
  RETURNED: <Undo2 size={16} />,
};

const getStatusClasses = (status: string) => {
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

export default function OrderDetailDrawer({ orderId, open, onClose, onUpdate }: OrderDetailDrawerProps) {
  const { order, isLoading, mutate } = useOrder(orderId || undefined);
  const [updating, setUpdating] = useState(false);

  const formatVND = (v: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v || 0);

  const handleStatusUpdate = async (newStatus: string) => {
    if (!orderId) return;
    setUpdating(true);
    try {
      await updateOrderStatus(orderId, newStatus);
      showNotificationSuccess(`Đã cập nhật: ${getStatusLabel(newStatus)}`);
      mutate();
      onUpdate?.();
    } catch (err: any) {
      showNotificationError(err.message || "Không thể cập nhật trạng thái");
    } finally {
      setUpdating(false);
    }
  };

  const getNextStatuses = (current: string): string[] => {
    switch (current) {
      case OrderStatus.PENDING: return [OrderStatus.CONFIRMED, OrderStatus.CANCELLED];
      case OrderStatus.CONFIRMED: return [OrderStatus.SHIPPING, OrderStatus.CANCELLED];
      case OrderStatus.SHIPPING: return [OrderStatus.DELIVERED, OrderStatus.RETURNED];
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

  const getSoftActionClasses = (status: string) => {
    const mapping: Record<string, string> = {
      CONFIRMED: "!bg-status-warning-bg !border-status-warning-border !text-status-warning-text hover:opacity-80",
      SHIPPING: "!bg-status-info-bg !border-status-info-border !text-status-info-text hover:opacity-80",
      DELIVERED: "!bg-status-success-bg !border-status-success-border !text-status-success-text hover:opacity-80",
      CANCELLED: "!bg-status-error-bg !border-status-error-border !text-status-error-text hover:opacity-80",
      RETURNED: "!bg-status-neutral-bg !border-status-neutral-border !text-status-neutral-text hover:opacity-80",
    };
    return mapping[status] || "!bg-bg-muted !border-border-default !text-text-muted";
  };

  const renderStatusButtons = () => {
    if (!order) return null;
    const nextStatuses = getNextStatuses(order.current_status);
    const canConfirmPayment = order.payment_status === "UNPAID" && (order.current_status === "DELIVERED" || order.current_status === "SHIPPING");

    if (nextStatuses.length === 0 && !canConfirmPayment) return null;

    return (
      <div className="mt-5 pt-5 border-t border-border-default flex flex-wrap items-center justify-between gap-4">
        <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
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
              {getStatusLabel(s, 'order')}
            </SWTButton>
          ))}

          {canConfirmPayment && (
            <SWTButton
              size="sm"
              loading={updating}
              variant="outlined"
              onClick={() => handlePaymentUpdate("PAID")}
              startIcon={<ShieldCheck size={16} />}
              className="!bg-status-success-bg !border-status-success-border !text-status-success-text hover:opacity-80 !rounded-xl !h-10 px-5 !font-bold shadow-sm !w-auto transition-all"
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
            <div className="flex items-center gap-1 font-black text-lg text-text-main">
              <Hash size={16} className="text-brand-500" />
              <span>{order?.code || "..."}</span>
            </div>
          </div>
          {order && (
            <div className={`px-3 py-1.5 rounded-lg border text-xs font-bold uppercase shadow-sm ${getStatusClasses(order.current_status)}`}>
              {getStatusLabel(order.current_status, 'order')}
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
            className=" !m-2 !rounded-2xl !border !border-border-default dark:!border-border-brand !shadow-sm !overflow-hidden"
            bodyClassName="!p-6 !bg-bg-card"
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
                className="!ml-2 !rounded-2xl !border !border-border-default dark:!border-border-brand !shadow-sm !overflow-hidden"
                bodyClassName="!p-0 !bg-bg-card"
              >
                {/* Customer Info */}
                <div className="p-5 border-b border-border-default">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-text-main mb-4 uppercase">
                    <User size={18} className="text-brand-500" /> Khách hàng
                  </h4>
                  <div className="flex flex-col gap-2.5">
                    <div>
                      <p className="text-xs text-text-muted mb-0.5">Tên hiển thị</p>
                      <p className="font-bold text-text-main text-base">{order.customer_name}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-text-muted mb-0.5">Điện thoại</p>
                        <p className="font-semibold text-sm text-text-sub">{order.customer_phone}</p>
                      </div>
                      <div>
                        <p className="text-xs text-text-muted mb-0.5">Email</p>
                        <p className="font-semibold text-sm text-text-sub truncate" title={order.customer_email}>{order.customer_email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping & Payment Info */}
                <div className="p-5 bg-bg-muted">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-text-main mb-4 uppercase">
                    <CreditCard size={18} className="text-brand-500" /> Thanh toán & Giao hàng
                  </h4>
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-text-muted">Phương thức</span>
                      <span className="text-sm font-bold text-text-sub uppercase bg-bg-card px-2 py-1 rounded border border-border-default shadow-sm">
                        {order.payment_method}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-text-muted">Trạng thái TT</span>
                      <span className={`px-2 py-1 rounded text-[11px] font-bold uppercase border shadow-sm ${order.payment_status === 'PAID' ? 'bg-status-success-bg text-status-success-text border-status-success-border' : 'bg-status-warning-bg text-status-warning-text border-status-warning-border'}`}>
                        {order.payment_status === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-text-muted">Vận chuyển</span>
                      <span className="text-[11px] font-bold text-text-sub uppercase bg-bg-muted px-2 py-1 rounded border border-border-default shadow-sm">
                        {order.shipping_method === 'express' ? 'Giao hàng nhanh' : 'Giao hàng tiêu chuẩn'}
                      </span>
                    </div>
                    <div className="pt-3 border-t border-border-default">
                      <span className="text-xs text-text-muted flex items-center gap-1 mb-1"><MapPin size={12} /> Địa chỉ nhận:</span>
                      <p className="text-sm text-text-sub font-medium leading-relaxed">{order.shipping_address}</p>
                    </div>
                  </div>
                </div>
              </SWTCard>
            </div>

            {/* RIGHT COLUMN: Order Items */}
            <div className="md:col-span-7 flex flex-col gap-6">
              <SWTCard
                className=" !mr-2 !rounded-2xl !border !border-border-default dark:!border-border-brand !shadow-sm !overflow-hidden"
                bodyClassName="!p-0 !bg-bg-card flex flex-col h-full"
              >
                {/* Header Items */}
                <div className="p-4 border-b border-border-default bg-bg-muted">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-text-main uppercase m-0">
                    <Package size={18} className="text-brand-500" /> Danh sách sản phẩm ({order.items.length})
                  </h4>
                </div>
                <div className="flex flex-col flex-1 max-h-[400px] overflow-y-auto custom-scrollbar">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-start gap-4 p-4 border-b last:border-0 border-border-default hover:bg-bg-muted transition-colors">
                      <div className="w-16 h-16 rounded-xl bg-bg-muted overflow-hidden relative border border-border-default flex-shrink-0">
                        <Image
                          src={item.variant?.image || "/images/placeholder.png"}
                          alt={item.variant?.product?.name || "Product"} fill className="object-cover" unoptimized
                        />
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <p className="font-bold text-text-main text-sm truncate mb-1">{item.variant?.product?.name}</p>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-bold bg-bg-muted text-text-sub px-2 py-0.5 rounded border border-border-default uppercase">{item.variant?.color || "Standard"}</span>
                          <span className="text-[11px] text-text-muted">x {item.quantity}</span>
                        </div>
                      </div>
                      <div className="text-right pt-0.5">
                        <p className="font-bold text-brand-500 text-sm">{formatVND(item.price)}</p>
                        {item.variant?.price !== item.price && (
                          <p className="text-[10px] text-text-muted line-through font-medium mt-0.5">{formatVND(item.variant?.price || item.price)}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary Section */}
                <div className="p-5 bg-bg-muted border-t border-border-default">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-text-muted">
                      <span>Tạm tính (giá niêm yết):</span>
                      <span className="font-semibold text-text-sub">{formatVND(order.total_amount)}</span>
                    </div>

                    {order.discount_amount && order.discount_amount > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                           <span className="text-text-muted">Mã giảm giá:</span>
                           <span className="text-[10px] font-black text-brand-500 bg-brand-50 px-2 py-0.5 rounded border border-brand-100 flex items-center gap-1">
                              <Ticket size={10} /> {order.voucher_code}
                           </span>
                        </div>
                        <span className="font-bold text-brand-500">-{formatVND(order.discount_amount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm text-text-muted">
                      <span>Phí vận chuyển:</span>
                      <span className="font-semibold text-status-success-text">+{formatVND(order.shipping_fee)}</span>
                    </div>

                    <div className="pt-4 mt-4 border-t border-dashed border-border-default flex justify-between items-center">
                      <span className="text-sm font-bold text-text-main uppercase">Tổng thanh toán:</span>
                      <span className="text-2xl font-black text-brand-500">{formatVND(order.final_amount)}</span>
                    </div>
                  </div>
                </div>
              </SWTCard>
            </div>
          </div>

          {/* Activity Timeline Section */}
          <SWTCard
            className="!mx-2 !rounded-2xl !border !border-border-default dark:!border-border-brand !shadow-sm"
            bodyClassName="!p-6 !bg-bg-card"
          >
            <h4 className="flex items-center gap-2 text-sm font-bold text-text-main mb-6 uppercase">
              <Clock size={18} className="text-brand-500" /> Lịch sử đơn hàng
            </h4>
            <SWTTimeline
              className="dark:[&_.ant-timeline-item-tail]:!border-border-default [&_.ant-timeline-item-content]:!text-text-muted !mx-2"
              items={order.status_history.map((history) => ({
                dot: (
                  <div className={`p-1.5 rounded-full border shadow-sm bg-bg-card ${getStatusClasses(history.status)}`}>
                    {statusIcons[history.status]}
                  </div>
                ),
                children: (
                  <div className="flex flex-col gap-1 ml-2 pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="text-sm font-bold text-text-sub">{getStatusLabel(history.status, 'order')}</span>
                      <span className="text-[11px] text-text-muted font-medium bg-bg-muted px-2 py-0.5 rounded border border-border-default">
                        {new Date(history.createdAt).toLocaleString("vi-VN", { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                    </div>
                    {history.note && (
                      <p className="text-xs text-text-muted bg-bg-muted p-2.5 rounded-lg border border-border-default mt-1 inline-block">
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