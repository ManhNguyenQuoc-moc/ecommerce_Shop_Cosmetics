"use client";

import SWTTable from "@/src/@core/component/AntD/SWTTable";
import { Layers, Edit, Eye } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";
import { useVariants } from "@/src/services/admin/product.service";
import EditVariantModal from "./EditVariantModal";

const mockVariants = [
// Biến thể component
];

const columns = [
  {
    title: 'Biến thể',
    dataIndex: 'name',
    key: 'name',
    render: (text: string, record: any) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200 shrink-0 overflow-hidden">
           {record.image ? (
             <img src={record.image} alt={text} className="w-full h-full object-cover" />
           ) : (
             <Layers size={20} className="text-slate-400" />
           )}
        </div>
        <div className="flex flex-col gap-1">
            <div className="font-bold text-slate-800 dark:text-white dark:drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">{record.name}</div>
            <span className="text-brand-500 dark:text-pink-400 font-bold text-xs">{record.category}</span>
          </div>
      </div>
    ),
  },
  {
    title: 'Giá niêm yết (VNĐ)',
    dataIndex: 'price',
    key: 'price',
    render: (price: number) => (
      <div className="font-medium text-sm text-slate-400 line-through decoration-slate-300">
        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
      </div>
    ),
  },
  {
    title: 'Giá khuyến mãi (VNĐ)',
    dataIndex: 'salePrice',
    key: 'salePrice',
    render: (salePrice: number, record: any) => {
      const finalPrice = salePrice || record.price;
      return (
        <div className="font-bold text-sm text-rose-600 dark:text-rose-400">
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(finalPrice)}
        </div>
      );
    },
  },
  {
    title: 'Đã bán',
    dataIndex: 'soldCount',
    key: 'soldCount',
    render: (soldCount: number) => (
      <div className="text-sm font-bold text-sky-600 dark:text-sky-400">
        {soldCount || 0}
      </div>
    ),
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => {
      let finalTitle = "";
      let colorClass = "";
      let dotColor = "";
      
      switch(status) {
        case "BEST_SELLING": 
          finalTitle = "Bán chạy";
          colorClass = "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/40 dark:text-rose-400 dark:border-rose-500/30";
          dotColor = "bg-rose-500";
          break;
        case "TRENDING":
          finalTitle = "Xu hướng";
          colorClass = "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-400 dark:border-blue-500/30";
          dotColor = "bg-blue-500";
          break;
        default:
          finalTitle = "Mới ra mắt";
          colorClass = "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:border-emerald-500/30";
          dotColor = "bg-emerald-500";
          break;
      }
      return (
        <div className={`text-xs font-semibold px-2.5 py-1 rounded-full border flex items-center justify-center gap-1.5 w-max ${colorClass}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
          {finalTitle}
        </div>
      );
    }
  },
  {
    title: 'Thao tác',
    key: 'actions',
    align: 'center' as const,
    render: (_: any, record: any) => (
      <div className="flex items-center gap-2 justify-center">
        <SWTTooltip title="Xem chi tiết" color="#3b82f6">
          <Link href={`/admin/variants/${record.id}`}>
            <button className="text-blue-500 hover:text-blue-700 transition-colors p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 group relative border border-transparent hover:border-blue-100 dark:hover:border-blue-500/20 cursor-pointer">
              <Eye size={18} />
            </button>
          </Link>
        </SWTTooltip>
        <SWTTooltip title="Chỉnh sửa" color="#ec4899">
          <button 
            className="text-brand-600 hover:text-brand-800 transition-colors p-1.5 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-500/10 group relative border border-transparent hover:border-brand-100 dark:hover:border-brand-500/20 cursor-pointer"
            onClick={() => record.onEdit(record)}
          >
            <Edit size={18} />
          </button>
        </SWTTooltip>
      </div>
    )
  }
];

interface VariantTableProps {
  variants: any[];
  total: number;
  isLoading: boolean;
  page: number;
  pageSize: number;
  setPage: (p: number) => void;
  setPageSize: (s: number) => void;
  mutate: () => void;
}

export default function VariantTable({ 
  variants, 
  total, 
  isLoading, 
  page, 
  pageSize, 
  setPage, 
  setPageSize,
  mutate 
}: VariantTableProps) {
  
  const [editingVariant, setEditingVariant] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEdit = (record: any) => {
    setEditingVariant(record);
    setIsEditModalOpen(true);
  };

  const dataSource = variants.map((v: any) => ({
    ...v,
    onEdit: handleEdit
  }));

  return (
    <div className="w-full">
      <div className="!bg-white/90 dark:!bg-slate-900/80 backdrop-blur-xl !rounded-xl overflow-hidden !border !border-slate-100 dark:!border-fuchsia-500/20 !shadow-lg dark:!shadow-[0_0_15px_rgba(0,0,0,0.5)] mt-4 transition-colors">
        <SWTTable 
          columns={columns} 
          dataSource={dataSource} 
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

      <EditVariantModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        variant={editingVariant}
        onUpdate={() => mutate()}
      />
    </div>
  );
}
