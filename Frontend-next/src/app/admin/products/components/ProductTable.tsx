"use client";

import SWTTable from "@/src/@core/component/AntD/SWTTable";
import { Edit, UserSquare2 } from "lucide-react";
import SWTAvatar from "@/src/@core/component/AntD/SWTAvatar";
import { useState } from "react";

const mockProducts = [
  { id: "SP001", name: "Tinh chất phục hồi Estee Lauder", category: "Chăm sóc da", price: "2.500.000đ", stock: 124, status: "Đang bán", image: "" },
  { id: "SP002", name: "Kem nền MAC Studio Fix", category: "Trang điểm", price: "850.000đ", stock: 0, status: "Hết hàng", image: "" },
  { id: "SP003", name: "Sữa rửa mặt La Roche-Posay", category: "Chăm sóc da", price: "450.000đ", stock: 530, status: "Đang bán", image: "" },
  { id: "SP004", name: "Son môi Dior Rouge", category: "Trang điểm", price: "1.150.000đ", stock: 42, status: "Đang bán", image: "" },
  { id: "SP005", name: "Nước hoa Chanel Coco", category: "Nước hoa", price: "3.800.000đ", stock: 15, status: "Đang bán", image: "" },
  { id: "SP006", name: "Mặt nạ ngủ Laneige", category: "Chăm sóc da", price: "720.000đ", stock: 210, status: "Đang bán", image: "" },
  { id: "SP007", name: "Chì kẻ mắt nước Maybelline", category: "Trang điểm", price: "180.000đ", stock: 85, status: "Đã ẩn", image: "" },
];

const columns = [
  {
    title: 'Sản phẩm',
    dataIndex: 'name',
    key: 'name',
    render: (text: string, record: any) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200 shrink-0">
           {record.image ? (
             <img src={record.image} alt={text} className="w-full h-full object-cover rounded-lg" />
           ) : (
             <UserSquare2 size={20} className="text-slate-400" />
           )}
        </div>
        <div className="flex flex-col gap-1">
            <div className="font-bold text-slate-800 dark:text-white dark:drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">{record.name}</div>
            <span className="text-slate-500 dark:text-slate-400 font-medium text-xs">{record.category}</span>
          </div>
      </div>
    ),
  },
  {
    title: 'Danh mục',
    dataIndex: 'category',
    key: 'category',
    render: (text: string) => <div className="text-slate-600 font-medium text-sm">{text}</div>,
  },
  {
    title: 'Giá bán',
    dataIndex: 'price',
    key: 'price',
    render: (text: string) => <div className="font-bold text-brand-600 text-sm">{text}</div>,
  },
  {
    title: 'Tồn kho',
    dataIndex: 'stock',
    key: 'stock',
    render: (stock: number) => (
      <div className="text-sm font-semibold">
        {stock > 0 ? (
          <span className="text-slate-700">{stock}</span>
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
      const colorClass = status === "Đang bán" ? "bg-green-100 text-green-700 border-green-200" : 
                         status === "Hết hàng" ? "bg-red-50 text-red-600 border-red-100" : 
                         "bg-slate-100 text-slate-600 border-slate-200";
      return (
        <div className={`text-xs font-semibold px-2.5 py-1 rounded-full border inline-block ${colorClass}`}>
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

export default function ProductTable() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const paginatedData = mockProducts.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="w-full">
      <div className="!bg-white/90 dark:!bg-slate-900/80 backdrop-blur-xl !rounded-xl overflow-hidden !border !border-slate-100 dark:!border-fuchsia-500/20 !shadow-lg dark:!shadow-[0_0_15px_rgba(0,0,0,0.5)] mt-4 transition-colors">
        <SWTTable 
          columns={columns} 
          dataSource={paginatedData} 
          rowKey="id" 
          pagination={{
            totalCount: mockProducts.length,
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
