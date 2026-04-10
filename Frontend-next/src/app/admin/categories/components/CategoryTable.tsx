"use client";

import React, { useState } from 'react';
import SWTTable from "@/src/@core/component/AntD/SWTTable";
import { Edit, Trash2, Plus, List } from "lucide-react";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";
import SWTConfirmModal from "@/src/@core/component/AntD/SWTConfirmModal";
import { showNotificationError, showNotificationSuccess } from "@/src/@core/utils/message";
import { useCategories, useDeleteCategory } from "@/src/services/admin/category.service";
import SWTAvatar from "@/src/@core/component/AntD/SWTAvatar";
import AddCategoryModal from "./AddCategoryModal";
import { CategoryResponseDto } from "@/src/services/models/category/output.dto";
import SWTIconButton from "@/src/@core/component/SWTIconButton";

export default function CategoryTable() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const { categories, total, isLoading, mutate } = useCategories(page, pageSize);
  const { trigger: deleteCategory, isMutating: isDeleting } = useDeleteCategory();
  const [editingCategory, setEditingCategory] = useState<CategoryResponseDto | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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

  const columns = [
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
          <SWTTooltip title="Chỉnh sửa danh mục" color="#10b981">
            <button 
              onClick={() => setEditingCategory(record)}
              className="text-emerald-600 hover:text-emerald-800 transition-colors p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-500/10 group relative border border-transparent hover:border-emerald-100 dark:hover:border-emerald-500/20 cursor-pointer"
            >
              <Edit size={18} />
            </button>
          </SWTTooltip>
          <button 
            onClick={() => setDeletingId(record.id)}
            className="text-rose-500 hover:text-rose-700 transition-colors p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 group relative border border-transparent hover:border-rose-100 dark:hover:border-rose-500/20 cursor-pointer"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ];

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
            onClick={() => setIsAddModalOpen(true)}
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
      
      <AddCategoryModal 
        isOpen={isAddModalOpen} 
        onClose={() => {
          setIsAddModalOpen(false);
          mutate();
        }} 
      />

      {editingCategory && (
        <AddCategoryModal 
          isOpen={!!editingCategory} 
          onClose={() => {
            setEditingCategory(null);
            mutate();
          }} 
          initialData={editingCategory} 
        />
      )}

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
