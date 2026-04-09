"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { FileSpreadsheet, FileText, Layers, Search } from "lucide-react";
import { PODetailDto } from "@/src/services/models/purchase/output.dto";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import SWTTable from "@/src/@core/component/AntD/SWTTable";
import { SWTInput } from "@/src/@core/component/AntD/SWTInput";
import { usePurchaseOrderItems } from "@/src/services/admin/purchase.service";

const COLUMN_WIDTH = {
  variant: 160,
  sku: 140,
  qty: 120,
  price: 130,
};

interface POOrderedItemsProps {
  po: PODetailDto;
  onExport: (type: "pdf" | "excel", includeReceipt: boolean) => void;
}

const POOrderedItems: React.FC<POOrderedItemsProps> = ({ po, onExport }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [search, setSearch] = useState("");
  const { items, total, isLoading } = usePurchaseOrderItems(po.id, page, pageSize);

  const filteredItems = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter((item: any) => {
      const name = item.variant?.product?.name?.toLowerCase() ?? "";
      const variant = [item.variant?.color, item.variant?.size].join(" ").toLowerCase();
      const sku = item.variant?.sku?.toLowerCase() ?? "";
      return name.includes(q) || variant.includes(q) || sku.includes(q);
    });
  }, [items, search]);

  return (
    <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-pink-500/20 flex flex-col gap-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 text-sm uppercase tracking-wider">
          1. Thông tin đặt hàng (Phiếu Nhập)
        </h3>
        <div className="flex gap-2.5">
          <SWTButton
            icon={<FileText size={18} />}
            onClick={() => onExport("pdf", false)}
            className="!bg-red-500/10 !border-red-500/20 !text-red-600 dark:!text-red-400 !rounded-xl font-bold !h-10 pl-4 pr-5 hover:!bg-red-500/20 transition-all border shadow-sm"
          >
            PDF
          </SWTButton>
          <SWTButton
            icon={<FileSpreadsheet size={18} />}
            onClick={() => onExport("excel", false)}
            className="!bg-emerald-500/10 !border-emerald-500/20 !text-emerald-600 dark:!text-emerald-400 !rounded-xl font-bold !h-10 pl-4 pr-5 hover:!bg-emerald-500/20 transition-all border shadow-sm"
          >
            Excel
          </SWTButton>
        </div>
      </div>

      {/* Search bar */}
      <div className="px-1">
        <SWTInput
          prefix={<Search size={14} className="text-slate-400" />}
          placeholder="Tìm theo tên sản phẩm, biến thể, SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          className="!rounded-xl !h-9 !bg-slate-50 dark:!bg-slate-800/50 !border-slate-200 dark:!border-slate-700 max-w-sm text-sm"
        />
      </div>

      <div className="border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-4">
        <SWTTable
          rowKey="id"
          dataSource={filteredItems}
          loading={isLoading}
         pagination={{
            page: page,
            fetch: pageSize,
            totalCount: search.trim() ? filteredItems.length : total,
            onChange: (p: number, f: number) => {
              setPage(p);
              if (f && f !== pageSize) setPageSize(f);
            }
          }}
          className="dark:[&_.ant-table]:!bg-transparent dark:[&_.ant-table-thead_th]:!bg-slate-800/80 dark:[&_.ant-table-tbody_tr:hover_td]:!bg-brand-500/5 [&_.ant-table-thead_th]:!py-3 [&_.ant-table-tbody_td]:!py-2"
          columns={[
            {
              title: "Sản phẩm",
              key: "product",
              ellipsis: true, // Cắt chữ
              render: (_: any, record: any) => (
                <div 
                  className="flex items-center gap-3 overflow-hidden"
                  title={record.variant?.product?.name} // Hover hiển thị full tên
                >
                  <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 shrink-0 overflow-hidden relative">
                    {record.variant?.image ? (
                      <Image
                        src={record.variant.image}
                        alt={record.variant?.product?.name || "Product"}
                        fill
                        className="object-cover"
                        sizes="36px"
                        unoptimized
                      />
                    ) : (
                      <Layers size={16} className="text-slate-400" />
                    )}
                  </div>
                  <div className="font-medium text-slate-700 dark:text-slate-200 truncate">
                    {record.variant?.product?.name}
                  </div>
                </div>
              )
            },
            {
              title: "Biến thể",
              key: "variant",
              width: COLUMN_WIDTH.variant,
              render: (_: any, record: any) => {
                const variantName = [record.variant?.color, record.variant?.size].filter(Boolean).join(" - ") || "Tiêu chuẩn";
                return <div className="text-slate-600 dark:text-slate-400">{variantName}</div>;
              }
            },
            {
              title: "SKU",
              key: "sku",
              width: COLUMN_WIDTH.sku,
              ellipsis: true, // Cắt chữ cho mã SKU dài
              render: (_: any, record: any) => (
                <div className="truncate text-slate-600 dark:text-slate-400" title={record.variant?.sku}>
                  {record.variant?.sku || "-"}
                </div>
              )
            },
            {
              title: "Số lượng",
              dataIndex: "orderedQty",
              key: "qty",
              width: COLUMN_WIDTH.qty,
              align: 'right' as const,
              render: (qty: number) => <div className="text-slate-700 dark:text-slate-300 font-medium">{qty}</div>
            },
            {
              title: "Giá nhập",
              key: "price",
              width: COLUMN_WIDTH.price,
              align: 'right' as const,
              render: (_: any, record: any) => (
                <div className="text-right text-slate-700 dark:text-slate-200 font-medium">
                  {new Intl.NumberFormat("vi-VN").format(record.costPrice)}
                </div>
              )
            },
            {
              title: "Thành tiền",
              key: "total",
              width: COLUMN_WIDTH.price,
              align: 'right' as const,
              render: (_: any, record: any) => (
                <div className="font-semibold text-brand-600 dark:text-brand-400">
                  {new Intl.NumberFormat("vi-VN").format(record.orderedQty * record.costPrice)}
                </div>
              )
            }
          ]}
        />

        {/* Tổng hóa đơn — dùng po.totalAmount từ backend (toàn bộ, không phân trang) */}
        {po.totalAmount > 0 && (
          <div className="flex justify-end pt-4 mt-2 border-t border-slate-200 dark:border-slate-700">
            <div className="text-right">
              <div className="text-slate-500 text-sm mb-1 uppercase font-medium">Tổng cộng hóa đơn:</div>
              <div className="text-2xl font-black text-brand-600 dark:text-brand-400">
                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(po.totalAmount)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default POOrderedItems;