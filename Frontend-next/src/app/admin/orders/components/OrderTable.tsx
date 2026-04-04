"use client";

import SWTTable from "@/src/@core/component/AntD/SWTTable";
import { useState } from "react";
import { Eye } from "lucide-react";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";
import SWTIconButton from "@/src/@core/component/SWTIconButton";

const mockOrders = [
  { id: "ORD-9281", customer: "Nguyễn Văn A", phone: "0901234567", items: 3, total: "2.150.000đ", date: "22/10/2023 14:30", status: "Chờ xác nhận", payment: "COD" },
  { id: "ORD-9280", customer: "Trần Thị B", phone: "0912345678", items: 1, total: "850.000đ", date: "22/10/2023 10:15", status: "Đang xử lý", payment: "VNPay" },
  { id: "ORD-9279", customer: "Lê Văn C", phone: "0987654321", items: 5, total: "4.500.000đ", date: "21/10/2023 16:45", status: "Đang giao", payment: "Bank Transfer" },
  { id: "ORD-9278", customer: "Phạm Thị D", phone: "0934567890", items: 2, total: "1.200.000đ", date: "21/10/2023 09:20", status: "Đã giao", payment: "Momo" },
  { id: "ORD-9277", customer: "Hoàng Văn E", phone: "0976543210", items: 1, total: "350.000đ", date: "20/10/2023 18:00", status: "Đã hủy", payment: "COD" },
];

const columns = [
  {
    title: 'Mã đơn hàng',
    dataIndex: 'id',
    key: 'id',
    render: (text: string) => <div className="font-bold text-brand-600 cursor-pointer hover:underline text-sm">{text}</div>,
  },
  {
    title: 'Khách hàng',
    dataIndex: 'customer',
    key: 'customer',
    render: (text: string, record: any) => (
      <div className="flex flex-col">
        <div className="font-bold text-slate-800 dark:text-white">{record.customerName}</div>
        <div className="text-slate-500 text-xs mt-0.5">{record.phone}</div>
      </div>
    ),
  },
  {
    title: 'Số SP',
    dataIndex: 'items',
    key: 'items',
    render: (items: number) => <div className="text-slate-600 font-medium text-center">{items}</div>,
  },
  {
    title: 'Tổng tiền',
    dataIndex: 'total',
    key: 'total',
    render: (text: string) => <div className="font-bold text-slate-800 text-sm">{text}</div>,
  },
  {
    title: 'Thanh toán',
    dataIndex: 'payment',
    key: 'payment',
    render: (text: string) => <div className="text-slate-500 text-sm">{text}</div>,
  },
  {
    title: 'Thời gian đặt',
    dataIndex: 'date',
    key: 'date',
    render: (text: string) => <div className="text-slate-500 text-sm whitespace-nowrap">{text}</div>,
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => {
      let colorClass = "!bg-slate-100 !text-slate-700 !border-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700 dark:shadow-[0_0_8px_rgba(148,163,184,0.2)]";
      let dotClass = "!bg-slate-500 dark:!bg-slate-400 dark:!shadow-[0_0_5px_#94a3b8]";

      if (status === "Chờ xác nhận") {
        colorClass = "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-400 dark:border-blue-500/30 dark:shadow-[0_0_8px_rgba(59,130,246,0.2)]";
        dotClass = "bg-blue-500 dark:bg-blue-400 dark:shadow-[0_0_5px_#3b82f6]";
      } else if (status === "Đang xử lý") {
        colorClass = "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-400 dark:border-amber-500/30 dark:shadow-[0_0_8px_rgba(245,158,11,0.2)]";
        dotClass = "bg-amber-500 dark:bg-amber-400 dark:shadow-[0_0_5px_#f59e0b]";
      } else if (status === "Đang giao") {
        colorClass = "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-400 dark:border-indigo-500/30 dark:shadow-[0_0_8px_rgba(99,102,241,0.2)]";
        dotClass = "bg-indigo-500 dark:bg-indigo-400 dark:shadow-[0_0_5px_#6366f1]";
      } else if (status === "Đã giao") {
        colorClass = "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:border-emerald-500/30 dark:shadow-[0_0_8px_rgba(16,185,129,0.2)]";
        dotClass = "bg-emerald-500 dark:bg-emerald-400 dark:shadow-[0_0_5px_#34d399]";
      } else if (status === "Đã hủy") {
        colorClass = "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-500 dark:border-red-500/30 dark:shadow-[0_0_8px_rgba(239,68,68,0.2)]";
        dotClass = "bg-red-500 dark:bg-red-400 dark:shadow-[0_0_5px_#ef4444]";
      }

      return (
        <div className={`text-xs font-semibold px-2.5 py-1 rounded-full border flex items-center justify-center gap-1.5 w-max whitespace-nowrap ${colorClass}`}>
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClass}`} />
          {status}
        </div>
      );
    }
  },
  {
    title: 'Thao tác',
    key: 'actions',
    align: 'center' as const,
    render: () => (
      <div className="flex justify-center">
        <SWTIconButton 
          variant="view"
          icon={<Eye size={18} />}
          tooltip="Xem chi tiết"
          href="#"
        />
      </div>
    )
  }
];

export default function OrderTable() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const paginatedData = mockOrders.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="w-full">
      <div className="bg-white/80 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl overflow-hidden border border-slate-200 dark:border-admin-sidebar-border shadow-sm mt-4 transition-colors">
        <SWTTable 
          columns={columns} 
          dataSource={paginatedData} 
          rowKey="id" 
          className="min-w-[800px]" 
          pagination={{
            totalCount: mockOrders.length,
            page: page,
            fetch: pageSize,
            onChange: (p: number, f: number) => {
              setPage(p);
              setPageSize(f);
            }
          }}
        />
      </div>
    </div>
  );
}
