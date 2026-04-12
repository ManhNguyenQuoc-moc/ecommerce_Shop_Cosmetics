"use client";

import SWTTable from "@/src/@core/component/AntD/SWTTable";
import { Eye } from "lucide-react";
import SWTIconButton from "@/src/@core/component/SWTIconButton";
import SWTStatusTag from "@/src/@core/component/SWTStatusTag";
import { OrderDto, OrderStatus } from "@/src/services/models/order/output.dto";
import React, { useMemo } from "react";

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

  const columns = useMemo(() => [
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
          <div className="font-bold text-text-main leading-tight">{record.customer_name}</div>
          <div className="text-text-muted text-[10px] mt-0.5 font-bold uppercase tracking-widest">{record.customer_phone}</div>
        </div>
      ),
    },
    {
      title: 'Số SP',
      key: 'items_count',
      align: 'center' as const,
      render: (_: any, record: OrderDto) => (
          <div className="text-text-sub font-black bg-bg-muted w-8 h-8 rounded-lg flex items-center justify-center mx-auto text-xs border border-border-default shadow-inner">
              {record.items?.length || 0}
          </div>
      ),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total_amount',
      key: 'total',
      render: (amount: number) => <div className="font-black text-text-main text-sm">{formatVND(amount)}</div>,
    },
    {
      title: 'Thanh toán',
      key: 'payment',
      render: (_: any, record: OrderDto) => (
          <div className="flex flex-col">
              <span className="text-text-sub text-xs font-bold uppercase tracking-tight">{record.payment_method}</span>
              <span className={`text-[10px] font-black ${record.payment_status === 'PAID' ? 'text-status-success-text' : 'text-status-warning-text'} uppercase`}>
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
              <span className="text-text-sub text-xs font-medium">{new Date(date).toLocaleDateString("vi-VN")}</span>
              <span className="text-text-muted text-[10px] uppercase font-bold tracking-tighter">{new Date(date).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'current_status',
      key: 'status',
      render: (status: OrderStatus) => <SWTStatusTag status={status} />
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
  ], [onView]);

  return (
    <div className="w-full">
      <div className="bg-bg-card backdrop-blur-md rounded-2xl overflow-hidden border border-border-default dark:border-border-brand shadow-sm mt-4 transition-colors">
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
