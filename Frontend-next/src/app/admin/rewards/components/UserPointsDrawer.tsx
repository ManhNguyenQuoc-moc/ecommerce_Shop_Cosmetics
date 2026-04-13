import React from "react";
import SWTDrawer from "@/src/@core/component/AntD/SWTDrawer";
import SWTTable from "@/src/@core/component/AntD/SWTTable";
import { usePointHistory } from "@/src/hooks/admin/user.hook";

interface UserPointsDrawerProps {
  open: boolean;
  onClose: () => void;
  userId: string | null;
  userName?: string;
}

export default function UserPointsDrawer({ open, onClose, userId, userName }: UserPointsDrawerProps) {
  const { history, isLoading } = usePointHistory(userId);

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
      render: (amount: number, record: any) => (
        <span className={`font-bold ${record.type === 'EARN' ? 'text-green-500' : 'text-red-500'}`}>
          {record.type === 'EARN' ? `+${amount}` : `-${amount}`}
        </span>
      ),
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      key: "reason",
    },
  ];

  return (
    <SWTDrawer
      title={`Lịch sử giao dịch điểm - ${userName || "Khách hàng"}`}
      width={700}
      open={open}
      onClose={onClose}
    >
      <SWTTable
        columns={columns}
        dataSource={history}
        rowKey="id"
        loading={isLoading}
        pagination={false}
      />
    </SWTDrawer>
  );
}
