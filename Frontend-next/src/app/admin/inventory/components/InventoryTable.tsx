"use client";

import SWTTable from "@/src/@core/component/AntD/SWTTable";
import { PackageSearch } from "lucide-react";
import { useState } from "react";
import { useInventoryBatches } from "@/src/services/admin/inventory.service";

export default function InventoryTable() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { batches, total, isLoading } = useInventoryBatches(page, pageSize);

  const columns = [
    {
      title: 'Sản phẩm / Biến thể',
      dataIndex: 'variantInfo',
      key: 'variantInfo',
      render: (text: string) => <div className="font-bold text-slate-700 dark:text-slate-200">{text}</div>,
    },
    {
      title: 'Số Lô (Batch)',
      dataIndex: 'batchNumber',
      key: 'batchNumber',
      render: (text: string) => <div className="font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded w-max">{text}</div>,
    },
    {
      title: 'Tồn kho',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (qty: number) => (
        <div className={`font-bold ${qty > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
          {qty}
        </div>
      ),
    },
    {
      title: 'Hạn sử dụng (EXP)',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      render: (expiry: string) => {
        const isExpiringSoon = new Date(expiry).getTime() - new Date().getTime() < 90 * 24 * 60 * 60 * 1000; 
        return (
          <div className={`font-semibold ${isExpiringSoon ? 'text-orange-500' : 'text-slate-600 dark:text-slate-400'}`}>
            {expiry} {isExpiringSoon && " (Sắp hết hạn)"}
          </div>
        )
      }
    },
    {
      title: 'Ngày nhập kho',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (dateStr: string) => <div>{new Date(dateStr).toLocaleDateString("vi-VN")}</div>
    }
  ];

  return (
    <div className="w-full">
      <div className="!bg-white/90 dark:!bg-slate-900/80 backdrop-blur-xl !rounded-xl overflow-hidden !border !border-slate-100 dark:!border-emerald-500/20 !shadow-lg mt-4 transition-colors">
        <SWTTable 
          columns={columns} 
          dataSource={batches} 
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
