"use client";

import SWTTable from "@/src/@core/component/AntD/SWTTable";
import SWTAvatar from "@/src/@core/component/AntD/SWTAvatar";
import { useState, useMemo } from "react";
import { History } from "lucide-react";
import SWTIconButton from "@/src/@core/component/SWTIconButton";

const mockRewards = [
  { id: "RW-101", customer: "Trần Bảo Ngọc", tier: "Diamond", points: 15420, usedPoints: 5000, status: "Hoạt động", avatar: "" },
  { id: "RW-102", customer: "Lê Minh Tuấn", tier: "Gold", points: 8200, usedPoints: 1200, status: "Hoạt động", avatar: "" },
  { id: "RW-103", customer: "Phạm Hải Yến", tier: "Silver", points: 300, usedPoints: 0, status: "Khóa", avatar: "" },
  { id: "RW-104", customer: "Ngô Quang Hùng", tier: "Bronze", points: 50, usedPoints: 0, status: "Hoạt động", avatar: "" },
  { id: "RW-105", customer: "Hoàng Minh Tâm", tier: "Gold", points: 9550, usedPoints: 15000, status: "Hoạt động", avatar: "" },
  { id: "RW-106", customer: "Lục Tuyết Kỳ", tier: "Diamond", points: 32400, usedPoints: 80000, status: "Hoạt động", avatar: "" },
];

export default function RewardTable() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const paginatedData = useMemo(() => mockRewards.slice((page - 1) * pageSize, page * pageSize), [page, pageSize]);

  const columns = useMemo(() => [
    {
      title: 'Khách hàng',
      dataIndex: 'customer',
      key: 'customer',
      render: (text: string, record: any) => (
        <div className="flex items-center gap-3">
          <SWTAvatar src={record.avatar} size={40} className="shrink-0 border-brand-500/50 shadow-[0_0_8px_rgba(255,105,180,0.3)]" />
          <div className="flex flex-col">
            <div className="font-bold text-text-main leading-tight">{record.customer}</div>
            <span className="text-text-muted font-bold text-[10px] uppercase tracking-widest mt-0.5">ID: {record.id}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Hạng thành viên',
      dataIndex: 'tier',
      key: 'tier',
      render: (tier: string) => {
        let colorClass = "bg-bg-muted text-text-muted border-border-default";
        if (tier === "Diamond") colorClass = "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/40 dark:text-purple-400 dark:border-purple-500/30";
        else if (tier === "Gold") colorClass = "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-400 dark:border-amber-500/30";
        else if (tier === "Silver") colorClass = "bg-bg-muted text-text-sub border-border-default";
        else if (tier === "Bronze") colorClass = "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-400 dark:border-emerald-500/30";

        return (
          <div className={`text-[10px] font-black px-2.5 py-1 rounded-md border inline-block uppercase tracking-wider ${colorClass}`}>
            {tier}
          </div>
        );
      }
    },
    {
      title: 'Điểm hiện tại',
      dataIndex: 'points',
      key: 'points',
      render: (points: number) => <div className="font-black text-brand-500 text-sm">{points.toLocaleString('vi-VN')}</div>,
    },
    {
      title: 'Điểm đã dùng',
      dataIndex: 'usedPoints',
      key: 'usedPoints',
      render: (usedPoints: number) => <div className="font-bold text-text-muted text-[11px] uppercase tracking-tighter">{usedPoints.toLocaleString('vi-VN')}</div>,
    },
    {
      title: 'Trạng thái ví',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colorClass = status === "Hoạt động" 
          ? "bg-status-success-bg text-status-success-text border-status-success-border" 
          : "bg-status-error-bg text-status-error-text border-status-error-border";
        return (
          <div className={`text-[10px] font-black px-2.5 py-1 rounded-full border flex items-center justify-center gap-1.5 w-max uppercase tracking-wider ${colorClass}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status === "Hoạt động" ? "bg-status-success-text animate-pulse" : "bg-status-error-text"}`} />
            {status}
          </div>
        );
      }
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: () => (
        <SWTIconButton
          variant="view"
          icon={<History size={18} />}
          tooltip="Lịch sử giao dịch"
          onClick={() => {}}
        />
      )
    }
  ], []);

  return (
    <div className="w-full">
      <div className="!bg-bg-card/90 backdrop-blur-xl !rounded-xl overflow-hidden !border !border-border-default !shadow-lg dark:!shadow-[0_0_15px_rgba(0,0,0,0.5)] mt-4 transition-colors">
        <SWTTable 
          columns={columns} 
          dataSource={paginatedData} 
          rowKey="id" 
          pagination={{
            totalCount: mockRewards.length,
            page: page,
            fetch: pageSize,
            onChange: (p: number, f: number) => {
              setPage(p);
              setPageSize(f);
            }
          }}
        />
      </div>
    </div>
  );
}
