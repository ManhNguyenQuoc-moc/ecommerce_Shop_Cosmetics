"use client";

import SWTTable from "@/src/@core/component/AntD/SWTTable";
import { Edit, UserSquare2, Eye } from "lucide-react";
import SWTAvatar from "@/src/@core/component/AntD/SWTAvatar";
import { useState } from "react";
import { Tooltip } from "antd";

import { useProducts } from "@/src/services/admin/product.service";

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
    dataIndex: 'priceRange',
    key: 'priceRange',
    width: 220,
    render: (text: string) => <div className="font-bold text-brand-600 text-sm whitespace-nowrap">{text || 'Liên hệ'}</div>,
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
      let colorClass = "!bg-slate-100 !text-slate-700 !border-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700 dark:shadow-[0_0_8px_rgba(148,163,184,0.2)]";
      let dotClass = "!bg-slate-500 dark:!bg-slate-400 dark:!shadow-[0_0_5px_#94a3b8]";

      if (status === "Đang bán") {
        colorClass = "bg-emerald-100 !text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:border-emerald-500/30 dark:shadow-[0_0_8px_rgba(16,185,129,0.2)]";
        dotClass = "bg-emerald-500 dark:!bg-emerald-400 dark:shadow-[0_0_5px_#34d399]";
      } else if (status === "Hết hàng") {
        colorClass = "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-500 dark:border-red-500/30 dark:shadow-[0_0_8px_rgba(239,68,68,0.2)]";
        dotClass = "bg-red-500 dark:bg-red-400 dark:shadow-[0_0_5px_#ef4444]";
      }
      return (
        <div className={`text-xs font-semibold px-2.5 py-1 rounded-full border flex items-center justify-center gap-1.5 w-max ${colorClass}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
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
      <div className="flex items-center gap-2 justify-center">
        <Tooltip title="Xem chi tiết" color="#3b82f6">
          <button className="text-blue-500 hover:text-blue-700 transition-colors p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 group relative border border-transparent hover:border-blue-100 dark:hover:border-blue-500/20 cursor-pointer">
            <Eye size={18} />
          </button>
        </Tooltip>
        <Tooltip title="Chỉnh sửa" color="#ec4899">
          <button className="text-brand-600 hover:text-brand-800 transition-colors p-1.5 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-500/10 group relative border border-transparent hover:border-brand-100 dark:hover:border-brand-500/20 cursor-pointer">
            <Edit size={18} />
          </button>
        </Tooltip>
      </div>
    )
  }
];

export default function ProductTable() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const { products, total, isLoading } = useProducts(page, pageSize);

  return (
    <div className="w-full">
      <div className="!bg-white/90 dark:!bg-slate-900/80 backdrop-blur-xl !rounded-xl overflow-hidden !border !border-slate-100 dark:!border-fuchsia-500/20 !shadow-lg dark:!shadow-[0_0_15px_rgba(0,0,0,0.5)] mt-4 transition-colors">
        <SWTTable
          columns={columns}
          dataSource={products}
          rowKey="id"
          loading={isLoading}
          pagination={{
            totalCount: total,
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
