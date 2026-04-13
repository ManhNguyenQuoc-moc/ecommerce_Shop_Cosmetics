"use client";

import SWTTable from "@/src/@core/component/AntD/SWTTable";
import SWTAvatar from "@/src/@core/component/AntD/SWTAvatar";
import { Dropdown } from "antd";
import type { MenuProps } from "antd";
import { History, Ban, Unlock, MoreVertical } from "lucide-react";
import SWTIconButton from "@/src/@core/component/SWTIconButton";
import React, { useState, useMemo } from "react";
import { useUsers, useToggleWalletLock } from "@/src/hooks/admin/user.hook";
import { showNotificationSuccess, showNotificationError } from "@/src/@core/utils/message";
import UserPointsDrawer from "./UserPointsDrawer";

interface RewardsTableProps {
  searchTerm?: string;
}

export default function RewardsTable({ searchTerm }: RewardsTableProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const { users, total, isLoading, mutate } = useUsers(page, pageSize, { search: searchTerm });
  const { trigger: toggleWallet } = useToggleWalletLock();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUserForPoints, setSelectedUserForPoints] = useState<any>(null);

  const handleToggleWalletLock = async (user: any) => {
    try {
      const isLocked = !user.is_point_wallet_locked;
      await toggleWallet({ id: user.id, isLocked });
      showNotificationSuccess(`Đã ${isLocked ? "khóa" : "mở khóa"} ví điểm thành công`);
      mutate();
    } catch (err: any) {
      showNotificationError(err.message || "Có lỗi xảy ra");
    }
  };

  const columns = useMemo(() => [
    {
      title: 'Khách hàng',
      dataIndex: 'full_name',
      key: 'name',
      render: (text: string, record: any) => (
        <div className="flex items-center gap-3">
          <SWTAvatar src={record.avatar} size={40} className="shrink-0 border-brand-500/50" />
          <div className="flex flex-col">
            <div className="font-bold text-text-main">
              {record.full_name || "N/A"}
            </div>
            <span className="text-text-muted font-medium">{record.email}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Hạng thành viên',
      dataIndex: 'member_rank',
      key: 'member_rank',
      render: (rank: string) => <div className="text-sm font-semibold text-brand-600 dark:text-brand-400">{rank || "Đồng"}</div>
    },
    {
      title: 'Điểm tích lũy',
      dataIndex: 'lifetime_points',
      key: 'lifetime_points',
      align: 'center' as const,
      render: (points: number) => <div className="font-bold text-amber-500">{points || 0}</div>
    },
    {
      title: 'Điểm đã đổi',
      dataIndex: 'used_points',
      key: 'used_points',
      align: 'center' as const,
      render: (points: number) => <div className="font-medium text-gray-500">{points || 0}</div>
    },
    {
      title: 'Điểm còn dư',
      dataIndex: 'loyalty_points',
      key: 'loyalty_points',
      align: 'center' as const,
      render: (points: number) => <div className="font-bold text-emerald-600">{points || 0}</div>
    },
    {
      title: 'Trạng thái ví',
      dataIndex: 'is_point_wallet_locked',
      key: 'wallet_status',
      align: 'center' as const,
      render: (locked: boolean) => (
        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${locked ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'} flex items-center justify-center w-max mx-auto gap-1 border ${locked ? 'border-red-200' : 'border-green-200'}`}>
          <span className={`w-1 h-1 rounded-full ${locked ? "bg-red-500 animate-pulse" : "bg-green-500"}`} />
          {locked ? "ĐÃ KHÓA" : "HOẠT ĐỘNG"}
        </span>
      )
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, record: any) => {
        const actionItems: MenuProps['items'] = [
          {
            key: 'wallet_lock',
            label: (
              <div
                className={`flex items-center gap-2 font-medium px-1 py-1 ${record.is_point_wallet_locked ? 'text-green-600' : 'text-orange-500'}`}
                onClick={() => handleToggleWalletLock(record)}
              >
                {record.is_point_wallet_locked ? <Unlock size={16} /> : <Ban size={16} />}
                <span>{record.is_point_wallet_locked ? 'Mở Khóa Ví' : 'Khóa Ví Điểm'}</span>
              </div>
            ),
          },
          { type: 'divider' },
          {
            key: 'view_history',
            label: (
              <div
                className="flex items-center gap-2 font-medium px-1 py-1 text-blue-500"
                onClick={() => {
                  setSelectedUserForPoints(record);
                  setDrawerOpen(true);
                }}
              >
                <History size={16} />
                <span>Lịch sử giao dịch</span>
              </div>
            ),
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
  ], [handleToggleWalletLock]);

  return (
    <div className="overflow-hidden !border !border-border-default dark:!border-border-brand !rounded-2xl !bg-bg-card backdrop-blur-xl !shadow-sm overflow-x-auto w-full">
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
      <UserPointsDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        userId={selectedUserForPoints?.id}
        userName={selectedUserForPoints?.full_name}
      />
    </div>
  );
}
