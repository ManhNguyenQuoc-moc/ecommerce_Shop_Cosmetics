"use client";

import React, { useState, useMemo } from 'react';
import SWTTable from "@/src/@core/component/AntD/SWTTable";
import { Edit, Trash2, Phone, Mail, MapPin, MoreVertical } from "lucide-react";
import SWTConfirmModal from "@/src/@core/component/AntD/SWTConfirmModal";
import { showNotificationError, showNotificationSuccess } from "@/src/@core/utils/message";
import SWTAvatar from "@/src/@core/component/AntD/SWTAvatar";
import SWTIconButton from "@/src/@core/component/SWTIconButton";
import { Dropdown } from "antd";
import type { MenuProps } from "antd";
import { mutate as globalMutate } from "swr";
import { BRAND_API_ENDPOINT, useBrands, useDeleteBrand } from "@/src/services/admin/brand/brand.hook";
import { BrandQueryFilters } from "@/src/services/models/brand/input.dto";
import { BrandResponseDto } from "@/src/services/models/brand/output.dto";

interface BrandTableProps {
  params: BrandQueryFilters;
  onEdit?: (brand: BrandResponseDto) => void;
  onParamChange: (newParams: Partial<BrandQueryFilters>) => void;
}

export default function BrandTable({ onEdit, onParamChange, params }: BrandTableProps) {
  const page = params.page || 1;
  const pageSize = params.pageSize || 6;
  const { brands, total, isLoading, mutate } = useBrands(page, pageSize, params);
  const { trigger: deleteBrand, isMutating: isDeleting } = useDeleteBrand();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      if (!id) return;
      await deleteBrand(id);
      showNotificationSuccess("Xóa nhà cung cấp thành công!");
      mutate();
      globalMutate(
        (key) => typeof key === "string" && key.startsWith(BRAND_API_ENDPOINT),
        undefined,
        { revalidate: true }
      );
      setDeletingId(null);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Lỗi khi xóa nhà cung cấp";
      showNotificationError(message);
    }
  };

  const columns = useMemo(() => [
    {
      title: 'Nhà cung cấp',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: BrandResponseDto) => (
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
      render: (_: unknown, record: BrandResponseDto) => (
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
        <div className="max-w-50 truncate text-xs text-text-sub flex items-center gap-1.5 font-medium">
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
      render: (_: unknown, record: BrandResponseDto) => {
        const actionItems: MenuProps['items'] = [
          {
            key: 'edit',
            label: (
              <div className="flex items-center gap-2 font-medium px-1 py-1 text-amber-600">
                <Edit size={16} />
                <span>Chỉnh sửa</span>
              </div>
            ),
            onClick: () => onEdit?.(record)
          },
          { type: 'divider' },
          {
            key: 'delete',
            label: (
              <div className="flex items-center gap-2 font-medium px-1 py-1 text-red-600">
                <Trash2 size={16} />
                <span>Xóa</span>
              </div>
            ),
            onClick: () => setDeletingId(record.id)
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
    }
  ], [onEdit]);

  return (
    <div className="w-full">
      <div className="bg-bg-card/90! backdrop-blur-xl rounded-xl! overflow-hidden border! border-border-default! shadow-lg! mt-4 transition-colors">
        <SWTTable
          columns={columns}
          dataSource={brands}
          rowKey="id"
          loading={isLoading}
          pagination={{
            totalCount: total,
            page,
            fetch: pageSize,
            onChange: (p: number, f: number) => {
              if (f !== pageSize) {
                onParamChange({ page: 1, pageSize: f });
              } else {
                onParamChange({ page: p, pageSize: f });
              }
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
