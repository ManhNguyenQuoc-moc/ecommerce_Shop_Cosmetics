"use client";

import SWTTable from "@/src/@core/component/AntD/SWTTable";
import { ArrowRightLeft } from "lucide-react";
import { useState } from "react";

const mockInventory = [
  { id: "INV-SP001", name: "Tinh chất phục hồi", variant: "50ml", sku: "ESL-PH50", currentStock: 124, reserved: 10, totalExpected: 150, status: "Tốt" },
  { id: "INV-SP002", name: "Tinh chất phục hồi", variant: "30ml", sku: "ESL-PH30", currentStock: 0, reserved: 0, totalExpected: 50, status: "Hết hàng" },
  { id: "INV-SP003", name: "Sữa rửa mặt La Roche", variant: "400ml - Gel", sku: "LRP-G400", currentStock: 530, reserved: 45, totalExpected: 800, status: "Tốt" },
  { id: "INV-SP004", name: "Đệm nước cấp ẩm", variant: "Tone 21", sku: "CSR-T21", currentStock: 15, reserved: 5, totalExpected: 200, status: "Sắp hết" },
  { id: "INV-SP005", name: "Son kem lì", variant: "Đỏ Đất 04", sku: "MAC-L04", currentStock: 42, reserved: 12, totalExpected: 100, status: "Bình thường" },
];

const columns = [
  {
    title: 'SKU',
    dataIndex: 'sku',
    key: 'sku',
    render: (text: string) => <div className="font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md inline-block dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 text-xs">{text}</div>,
  },
  {
    title: 'Sản phẩm & Biến thể',
    dataIndex: 'name',
    key: 'name',
    render: (text: string, record: any) => (
      <div className="flex flex-col">
        <div className="font-bold text-slate-800 dark:text-white dark:drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">{text}</div>
        <span className="text-brand-500 font-medium text-xs border border-brand-200 bg-brand-50 px-1 py-0.5 rounded mt-0.5 w-max dark:border-brand-500/30 dark:bg-brand-900/20">{record.variant}</span>
      </div>
    ),
  },
  {
    title: 'Tồn Kho Bán Được',
    dataIndex: 'currentStock',
    key: 'currentStock',
    render: (stock: number) => (
      <div className="text-sm font-semibold">
        {stock > 0 ? (
          <span className="text-slate-700 dark:text-slate-300">{stock}</span>
        ) : (
          <span className="text-red-500">0</span>
        )}
      </div>
    ),
  },
  {
    title: 'Đang Giao Dịch',
    dataIndex: 'reserved',
    key: 'reserved',
    render: (text: string) => <div className="text-amber-600 font-medium text-sm">{text}</div>,
  },
  {
    title: 'Dự Kiến Bổ Sung',
    dataIndex: 'totalExpected',
    key: 'totalExpected',
    render: (text: string) => <div className="text-slate-400 font-medium text-sm">{text}</div>,
  },
  {
    title: 'Trạng Thái',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => {
      let colorClass = "bg-slate-100 text-slate-600 border-slate-200";
      if (status === "Tốt" || status === "Bình thường") colorClass = "bg-green-100 text-green-700 border-green-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:border-emerald-500/30";
      if (status === "Hết hàng") colorClass = "bg-red-50 text-red-600 border-red-100 dark:bg-red-900/40 dark:text-red-500 dark:border-red-500/30";
      if (status === "Sắp hết") colorClass = "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/40 dark:text-amber-400 dark:border-amber-500/30";

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
        <ArrowRightLeft size={18} />
      </button>
    )
  }
];

export default function InventoryTable() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const paginatedData = mockInventory.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="w-full mt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-800 dark:text-white text-lg">Chi tiết Tồn kho (Theo SKU)</h3>
      </div>
      <div className="!bg-white/90 dark:!bg-slate-900/80 backdrop-blur-xl !rounded-xl overflow-hidden !border !border-slate-100 dark:!border-fuchsia-500/20 !shadow-sm transition-colors">
        <SWTTable 
          columns={columns} 
          dataSource={paginatedData} 
          rowKey="id" 
          pagination={{
            totalCount: mockInventory.length,
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
