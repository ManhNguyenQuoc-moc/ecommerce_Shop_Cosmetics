"use client";

import SWTTable from "@/src/@core/component/AntD/SWTTable";
import { useState } from "react";
import { Edit } from "lucide-react";

const mockVouchers = [
  { id: "VCH-SUMMER23", name: "Sale Hè Rực Rỡ", type: "Giảm theo %", value: "15%", minOrder: "500.000đ", usage: "124/500", status: "Đang diễn ra", end: "30/08/2023" },
  { id: "VCH-NEWBIE", name: "Mừng Bạn Mới", type: "Giảm cố định", value: "50.000đ", minOrder: "0đ", usage: "3408/∞", status: "Hoạt động", end: "Không giới hạn" },
  { id: "VCH-FREESHIP", name: "Freeship Đơn 300k", type: "Miễn phí vận chuyển", value: "30.000đ", minOrder: "300.000đ", usage: "89/100", status: "Đang diễn ra", end: "15/10/2023" },
  { id: "VCH-FLASH10", name: "Flash Sale Đêm", type: "Giảm theo %", value: "20%", minOrder: "1.000.000đ", usage: "50/50", status: "Hết lượt", end: "10/10/2023" },
  { id: "VCH-VIP", name: "Tri Ân Khách VIP", type: "Đồng giá", value: "Giảm 100k", minOrder: "VIP Tier", usage: "12/100", status: "Chờ kích hoạt", end: "01/12/2023" },
];

const columns = [
  {
    title: 'Mã Voucher',
    dataIndex: 'id',
    key: 'id',
    render: (text: string) => <div className="font-bold text-brand-600 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-md inline-block dark:bg-brand-900/40 dark:border-brand-500/30 text-xs">{text}</div>,
  },
  {
    title: 'Tên Chương trình',
    dataIndex: 'name',
    key: 'name',
    render: (text: string, record: any) => (
      <div className="flex flex-col">
        <div className="font-bold text-slate-800 dark:text-white dark:drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">{text}</div>
        <span className="text-slate-500 dark:text-slate-400 font-medium text-xs">{record.type}</span>
      </div>
    ),
  },
  {
    title: 'Mức giảm',
    dataIndex: 'value',
    key: 'value',
    render: (text: string) => <div className="font-bold text-rose-500 text-sm">{text}</div>,
  },
  {
    title: 'Đơn Tối thiểu',
    dataIndex: 'minOrder',
    key: 'minOrder',
    render: (text: string) => <div className="text-slate-600 font-medium text-sm">{text}</div>,
  },
  {
    title: 'Lượt dùng',
    dataIndex: 'usage',
    key: 'usage',
    render: (text: string) => <div className="text-slate-500 text-sm font-medium">{text}</div>,
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => {
      let colorClass = "bg-slate-100 text-slate-600 border-slate-200";
      if (status === "Đang diễn ra" || status === "Hoạt động") colorClass = "bg-green-100 text-green-700 border-green-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:border-emerald-500/30";
      if (status === "Hết lượt") colorClass = "bg-red-50 text-red-600 border-red-100 dark:bg-red-900/40 dark:text-red-500 dark:border-red-500/30";
      if (status === "Chờ kích hoạt") colorClass = "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/40 dark:text-amber-400 dark:border-amber-500/30";

      return (
        <div className={`text-xs font-semibold px-2.5 py-1 rounded-full border inline-block whitespace-nowrap ${colorClass}`}>
          {status}
        </div>
      );
    }
  },
  {
    title: 'Hạn dùng',
    dataIndex: 'end',
    key: 'end',
    render: (text: string) => <div className="text-slate-500 text-xs whitespace-nowrap">{text}</div>,
  },
  {
    title: '',
    key: 'actions',
    render: () => (
      <button className="text-slate-400 hover:text-brand-600 transition-colors p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
        <Edit size={18} />
      </button>
    )
  }
];

export default function VoucherTable() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const paginatedData = mockVouchers.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="w-full mt-2">
      <div className="!bg-white/90 dark:!bg-slate-900/80 backdrop-blur-xl !rounded-xl overflow-hidden !border !border-slate-100 dark:!border-fuchsia-500/20 !shadow-sm transition-colors">
        <SWTTable 
          columns={columns} 
          dataSource={paginatedData} 
          rowKey="id" 
          pagination={{
            totalCount: mockVouchers.length,
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
