"use client";

import SWTTable from "@/src/@core/component/AntD/SWTTable";
import { Eye } from "lucide-react";
import SWTIconButton from "@/src/@core/component/SWTIconButton";
import { OrderDto, OrderStatus } from "@/src/services/models/order/output.dto";

interface OrderTableProps {
  orders: OrderDto[];
  total: number;
  isLoading: boolean;
  page: number;
  pageSize: number;
  onPaginationChange: (page: number, pageSize: number) => void;
  onView: (order: OrderDto) => void;
}

const statusLabels: Record<OrderStatus, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  SHIPPING: "Đang giao hàng",
  DELIVERED: "Đã giao hàng",
  CANCELLED: "Đã hủy",
  RETURNED: "Trả hàng",
};

export default function OrderTable({ orders, total, isLoading, page, pageSize, onPaginationChange, onView }: OrderTableProps) {
  
  const formatVND = (v: number) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v || 0);

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'code',
      key: 'code',
      render: (text: string, record: OrderDto) => (
        <div 
            className="font-black text-brand-600 cursor-pointer hover:underline text-sm uppercase tracking-tighter"
            onClick={() => onView(record)}
        >
            #{text}
        </div>
      ),
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customer_name',
      key: 'customer',
      render: (text: string, record: OrderDto) => (
        <div className="flex flex-col">
          <div className="font-bold text-slate-800 dark:text-white leading-tight">{record.customer_name}</div>
          <div className="text-slate-400 text-[10px] mt-0.5 font-bold uppercase tracking-widest">{record.customer_phone}</div>
        </div>
      ),
    },
    {
      title: 'Số SP',
      key: 'items_count',
      align: 'center' as const,
      render: (_: any, record: OrderDto) => (
          <div className="text-slate-600 dark:text-slate-300 font-black bg-slate-100 dark:bg-slate-800 w-8 h-8 rounded-lg flex items-center justify-center mx-auto text-xs border border-slate-200 dark:border-slate-700 shadow-inner">
              {record.items?.length || 0}
          </div>
      ),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total_amount',
      key: 'total',
      render: (amount: number) => <div className="font-black text-slate-800 dark:text-white text-sm">{formatVND(amount)}</div>,
    },
    {
      title: 'Thanh toán',
      key: 'payment',
      render: (_: any, record: OrderDto) => (
          <div className="flex flex-col">
              <span className="text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-tight">{record.payment_method}</span>
              <span className={`text-[10px] font-black ${record.payment_status === 'PAID' ? 'text-emerald-500' : 'text-amber-500'} uppercase`}>
                  {record.payment_status === 'PAID' ? 'Đã trả' : 'Chưa trả'}
              </span>
          </div>
      ),
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'date',
      render: (date: string) => (
          <div className="flex flex-col">
              <span className="text-slate-600 dark:text-slate-300 text-xs font-medium">{new Date(date).toLocaleDateString("vi-VN")}</span>
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-tighter">{new Date(date).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'current_status',
      key: 'status',
      render: (status: OrderStatus) => {
        let colorClass = "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700";
        let dotClass = "bg-slate-400";
  
        if (status === "PENDING") {
          colorClass = "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20";
          dotClass = "bg-blue-500";
        } else if (status === "CONFIRMED") {
          colorClass = "bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20";
          dotClass = "bg-orange-500";
        } else if (status === "SHIPPING") {
          colorClass = "bg-cyan-50 text-cyan-600 border-cyan-100 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/20";
          dotClass = "bg-cyan-500";
        } else if (status === "DELIVERED") {
          colorClass = "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20";
          dotClass = "bg-emerald-500";
        } else if (status === "CANCELLED") {
          colorClass = "bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20";
          dotClass = "bg-red-500";
        }
  
        return (
          <div className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border flex items-center justify-center gap-1.5 w-max whitespace-nowrap shadow-sm ${colorClass}`}>
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 shadow-[0_0_5px_rgba(0,0,0,0.1)] ${dotClass}`} />
            {statusLabels[status]}
          </div>
        );
      }
    },
    {
      title: 'Thao tác',
      key: 'actions',
      align: 'center' as const,
      render: (_: any, record: OrderDto) => (
        <div className="flex justify-center">
          <SWTIconButton 
            variant="view"
            icon={<Eye size={18} />}
            tooltip="Xem chi tiết"
            onClick={() => onView(record)}
          />
        </div>
      )
    }
  ];

  return (
    <div className="w-full">
      <div className="bg-white/80 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm mt-4 transition-colors">
        <SWTTable 
          columns={columns} 
          dataSource={orders} 
          rowKey="id" 
          loading={isLoading}
          className="min-w-[800px]" 
          pagination={{
            totalCount: total,
            page: page,
            fetch: pageSize,
            onChange: onPaginationChange
          }}
        />
      </div>
    </div>
  );
}
