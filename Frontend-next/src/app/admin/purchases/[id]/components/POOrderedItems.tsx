"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { FileSpreadsheet, FileText, Layers, Search } from "lucide-react";
import { PODetailDto } from "@/src/services/models/purchase/output.dto";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import SWTTable from "@/src/@core/component/AntD/SWTTable";
import { usePurchaseOrderItems } from "@/src/services/admin/iventory/purchase.hook";
import { useDebounce } from "@/src/@core/hooks/useDebounce";
import { SWTInputSearch } from "@/src/@core/component/AntD/SWTInput";

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
  const debouncedSearch = useDebounce(search, 500);

  const { items, total, isLoading } = usePurchaseOrderItems(po.id, page, pageSize, debouncedSearch);

  const filteredItems = useMemo(() => items, [items]);

  // Reset to first page when search changes
  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  return (
    <div className="admin-card-form p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="admin-section-heading font-bold flex items-center gap-2 text-sm uppercase tracking-wider">
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

      {/* Search bar — Redesigned for consistency */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 px-2 mb-2">
        <div className="flex-1 w-full max-w-2xl">
          <SWTInputSearch
            placeholder="Tìm theo tên sản phẩm, mã SKU, màu sắc..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            className="w-full !h-11 !rounded-2xl shadow-sm"
          />
        </div>
      </div>

      <div className="admin-table-wrap p-4">
        <SWTTable
          rowKey="id"
          dataSource={filteredItems}
          loading={isLoading}
          pagination={{
            page: page,
            fetch: pageSize,
            totalCount: total,
            onChange: (p: number, f: number) => {
              setPage(p);
              if (f && f !== pageSize) setPageSize(f);
            }
          }}
          className="dark:[&_.ant-table]:!bg-transparent dark:[&_.ant-table-tbody_tr:hover_td]:!bg-brand-500/5 [&_.ant-table-thead_th]:!py-3 [&_.ant-table-tbody_td]:!py-2"
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
                  <div className="admin-image-placeholder w-9 h-9 rounded-lg flex items-center justify-center shrink-0 overflow-hidden relative">
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
                      <Layers size={16} className="text-text-muted" />
                    )}
                  </div>
                  <div className="admin-section-heading font-medium truncate">
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
                return <div className="admin-text-sub">{variantName}</div>;
              }
            },
            {
              title: "SKU",
              key: "sku",
              width: COLUMN_WIDTH.sku,
              ellipsis: true, // Cắt chữ cho mã SKU dài
              render: (_: any, record: any) => (
                <div className="truncate admin-text-sub" title={record.variant?.sku}>
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
              render: (qty: number) => <div className="admin-section-heading font-medium">{qty}</div>
            },
            {
              title: "Giá nhập",
              key: "price",
              width: COLUMN_WIDTH.price,
              align: 'right' as const,
              render: (_: any, record: any) => (
                <div className="text-right admin-section-heading font-medium">
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
          <div className="flex justify-end pt-4 mt-2 border-t" style={{ borderColor: 'var(--admin-field-border)' }}>
            <div className="text-right">
              <div className="admin-text-muted text-sm mb-1 uppercase font-medium">Tổng cộng hóa đơn:</div>
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