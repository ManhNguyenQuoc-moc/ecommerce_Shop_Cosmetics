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
          <SWTAvatar src={record.avatar} size={40} className="shrink-0 border-pink-500/50 shadow-[0_0_8px_rgba(255,0,128,0.3)]" />
          <div className="flex flex-col">
            <div className="font-bold text-slate-800 dark:text-white dark:drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]">{record.customer}</div>
            <span className="text-slate-500 dark:text-slate-400 font-medium text-xs">ID: {record.id}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Hạng thành viên',
      dataIndex: 'tier',
      key: 'tier',
      render: (tier: string) => {
        let colorClass = "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
        if (tier === "Diamond") colorClass = "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/40 dark:text-purple-400 dark:border-purple-500/30 dark:shadow-[0_0_8px_rgba(168,85,247,0.2)]";
        else if (tier === "Gold") colorClass = "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-400 dark:border-yellow-500/30 dark:shadow-[0_0_8px_rgba(234,179,8,0.2)]";
        else if (tier === "Silver") colorClass = "bg-gray-100 text-gray-700 border-gray-200 dark:bg-slate-700/60 dark:text-slate-300 dark:border-slate-600/50 dark:shadow-[0_0_8px_rgba(148,163,184,0.2)]";
        else if (tier === "Bronze") colorClass = "bg-orange-50 text-orange-700 border-orange-200 dark:bg-amber-900/40 dark:text-amber-500 dark:border-amber-700/30 dark:shadow-[0_0_8px_rgba(245,158,11,0.2)]";

        return (
          <div className={`text-xs font-bold px-2.5 py-1 rounded-md border inline-block ${colorClass}`}>
            {tier}
          </div>
        );
      }
    },
    {
      title: 'Điểm hiện tại',
      dataIndex: 'points',
      key: 'points',
      render: (points: number) => <div className="font-bold text-brand-600 dark:text-cyan-400 text-sm">{points.toLocaleString('vi-VN')}</div>,
    },
    {
      title: 'Điểm đã dùng',
      dataIndex: 'usedPoints',
      key: 'usedPoints',
      render: (usedPoints: number) => <div className="font-semibold text-slate-500 text-sm">{usedPoints.toLocaleString('vi-VN')}</div>,
    },
    {
      title: 'Trạng thái ví',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colorClass = status === "Hoạt động" 
          ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:border-emerald-500/30 dark:shadow-[0_0_8px_rgba(16,185,129,0.2)]" 
          : "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-500 dark:border-red-500/30 dark:shadow-[0_0_8px_rgba(239,68,68,0.2)]";
        return (
          <div className={`text-xs font-semibold px-2.5 py-1 rounded-full border flex items-center justify-center gap-1.5 w-max ${colorClass}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status === "Hoạt động" ? "bg-emerald-500 dark:bg-emerald-400 dark:shadow-[0_0_5px_#34d399]" : "bg-red-500 dark:shadow-[0_0_5px_#ef4444]"}`} />
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
      <div className="!bg-white/90 dark:!bg-slate-900/80 backdrop-blur-xl !rounded-xl overflow-hidden !border !border-slate-100 dark:!border-fuchsia-500/20 !shadow-lg dark:!shadow-[0_0_15px_rgba(0,0,0,0.5)] mt-4 transition-colors">
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
