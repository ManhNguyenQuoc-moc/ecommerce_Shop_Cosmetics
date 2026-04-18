"use client";

import SWTTable from "@/src/@core/component/AntD/SWTTable";
import SWTIconButton from "@/src/@core/component/SWTIconButton";
import {
  usePurchaseOrders,
} from "@/src/services/admin/iventory/purchase.hook";
import { Eye, Edit, MoreVertical } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useMemo } from "react";
import { POListItemDto, POStatusType, PO_STATUS_LABELS, POPriorityType, PO_PRIORITY_LABELS } from "@/src/services/models/purchase/output.dto";
import { POQueryParams } from "@/src/services/models/purchase/input.dto";
import { Dropdown } from "antd";
import type { MenuProps } from "antd";

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

  const renderStatusTag = (status: POStatusType | "CANCELLED") => {
    const colorMap: Record<POStatusType | "CANCELLED", string> = {
      DRAFT: "bg-bg-muted text-text-muted border-border-default",
      CONFIRMED: "bg-status-info-bg/10 text-status-info-text border-status-info-border",
      PARTIALLY_RECEIVED: "bg-status-warning-bg/10 text-status-warning-text border-status-warning-border",
      COMPLETED: "bg-status-success-bg/10 text-status-success-text border-status-success-border",
      CANCELLED: "bg-status-error-bg/10 text-status-error-text border-status-error-border",
    };
    return (
      <div
        className={`text-xs font-bold px-2.5 py-1 rounded-full border flex items-center w-max whitespace-nowrap ${colorMap[status] ?? ""}`}
      >
        {PO_STATUS_LABELS[status] ?? status}
      </div>
    );
  };

  const renderPriorityTag = (priority: POPriorityType) => {
    const colorMap: Record<POPriorityType, string> = {
      LOW: "bg-bg-muted text-text-muted border-border-default",
      NORMAL: "bg-status-info-bg/10 text-status-info-text border-status-info-border",
      HIGH: "bg-status-error-bg/10 text-status-error-text border-status-error-border",
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
        <div className="font-bold text-brand-500 tracking-wide">{text}</div>
      ),
    },
    {
      title: "Thương hiệu",
      dataIndex: "brand",
      key: "brand",
      render: (_: unknown, record: POListItemDto) => (
        <div className="font-bold text-text-main">
          {record.brand?.name ?? "N/A"}
        </div>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount: number) => (
        <div className="font-black text-text-main">
          {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)}
        </div>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (dateStr: string) => (
        <div className="text-[10px] font-black uppercase tracking-tighter text-text-muted">
          {new Date(dateStr).toLocaleDateString("vi-VN")}
        </div>
      ),
    },
    {
      title: "Ưu tiên",
      dataIndex: "priority",
      key: "priority",
      render: (priority: POPriorityType) => renderPriorityTag(priority),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: POStatusType | "CANCELLED") => renderStatusTag(status),
    },
    {
      title: "Thao tác",
      key: "actions",
      align: "center" as const,
      render: (_: unknown, record: POListItemDto) => {
        const actionItems: MenuProps['items'] = [
          {
            key: 'view',
            label: (
              <div className="flex items-center gap-2 font-medium px-1 py-1 text-blue-500">
                <Eye size={16} />
                <span>Xem chi tiết</span>
              </div>
            ),
            onClick: () => router.push(`/admin/purchases/${record.id}`)
          },
          {
            key: 'edit',
            label: (
              <div className="flex items-center gap-2 font-medium px-1 py-1 text-amber-600">
                <Edit size={16} />
                <span>Chỉnh sửa</span>
              </div>
            ),
            onClick: () => router.push(`/admin/purchases/${record.id}/edit`)
          }
        ];

        return (
          <Dropdown menu={{ items: actionItems }} trigger={['click']} placement="bottomRight">
            <SWTIconButton
              variant="custom"
              icon={<MoreVertical size={18} />}
              className="text-text-muted hover:text-brand-500 border-transparent hover:border-brand-500/30"
            />
          </Dropdown>
        );
      }
    },
  ], [router]);

  return (
    <div className="w-full">
      <div className="!bg-bg-card/90 backdrop-blur-xl !rounded-xl overflow-hidden !border !border-border-default !shadow-lg mt-4 transition-colors">
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
