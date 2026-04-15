"use client";

import React, { useState, useMemo } from 'react';
import SWTTable from "@/src/@core/component/AntD/SWTTable";
import { Edit, Trash2, Globe, Phone, Mail, MapPin } from "lucide-react";
import SWTConfirmModal from "@/src/@core/component/AntD/SWTConfirmModal";
import { showNotificationError, showNotificationSuccess } from "@/src/@core/utils/message";
import { useBrands, useDeleteBrand } from "@/src/services/admin/brand/brand.hook";
import SWTAvatar from "@/src/@core/component/AntD/SWTAvatar";
import SWTIconButton from "@/src/@core/component/SWTIconButton";

interface BrandTableProps {
  onEdit?: (brand: any) => void;
  searchTerm?: string;
}

export default function BrandTable({ onEdit, searchTerm }: BrandTableProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const { brands, total, isLoading, mutate } = useBrands(page, pageSize);
  const { trigger: deleteBrand, isMutating: isDeleting } = useDeleteBrand();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      if (!id) return;
      await deleteBrand(id);
      showNotificationSuccess("Xóa nhà cung cấp thành công!");
      mutate();
      setDeletingId(null);
    } catch (e: any) {
      showNotificationError(e.message || "Lỗi khi xóa nhà cung cấp");
    }
  };

  const columns = useMemo(() => [
    {
      title: 'Nhà cung cấp',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <div className="flex items-center gap-3">
          <SWTAvatar
            src={record.logo?.url}
            size={45}
            className="rounded-xl border border-border-default bg-bg-card"
          >
            {record.name.charAt(0)}
          </SWTAvatar>
          <div className="flex flex-col">
            <span className="font-bold text-text-main leading-tight">{record.name}</span>
            <span className="text-xs text-text-muted font-medium mt-0.5">Slug: {record.slug}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Liên hệ',
      key: 'contact',
      render: (_: any, record: any) => (
        <div className="space-y-1">
          {record.email && (
            <div className="flex items-center gap-1.5 text-xs text-text-sub font-medium">
              <Mail size={12} className="text-status-success-text" />
              {record.email}
            </div>
          )}
          {record.phone && (
            <div className="flex items-center gap-1.5 text-xs text-text-sub font-medium">
              <Phone size={12} className="text-status-success-text" />
              {record.phone}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      render: (text: string) => (
        <div className="max-w-[200px] truncate text-xs text-text-sub flex items-center gap-1.5 font-medium">
          {text ? <><MapPin size={12} className="text-status-success-text shrink-0" /> {text}</> : "N/A"}
        </div>
      )
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => (
        <div className="text-xs font-bold text-text-muted uppercase tracking-tighter">
          {new Date(date).toLocaleDateString("vi-VN")}
        </div>
      )
    },
    {
      title: 'Thao tác',
      key: 'actions',
      align: 'center' as const,
      render: (_: any, record: any) => (
        <div className="flex items-center gap-2 justify-center">
          <SWTIconButton
            variant="edit"
            tooltip="Chỉnh sửa nhà cung cấp"
            icon={<Edit size={18} />}
            onClick={() => onEdit?.(record)}
          />
          <SWTIconButton
            variant="delete"
            tooltip="Xóa nhà cung cấp"
            icon={<Trash2 size={18} />}
            onClick={() => setDeletingId(record.id)}
          />
        </div>
      )
    }
  ], [onEdit]);

  return (
    <div className="w-full">
      <div className="!bg-bg-card/90 backdrop-blur-xl !rounded-xl overflow-hidden !border !border-border-default !shadow-lg mt-4 transition-colors">
        <SWTTable
          columns={columns}
          dataSource={brands}
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

      <SWTConfirmModal
        open={!!deletingId}
        loading={isDeleting}
        onConfirm={() => {
          if (deletingId) handleDelete(deletingId);
        }}
        onCancel={() => setDeletingId(null)}
        title="Xóa nhà cung cấp này?"
        description="Bạn chắc chắn muốn xóa nhà cung cấp này? Hành động này không thể hoàn tác."
        confirmText="Xác nhận xóa"
        variant="danger"
      />
    </div>
  );
}
