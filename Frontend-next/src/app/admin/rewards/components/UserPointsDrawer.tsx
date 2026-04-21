import React, { useMemo } from "react";
import SWTDrawer from "@/src/@core/component/AntD/SWTDrawer";
import SWTTable from "@/src/@core/component/AntD/SWTTable";
import { usePointHistory } from "@/src/services/admin/user/user.hook";

interface UserPointsDrawerProps {
  open: boolean;
  onClose: () => void;
  userId: string | null;
  userName?: string;
}

interface PointHistoryRow {
  id: string;
  createdAt: string;
  type: "EARN" | "SPEND";
  amount: number;
  reason?: string | null;
}

export default function UserPointsDrawer({ open, onClose, userId, userName }: UserPointsDrawerProps) {
  const { history, isLoading } = usePointHistory(userId);
  const rows = (history ?? []) as PointHistoryRow[];

  const summary = useMemo(() => {
    const earned = rows
      .filter((item) => item.type === "EARN")
      .reduce((sum, item) => sum + (item.amount || 0), 0);
    const spent = rows
      .filter((item) => item.type === "SPEND")
      .reduce((sum, item) => sum + (item.amount || 0), 0);

    return {
      earned,
      spent,
      balanceDelta: earned - spent,
      totalTransactions: rows.length,
    };
  }, [rows]);

  const columns = [
    {
      title: "Ngày giao dịch",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleString("vi-VN"),
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (type: string) => (
        <span className={`font-bold ${type === 'EARN' ? 'text-green-500' : 'text-red-500'}`}>
          {type === 'EARN' ? '+ Nhận' : '- Tiêu'}
        </span>
      ),
    },
    {
      title: "Số điểm",
      dataIndex: "amount",
      key: "amount",
      align: "center" as const,
      render: (amount: number, record: PointHistoryRow) => (
        <span className={`font-bold ${record.type === 'EARN' ? 'text-green-500' : 'text-red-500'}`}>
          {record.type === 'EARN' ? `+${amount.toLocaleString("vi-VN")}` : `-${amount.toLocaleString("vi-VN")}`}
        </span>
      ),
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      key: "reason",
      render: (reason: string | null | undefined) => reason || "-",
    },
  ];

  return (
    <SWTDrawer
      title={`Lịch sử giao dịch điểm - ${userName || "Khách hàng"}`}
      width={880}
      open={open}
      onClose={onClose}
    >
      <div className="flex flex-col gap-6 p-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-xl border border-border-default bg-bg-card p-3">
            <div className="text-xs text-text-muted">Giao dịch</div>
            <div className="text-lg font-bold text-text-main">{summary.totalTransactions}</div>
          </div>
          <div className="rounded-xl border border-border-default bg-bg-card p-3">
            <div className="text-xs text-text-muted">Điểm nhận</div>
            <div className="text-lg font-bold text-green-600">+{summary.earned.toLocaleString("vi-VN")}</div>
          </div>
          <div className="rounded-xl border border-border-default bg-bg-card p-3">
            <div className="text-xs text-text-muted">Điểm tiêu</div>
            <div className="text-lg font-bold text-red-500">-{summary.spent.toLocaleString("vi-VN")}</div>
          </div>
          <div className="rounded-xl border border-border-default bg-bg-card p-3">
            <div className="text-xs text-text-muted">Chênh lệch</div>
            <div className={`text-lg font-bold ${summary.balanceDelta >= 0 ? "text-emerald-600" : "text-rose-500"}`}>
              {summary.balanceDelta >= 0 ? "+" : ""}{summary.balanceDelta.toLocaleString("vi-VN")}
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border-default">
          <SWTTable
            columns={columns}
            dataSource={rows}
            rowKey="id"
            loading={isLoading}
            pagination={false}
          />
        </div>
      </div>
    </SWTDrawer>
  );
}
