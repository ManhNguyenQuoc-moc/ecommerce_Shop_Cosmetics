"use client";

import React, { useState } from 'react';
import SWTTable from "@/src/@core/component/AntD/SWTTable";
import { Edit, Trash2, Globe, Phone, Mail, MapPin } from "lucide-react";
import { Popconfirm } from "antd";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";
import { showNotificationError, showNotificationSuccess } from "@/src/@core/utils/message";
import { useBrands, useDeleteBrand } from "@/src/services/admin/brand.service";
import SWTAvatar from "@/src/@core/component/AntD/SWTAvatar";
import AddBrandModal from "./AddBrandModal";

export default function BrandTable() {
  const { brands, isLoading, mutate } = useBrands();
  const { trigger: deleteBrand } = useDeleteBrand();
  const [editingBrand, setEditingBrand] = useState<any>(null);

  const handleDelete = async (id: string) => {
    try {
      await deleteBrand(id);
      showNotificationSuccess("Xóa nhà cung cấp thành công!");
      mutate();
    } catch (e: any) {
      showNotificationError(e.message || "Lỗi khi xóa nhà cung cấp");
    }
  };

  const columns = [
    {
      title: 'Nhà cung cấp',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <div className="flex items-center gap-3">
          <SWTAvatar 
            src={record.logo?.url} 
            size={45} 
            className="rounded-xl border border-slate-200 bg-white"
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
      title: 'Liên hệ',
      key: 'contact',
      render: (_: any, record: any) => (
        <div className="space-y-1">
          {record.email && (
            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
              <Mail size={12} className="text-emerald-500" />
              {record.email}
            </div>
          )}
          {record.phone && (
            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
              <Phone size={12} className="text-emerald-500" />
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
        <div className="max-w-[200px] truncate text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
          {text ? <><MapPin size={12} className="text-emerald-500 shrink-0" /> {text}</> : "N/A"}
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
      render: (_: any, record: any) => (
        <div className="flex items-center gap-2 justify-center">
          <SWTTooltip title="Chỉnh sửa nhà cung cấp" color="#10b981">
            <button 
              onClick={() => setEditingBrand(record)}
              className="text-emerald-600 hover:text-emerald-800 transition-colors p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-500/10 group relative border border-transparent hover:border-emerald-100 dark:hover:border-emerald-500/20 cursor-pointer"
            >
              <Edit size={18} />
            </button>
          </SWTTooltip>
          <SWTTooltip title="Xóa nhà cung cấp" color="#f43f5e">
            <Popconfirm 
              title="Xóa nhà cung cấp này?"
              description="Hành động này không thể hoàn tác."
              onConfirm={() => handleDelete(record.id)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true, className: "!rounded-lg" }}
              cancelButtonProps={{ className: "!rounded-lg" }}
            >
              <button className="text-rose-500 hover:text-rose-700 transition-colors p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 group relative border border-transparent hover:border-rose-100 dark:hover:border-rose-500/20 cursor-pointer">
                <Trash2 size={18} />
              </button>
            </Popconfirm>
          </SWTTooltip>
        </div>
      )
    }
  ];

  return (
    <div className="w-full">
      <div className="!bg-white/90 dark:!bg-slate-900/80 backdrop-blur-xl !rounded-xl overflow-hidden !border !border-slate-100 dark:!border-emerald-500/20 !shadow-lg mt-4 transition-colors">
        <SWTTable
          columns={columns}
          dataSource={brands}
          rowKey="id"
          loading={isLoading}
          pagination={{
            totalCount: brands.length,
            page: 1,
            fetch: 10,
            onChange: () => {}
          }}
        />
      </div>
      
      {editingBrand && (
        <AddBrandModal 
          isOpen={!!editingBrand} 
          onClose={() => setEditingBrand(null)} 
          initialData={editingBrand} 
        />
      )}
    </div>
  );
}
