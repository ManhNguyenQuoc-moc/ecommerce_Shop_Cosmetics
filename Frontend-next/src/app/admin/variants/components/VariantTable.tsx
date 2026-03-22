"use client";

import SWTTable from "@/src/@core/component/AntD/SWTTable";
import { Layers, Edit } from "lucide-react";
import { useState } from "react";

const mockVariants = [
  { id: "VAR-001", name: "Tinh chất phục hồi", attribute: "Fullsize 50ml", price: "+0đ", stock: 124, status: "Đang bán", image: "" },
  { id: "VAR-002", name: "Tinh chất phục hồi", attribute: "Minisize 15ml", price: "-1.500.000đ", stock: 50, status: "Đang bán", image: "" },
  { id: "VAR-003", name: "Son môi Dior Rouge", attribute: "Màu 999 Đỏ Tươi", price: "+0đ", stock: 12, status: "Đang bán", image: "" },
  { id: "VAR-004", name: "Son môi Dior Rouge", attribute: "Màu 100 Nude", price: "+0đ", stock: 0, status: "Hết hàng", image: "" },
  { id: "VAR-005", name: "Nước hoa Chanel", attribute: "100ml EdP", price: "+1.200.000đ", stock: 5, status: "Đang bán", image: "" },
  { id: "VAR-006", name: "Nước hoa Chanel", attribute: "50ml EdP", price: "+0đ", stock: 15, status: "Đang bán", image: "" },
];

const columns = [
  {
    title: 'Biến thể',
    dataIndex: 'name',
    key: 'name',
    render: (text: string, record: any) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200 shrink-0">
           {record.image ? (
             <img src={record.image} alt={text} className="w-full h-full object-cover rounded-lg" />
           ) : (
             <Layers size={20} className="text-slate-400" />
           )}
        </div>
        <div className="flex flex-col gap-1">
            <div className="font-bold text-slate-800 dark:text-white dark:drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">{record.name}</div>
            <span className="text-brand-500 dark:text-pink-400 font-bold text-xs">{record.attribute}</span>
          </div>
      </div>
    ),
  },
  {
    title: 'Giá cộng thêm',
    dataIndex: 'price',
    key: 'price',
    render: (text: string) => {
      const isNegative = text.startsWith('-');
      return <div className={`font-bold text-sm ${isNegative ? 'text-red-500' : 'text-slate-600 dark:text-cyan-400'}`}>{text}</div>
    },
  },
  {
    title: 'Tồn kho',
    dataIndex: 'stock',
    key: 'stock',
    render: (stock: number) => (
      <div className="text-sm font-semibold">
        {stock > 0 ? (
          <span className="text-emerald-600 dark:text-emerald-400">{stock}</span>
        ) : (
          <span className="text-red-500">0</span>
        )}
      </div>
    ),
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => {
      const colorClass = status === "Đang bán" 
        ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:border-emerald-500/30 dark:shadow-[0_0_8px_rgba(16,185,129,0.2)]" 
        : "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-500 dark:border-red-500/30 dark:shadow-[0_0_8px_rgba(239,68,68,0.2)]";
      return (
        <div className={`text-xs font-semibold px-2.5 py-1 rounded-full border flex items-center justify-center gap-1.5 w-max ${colorClass}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status === "Đang bán" ? "bg-emerald-500 dark:bg-emerald-400 dark:shadow-[0_0_5px_#34d399]" : "bg-red-500 dark:shadow-[0_0_5px_#ef4444]"}`} />
          {status}
        </div>
      );
    }
  },
  {
    title: '',
    key: 'actions',
    render: () => (
      <button className="text-brand-600 hover:text-brand-800 transition-colors p-1.5 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-500/10">
        <Edit size={18} />
      </button>
    )
  }
];

export default function VariantTable() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const paginatedData = mockVariants.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="w-full">
      <div className="!bg-white/90 dark:!bg-slate-900/80 backdrop-blur-xl !rounded-xl overflow-hidden !border !border-slate-100 dark:!border-fuchsia-500/20 !shadow-lg dark:!shadow-[0_0_15px_rgba(0,0,0,0.5)] mt-4 transition-colors">
        <SWTTable 
          columns={columns} 
          dataSource={paginatedData} 
          rowKey="id" 
          pagination={{
            totalCount: mockVariants.length,
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
