"use client";

import SWTTable from "@/src/@core/component/AntD/SWTTable";
import { PermissionDto } from "@/src/services/admin/rbac";
import { useMemo } from "react";
import {
  PERMISSION_ACTION_LABELS,
  PERMISSION_RESOURCE_LABELS,
} from "@/src/enums";

interface PermissionsTableProps {
  permissions: PermissionDto[];
}

export default function PermissionsTable({ permissions }: PermissionsTableProps) {
  const renderResourceTag = (resource: string) => (
    <div className="text-[10px] uppercase tracking-wider font-black px-2 py-0.5 rounded border flex items-center w-max whitespace-nowrap shadow-sm bg-status-info-bg/10 text-status-info-text border-status-info-border">
      {PERMISSION_RESOURCE_LABELS[resource] ?? resource}
    </div>
  );

  const renderActionTag = (action: string) => {
    const actionClassMap: Record<string, string> = {
      create: "bg-status-success-bg/10 text-status-success-text border-status-success-border",
      read: "bg-bg-muted text-text-muted border-border-default",
      list: "bg-bg-muted text-text-muted border-border-default",
      update: "bg-status-warning-bg/10 text-status-warning-text border-status-warning-border",
      delete: "bg-status-error-bg/10 text-status-error-text border-status-error-border",
      manage: "bg-brand-500/10 text-brand-500 border-brand-500/20",
    };

    return (
      <div
        className={`text-[10px] uppercase tracking-wider font-black px-2 py-0.5 rounded border flex items-center w-max whitespace-nowrap shadow-sm ${actionClassMap[action] ?? "bg-status-info-bg/10 text-status-info-text border-status-info-border"}`}
      >
        {PERMISSION_ACTION_LABELS[action] ?? action}
      </div>
    );
  };

  const columns = useMemo(() => [
    {
      title: "Permission",
      dataIndex: "name",
      key: "name",
      width: 260,
      render: (text: string) => (
        <div className="font-bold text-brand-500 tracking-wide">{text}</div>
      ),
    },
    {
      title: "Resource",
      dataIndex: "resource",
      key: "resource",
      width: 170,
      render: (text: string) => renderResourceTag(text),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 170,
      render: (text: string) => renderActionTag(text),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (text: string) => (
        <div className="text-sm text-text-sub">{text || "-"}</div>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (date: string) => (
        <div className="text-[10px] font-black uppercase tracking-tighter text-text-muted">
          {new Date(date).toLocaleDateString("vi-VN")}
        </div>
      ),
    },
  ], []);

  return (
    <div className="w-full">
      <div className="bg-bg-card/90 backdrop-blur-xl rounded-xl overflow-hidden border border-border-default shadow-lg mt-4 transition-colors">
        <SWTTable
          columns={columns}
          dataSource={permissions}
          rowKey="id"
          pagination={false}
          className="w-full"
          size="small"
        />
      </div>
    </div>
  );
}
