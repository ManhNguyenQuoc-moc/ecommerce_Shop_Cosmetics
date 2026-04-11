"use client";

import SWTTable from "@/src/@core/component/AntD/SWTTable";
import SWTAvatar from "@/src/@core/component/AntD/SWTAvatar";
import { Dropdown } from "antd";
import type { MenuProps } from "antd";
import { UserCog, Ban, Unlock, MoreVertical } from "lucide-react";
import SWTIconButton from "@/src/@core/component/SWTIconButton";
import React, { useState, useMemo } from "react";
import { useUsers, useUpdateUserStatus } from "@/src/services/admin/user.service";
import { showNotificationSuccess, showNotificationError } from "@/src/@core/utils/message";

interface UserTableProps {
  searchTerm?: string;
}

export default function UserTable({ searchTerm }: UserTableProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const { users, total, isLoading, mutate } = useUsers(page, pageSize, { search: searchTerm });
  const { trigger: updateStatus } = useUpdateUserStatus();

  const handleToggleStatus = async (user: any) => {
    const newStatus = user.status === "ACTIVE" ? "BANNED" : "ACTIVE";
    try {
      await updateStatus({ id: user.id, status: newStatus });
      showNotificationSuccess(`Đã ${newStatus === "ACTIVE" ? "mở khóa" : "khóa"} người dùng thành công`);
      mutate();
    } catch (err: any) {
      showNotificationError(err.message || "Có lỗi xảy ra");
    }
  };

  const columns = useMemo(() => [
    {
      title: 'Người dùng',
      dataIndex: 'full_name',
      key: 'name',
      render: (text: string, record: any) => (
        <div className="flex items-center gap-3">
          <SWTAvatar src={record.avatar} size={40} className="shrink-0 border-pink-500/50 shadow-[0_0_8px_rgba(255,0,128,0.3)]" />
          <div className="flex flex-col">
            <div className="font-bold text-slate-800 dark:text-white dark:drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">
               {record.full_name || "N/A"}
            </div>
            <span className="text-slate-500 dark:text-slate-400 font-medium">{record.email}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      render: (text: string) => <div className="text-slate-500 dark:text-slate-300 font-medium text-sm">{text || "N/A"}</div>,
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        let colorClass = "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
        if (role === "ADMIN") colorClass = "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/40 dark:text-purple-400 dark:border-purple-500/30 dark:shadow-[0_0_8px_rgba(168,85,247,0.2)]";
        else if (role === "STAFF") colorClass = "bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900/40 dark:text-cyan-400 dark:border-cyan-500/30 dark:shadow-[0_0_8px_rgba(0,240,255,0.2)]";
        else if (role === "CUSTOMER") colorClass = "bg-brand-50 text-brand-600 border-brand-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";

        return (
          <div className={`text-[10px] font-black px-2 py-0.5 rounded border inline-block uppercase tracking-wider ${colorClass}`}>
            {role}
          </div>
        );
      }
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const isActive = status === 'ACTIVE';
        const colorClass = isActive 
          ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:border-emerald-500/30" 
          : "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-500 dark:border-red-500/30";
        return (
          <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center justify-center gap-1.5 w-max ${colorClass}`}>
            <span className={`w-1 h-1 rounded-full ${isActive ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
            {isActive ? "HOẠT ĐỘNG" : "BỊ KHÓA"}
          </div>
        );
      }
    },
    {
      title: 'Điểm tích lũy',
      dataIndex: 'loyalty_points',
      key: 'loyalty_points',
      align: 'center' as const,
      render: (points: number) => <div className="font-bold text-amber-500">{points || 0}</div>
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, record: any) => {
        const isBanned = record.status === "BANNED";
        const actionItems: MenuProps['items'] = [
          {
            key: 'assign',
            label: (
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium px-1 py-1">
                <UserCog size={16} />
                <span>Phân quyền</span>
              </div>
            ),
          },
          { type: 'divider' },
          {
            key: 'toggle_status',
            label: (
              <div 
                className={`flex items-center gap-2 font-medium px-1 py-1 ${isBanned ? 'text-emerald-500' : 'text-red-500'}`}
                onClick={() => handleToggleStatus(record)}
              >
                {isBanned ? <Unlock size={16} /> : <Ban size={16} />}
                <span>{isBanned ? 'Mở Khóa User' : 'Khóa User'}</span>
              </div>
            ),
          }
        ];

        return (
          <Dropdown menu={{ items: actionItems }} trigger={['click']} placement="bottomRight">
            <SWTIconButton 
              variant="custom"
              icon={<MoreVertical size={18} />}
              className="text-slate-400 hover:text-pink-400 border-transparent hover:border-pink-500/30"
            />
          </Dropdown>
        );
      }
    }
  ], [handleToggleStatus]);

  return (
    <div className="overflow-hidden !border !border-slate-100 dark:!border-pink-500/20 !rounded-2xl !bg-white/80 dark:!bg-slate-900/50 backdrop-blur-xl !shadow-sm overflow-x-auto">
      <SWTTable 
        columns={columns} 
        dataSource={users} 
        rowKey="id" 
        loading={isLoading}
        className="min-w-[700px]" 
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
  );
}
