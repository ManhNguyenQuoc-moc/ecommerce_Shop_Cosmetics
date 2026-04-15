"use client";

import React, { useState, useMemo } from 'react';
import SWTTable from "@/src/@core/component/AntD/SWTTable";
import { Edit, Trash2, Plus } from "lucide-react";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";
import SWTConfirmModal from "@/src/@core/component/AntD/SWTConfirmModal";
import { showNotificationError, showNotificationSuccess } from "@/src/@core/utils/message";
import { useCategories, useDeleteCategory } from "@/src/services/admin/category/category.hook";
import SWTAvatar from "@/src/@core/component/AntD/SWTAvatar";
import { CategoryResponseDto } from "@/src/services/models/category/output.dto";
import SWTIconButton from "@/src/@core/component/SWTIconButton";

interface CategoryTableProps {
  onEdit?: (category: CategoryResponseDto) => void;
  onAdd?: () => void;
}

export default function CategoryTable({ onEdit, onAdd }: CategoryTableProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const { categories, total, isLoading, mutate } = useCategories(page, pageSize);
  const { trigger: deleteCategory, isMutating: isDeleting } = useDeleteCategory();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      if (!id) return;
      await deleteCategory(id);
      showNotificationSuccess("Xóa danh mục thành công!");
      mutate();
      setDeletingId(null);
    } catch (e: any) {
      showNotificationError(e.message || "Lỗi khi xóa danh mục");
    }
  };

  const columns = useMemo(() => [
    {
      title: 'Danh mục',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: CategoryResponseDto) => (
        <div className="flex items-center gap-3">
          <SWTAvatar
            src={(record as any).image?.url || ""}
            size={45}
            className="rounded-xl border border-slate-200 bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 font-bold object-cover"
          >
            {record.name.charAt(0)}
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
        <div className="max-w-[300px] truncate-2-lines text-xs text-slate-600 dark:text-slate-400">
          {text || "Chưa có mô tả"}
        </div>
      )
    },
    {
      title: 'Nhóm',
      dataIndex: 'categoryGroup',
      key: 'categoryGroup',
      render: (group: any) => (
        <div className="flex items-center">
          {group ? (
            <span className="px-2.5 py-1 bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400 rounded-lg text-[11px] font-bold border border-pink-100 dark:border-pink-500/20">
              {group.name}
            </span>
          ) : (
            <span className="text-[11px] text-slate-400 italic">Chưa phân nhóm</span>
          )}
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
      render: (_: any, record: CategoryResponseDto) => (
        <div className="flex items-center gap-2 justify-center">
          <SWTIconButton
            variant="edit"
            tooltip="Chỉnh sửa danh mục"
            icon={<Edit size={18} />}
            onClick={() => onEdit?.(record)}
          />
          <SWTIconButton
            variant="delete"
            tooltip="Xóa danh mục"
            icon={<Trash2 size={18} />}
            onClick={() => setDeletingId(record.id)}
          />
        </div>
      )
    }
  ], [onEdit]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-emerald-500/10">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-0 leading-tight">Danh sách danh mục</h3>
            <span className="text-xs text-slate-500 font-medium">Tất cả danh mục trong hệ thống</span>
          </div>
        </div>

        <SWTTooltip title="Thêm Danh Mục" placement="top" color="#10b981">
          <div
            className="flex h-11 w-11 items-center justify-center bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/30 rounded-xl shadow-sm transition-all cursor-pointer group"
            onClick={onAdd}
          >
            <Plus size={24} className="stroke-[2.5] group-hover:scale-110 group-hover:rotate-90 transition-transform duration-300" />
          </div>
        </SWTTooltip>
      </div>

      <div className="!bg-white/90 dark:!bg-slate-900/80 backdrop-blur-xl overflow-hidden transition-colors">
        <SWTTable
          columns={columns}
          dataSource={categories}
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
        title="Xóa danh mục này?"
        description="Bạn chắc chắn muốn xóa danh mục này? Hành động không thể hoàn tác."
        confirmText="Xác nhận xóa"
        variant="danger"
      />
    </div>
  );
}
