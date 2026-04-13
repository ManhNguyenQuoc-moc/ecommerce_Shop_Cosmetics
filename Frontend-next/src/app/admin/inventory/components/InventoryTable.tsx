"use client";

import React, { useMemo } from "react";
import SWTTable from "@/src/@core/component/AntD/SWTTable";
import SWTStatusTag from "@/src/@core/component/SWTStatusTag";
import { Package, Calendar, Clock, AlertTriangle } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useInventoryBatches } from "@/src/hooks/admin/inventory.hook";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";
import Image from "next/image";
import { InventoryQueryParams } from "@/src/services/models/inventory/input.dto";

interface InventoryTableProps {
  isPending?: boolean;
}

export default function InventoryTable({ isPending }: InventoryTableProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = Number(searchParams.get("page") ?? 1);
  const pageSize = Number(searchParams.get("pageSize") ?? 6);

  const filters: InventoryQueryParams = {
    search: searchParams.get("search") || undefined,
    categoryId: searchParams.get("categoryId") || undefined,
    status: (searchParams.get("status") as any) || undefined,
    sortBy: (searchParams.get("sortBy") as any) || undefined,
  };

  const { batches, total, isLoading } = useInventoryBatches(page, pageSize, filters);

  const columns = useMemo(() => [
    {
      title: "Sản phẩm",
      key: "product",
      render: (_: any, record: any) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200 shrink-0 overflow-hidden relative">
            {record.variant.image ? (
              <Image
                src={record.variant.image}
                alt={record.variant.product.name}
                fill
                className="object-cover"
                sizes="40px"
                unoptimized
              />
            ) : (
              <Package size={20} className="text-slate-400" />
            )}
          </div>
          <div className="flex flex-col gap-1">
            <div className="font-bold text-slate-800 dark:text-white leading-tight">
              {record.variant.product.name}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                {record.variant.sku}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {record.variant.color && `${record.variant.color}`}
                {record.variant.size && ` - ${record.variant.size}`}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Số Lô (Batch)",
      dataIndex: "batchNumber",
      key: "batchNumber",
      render: (text: string, record: any) => (
        <div className="flex flex-col gap-1 w-max">
          <div className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-lg border border-blue-100 dark:border-blue-800/50 w-max shadow-sm">
            #{text}
          </div>
          {record.purchaseOrderCode && (
            <div className="text-[10px] text-slate-500 font-medium px-1">
              PO: {record.purchaseOrderCode}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Ngày sản xuất",
      dataIndex: "manufacturingDate",
      key: "manufacturingDate",
      render: (date: string) => (
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 text-xs font-medium">
          <Calendar size={14} className="opacity-70" />
          {date ? new Date(date).toLocaleDateString("vi-VN") : "N/A"}
        </div>
      ),
    },
    {
      title: "Hạn sử dụng",
      dataIndex: "expiryDate",
      key: "expiryDate",
      render: (date: string, record: any) => {
        const isExpired = record.status === 'EXPIRED';
        const isNear = record.status === 'NEAR_EXPIRY';
        return (
          <div className={`flex items-center gap-1.5 text-xs font-bold ${isExpired ? 'text-rose-500' : isNear ? 'text-amber-500' : 'text-emerald-600'}`}>
            <Clock size={14} className="opacity-70" />
            {new Date(date).toLocaleDateString("vi-VN")}
            {isNear && <SWTTooltip title="Sắp hết hạn (<3 tháng)"><AlertTriangle size={14} className="animate-bounce" /></SWTTooltip>}
          </div>
        );
      },
    },
    {
      title: "Tồn kho",
      dataIndex: "quantity",
      key: "quantity",
      render: (qty: number) => (
        <div className="flex flex-col items-center gap-1">
          <div className={`text-sm font-black ${qty === 0 ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-white'}`}>
            {qty}
          </div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const statusConfig: any = {
          GOOD: {
            label: "Tốt",
            color: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:border-emerald-500/30",
            dot: "bg-emerald-500",
          },
          NEAR_EXPIRY: {
            label: "Cận date",
            color: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-400 dark:border-amber-500/30",
            dot: "bg-amber-500",
          },
          EXPIRED: {
            label: "Quá hạn",
            color: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-500 dark:border-red-500/30",
            dot: "bg-red-500",
          },
          OUT_OF_STOCK: {
            label: "Hết hàng",
            color: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700",
            dot: "bg-slate-500",
          },
        };

        const config = statusConfig[status] || statusConfig.GOOD;

        return (
          <SWTStatusTag
            status="CUSTOM"
            label={config.label}
            color={config.color}
            dotColor={config.dot}
          />
        );
      }
    }
  ], []);

  return (
    <div className="w-full">
      <div className="!bg-white/90 dark:!bg-slate-900/80 backdrop-blur-xl !rounded-xl overflow-hidden !border !border-slate-100 dark:!border-blue-500/20 !shadow-lg mt-4 transition-colors">
        <SWTTable
          columns={columns}
          dataSource={batches}
          rowKey="id"
          loading={isLoading || isPending}
          pagination={{
            totalCount: total,
            page,
            fetch: pageSize,
            onChange: (p: number, f: number) => {
              const params = new URLSearchParams(searchParams.toString());
              params.set("page", p.toString());
              params.set("pageSize", f.toString());
              router.replace(`${pathname}?${params.toString()}`);
            },
          }}
        />
      </div>
    </div>
  );
}
