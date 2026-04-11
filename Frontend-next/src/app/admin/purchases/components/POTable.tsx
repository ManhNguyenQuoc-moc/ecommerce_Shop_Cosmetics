"use client";

import SWTTable from "@/src/@core/component/AntD/SWTTable";
import SWTIconButton from "@/src/@core/component/SWTIconButton";
import {
  usePurchaseOrders,
} from "@/src/services/admin/purchase.service";
import { Eye, Edit } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useMemo } from "react";
import { POListItemDto, POStatus, PO_STATUS_LABELS, POPriority, PO_PRIORITY_LABELS } from "@/src/services/models/purchase/output.dto";
import { POQueryParams } from "@/src/services/models/purchase/input.dto";

interface POTableProps {
  isPending?: boolean;
}

export default function POTable({ isPending }: POTableProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = Number(searchParams.get("page") ?? 1);
  const pageSize = Number(searchParams.get("pageSize") ?? 6);

  const filters: POQueryParams = useMemo(() => ({
    search: searchParams.get("search") || undefined,
    status: searchParams.get("status") || undefined,
    brandId: searchParams.get("brandId") || undefined,
    sortBy: (searchParams.get("sortBy") || "newest") as POQueryParams["sortBy"],
  }), [searchParams]);

  const { orders, total, isLoading } = usePurchaseOrders(page, pageSize, filters);

  const renderStatusTag = (status: POStatus) => {
    const colorMap: Record<POStatus, string> = {
      DRAFT: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
      CONFIRMED: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-400 dark:border-blue-800",
      PARTIALLY_RECEIVED: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/40 dark:text-orange-400 dark:border-orange-800",
      COMPLETED: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:border-emerald-800",
      CANCELLED: "bg-red-100 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
    };
    return (
      <div
        className={`text-xs font-bold px-2.5 py-1 rounded-full border flex items-center w-max whitespace-nowrap ${colorMap[status] ?? ""}`}
      >
        {PO_STATUS_LABELS[status] ?? status}
      </div>
    );
  };

  const renderPriorityTag = (priority: POPriority) => {
    const colorMap: Record<POPriority, string> = {
      LOW: "bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700",
      NORMAL: "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50",
      HIGH: "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/50",
    };
    return (
      <div
        className={`text-[10px] uppercase tracking-wider font-black px-2 py-0.5 rounded border flex items-center w-max whitespace-nowrap shadow-sm ${colorMap[priority] ?? ""}`}
      >
        {PO_PRIORITY_LABELS[priority] ?? priority}
      </div>
    );
  };

  const columns = useMemo(() => [
    {
      title: "Mã PO",
      dataIndex: "code",
      key: "code",
      render: (text: string) => (
        <div className="font-bold text-amber-600 dark:text-amber-400 tracking-wide">{text}</div>
      ),
    },
    {
      title: "Thương hiệu",
      dataIndex: "brand",
      key: "brand",
      render: (_: unknown, record: POListItemDto) => (
        <div className="font-semibold text-slate-700 dark:text-slate-300">
          {record.brand?.name ?? "N/A"}
        </div>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount: number) => (
        <div className="font-semibold text-slate-800 dark:text-slate-200">
          {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)}
        </div>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (dateStr: string) => (
        <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {new Date(dateStr).toLocaleDateString("vi-VN")}
        </div>
      ),
    },
    {
      title: "Ưu tiên",
      dataIndex: "priority",
      key: "priority",
      render: (priority: POPriority) => renderPriorityTag(priority),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: POStatus) => renderStatusTag(status),
    },
    {
      title: "Thao tác",
      key: "actions",
      align: "center" as const,
      render: (_: unknown, record: POListItemDto) => (
        <div className="flex items-center gap-2 justify-center">
          <SWTIconButton
            variant="view"
            icon={<Eye size={18} />}
            tooltip="Xem chi tiết"
            onClick={() => router.push(`/admin/purchases/${record.id}`)}
          />
          <SWTIconButton
            variant="edit"
            icon={<Edit size={18} />}
            tooltip="Chỉnh sửa"
            onClick={() => router.push(`/admin/purchases/${record.id}/edit`)}
          />
        </div>
      ),
    },
  ], [router]);

  return (
    <div className="w-full">
      <div className="!bg-white/90 dark:!bg-slate-900/80 backdrop-blur-xl !rounded-xl overflow-hidden !border !border-slate-100 dark:!border-amber-500/20 !shadow-lg mt-4 transition-colors">
        <SWTTable
          columns={columns}
          dataSource={orders}
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
