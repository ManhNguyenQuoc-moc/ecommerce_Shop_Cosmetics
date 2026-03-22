"use client";

import SWTTable from "@/src/@core/component/AntD/SWTTable";
import { useState } from "react";
import { Eye } from "lucide-react";

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
        <div className="font-bold text-slate-800 dark:text-white dark:drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">{record.customerName}</div>
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
      let colorClass = "bg-slate-100 text-slate-600 border-slate-200";
      if (status === "Chờ xác nhận") colorClass = "bg-blue-50 text-blue-600 border-blue-100";
      if (status === "Đang xử lý") colorClass = "bg-amber-50 text-amber-600 border-amber-100";
      if (status === "Đang giao") colorClass = "bg-indigo-50 text-indigo-600 border-indigo-100";
      if (status === "Đã giao") colorClass = "bg-green-50 text-green-600 border-green-100";
      if (status === "Đã hủy") colorClass = "bg-red-50 text-red-600 border-red-100";

      return (
        <div className={`text-xs font-semibold px-2.5 py-1 rounded-full border inline-block whitespace-nowrap ${colorClass}`}>
          {status}
        </div>
      );
    }
  },
  {
    title: '',
    key: 'actions',
    render: () => (
      <button className="text-slate-400 hover:text-brand-600 transition-colors p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
        <Eye size={18} />
      </button>
    )
  }
];

export default function OrderTable() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const paginatedData = mockOrders.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="w-full">
      <div className="!bg-white/90 dark:!bg-slate-900/80 backdrop-blur-xl !rounded-xl overflow-hidden !border !border-slate-100 dark:!border-cyan-500/20 !shadow-lg dark:!shadow-[0_0_15px_rgba(0,0,0,0.5)] mt-4 transition-colors">
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
