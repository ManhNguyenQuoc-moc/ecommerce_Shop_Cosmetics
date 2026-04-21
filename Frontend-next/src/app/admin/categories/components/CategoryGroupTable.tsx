"use client";

import React, { useState, useMemo } from 'react';
import SWTTable from "@/src/@core/component/AntD/SWTTable";
import { Edit, Trash2, Layers, Plus, MoreVertical } from "lucide-react";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";
import SWTConfirmModal from "@/src/@core/component/AntD/SWTConfirmModal";
import { showNotificationError, showNotificationSuccess } from "@/src/@core/utils/message";
import { useCategoryGroups, useDeleteCategoryGroup } from "@/src/services/admin/category/category-group.hook";
import { CategoryGroupResponseDto } from "@/src/services/models/category-group/output.dto";
import SWTAvatar from "@/src/@core/component/AntD/SWTAvatar";
import SWTIconButton from "@/src/@core/component/SWTIconButton";
import { Dropdown } from "antd";
import type { MenuProps } from "antd";

interface CategoryGroupTableProps {
  onEdit?: (group: CategoryGroupResponseDto) => void;
  onAdd?: () => void;
}

export default function CategoryGroupTable({ onEdit, onAdd }: CategoryGroupTableProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { categoryGroups, total, isLoading, mutate } = useCategoryGroups(page, pageSize);
  const { trigger: deleteGroup, isMutating: isDeleting } = useDeleteCategoryGroup();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      if (!id) return;
      await deleteGroup(id);
      showNotificationSuccess("Xóa nhóm danh mục thành công!");
      mutate();
      setDeletingId(null);
    } catch (e: any) {
      showNotificationError(e.message || "Lỗi khi xóa nhóm danh mục");
    }
  };

  const columns = useMemo(() => [
    {
      title: 'Tên nhóm',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: CategoryGroupResponseDto) => (
        <div className="flex items-center gap-3">
          <SWTAvatar
            size={45}
            className="rounded-xl border border-slate-200 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 font-bold"
          >
            <Layers size={20} />
          </SWTAvatar>
          <div className="flex flex-col">
            <span className="font-bold text-slate-800 dark:text-white leading-tight">{record.name}</span>
            <span className="text-xs text-slate-500 font-medium mt-0.5">Slug: {record.slug}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => (
        <div className="max-w-[400px] truncate-2-lines text-xs text-slate-600 dark:text-slate-400">
          {text || "Chưa có mô tả"}
        </div>
      )
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => (
        <div className="text-xs font-medium text-slate-500">
          {new Date(date).toLocaleDateString("vi-VN")}
        </div>
      )
    },
    {
      title: 'Thao tác',
      key: 'actions',
      align: 'center' as const,
      width: 120,
      render: (_: any, record: CategoryGroupResponseDto) => {
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
      <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-emerald-500/10">
        <div className="flex items-center gap-3">
          {/* <div className="flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-0 leading-tight">Danh sách nhóm danh mục</h3>
            <span className="text-xs text-slate-500 font-medium">Tất cả các nhóm phân loại chính</span>
          </div> */}
        </div>

        <SWTTooltip title="Thêm Nhóm Mới" placement="top">
          <div
            className="flex h-11 w-11 items-center justify-center bg-brand-500/10 hover:bg-brand-500/20 text-brand-600 dark:text-brand-400 border border-brand-100 dark:border-brand-500/30 rounded-xl shadow-sm transition-all cursor-pointer group"
            onClick={onAdd}
          >
            <Plus size={24} className="stroke-[2.5] group-hover:scale-110 group-hover:rotate-90 transition-transform duration-300" />
          </div>
        </SWTTooltip>
      </div>

      <div className="!bg-white/90 dark:!bg-slate-900/80 backdrop-blur-xl overflow-hidden transition-colors">
        <SWTTable
          columns={columns}
          dataSource={categoryGroups}
          rowKey="id"
          loading={isLoading}
          pagination={{
            totalCount: total,
            page: page,
            fetch: pageSize,
            onChange: (p: number, f: number) => {
              // If pageSize changed, reset to page 1
              if (f !== pageSize) {
                setPage(1);
              } else {
                setPage(p);
              }
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
        title="Xóa nhóm danh mục này?"
        description="Bạn chắc chắn muốn xóa nhóm này? Các danh mục bên trong sẽ không còn nhóm (set to null)."
        confirmText="Xác nhận xóa"
        variant="danger"
      />
    </div>
  );
}
