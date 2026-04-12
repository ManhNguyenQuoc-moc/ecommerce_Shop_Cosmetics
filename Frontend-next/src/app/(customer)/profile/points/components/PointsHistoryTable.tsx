"use client";

import SWTCard from "@/src/@core/component/AntD/SWTCard";
import SWTTable from "@/src/@core/component/AntD/SWTTable";
import { Tag } from "antd";
import { PointLogDTO } from "@/src/services/models/customer/point.dto";

import { useMemo } from "react";

interface Props {
  history: PointLogDTO[];
  loading?: boolean;
}

export default function PointsHistoryTable({ history, loading }: Props) {
  const columns = useMemo(() => [
    {
      title: "Ngày giao dịch",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => (
        <span className="text-gray-500 text-sm whitespace-nowrap">{new Date(date).toLocaleString("vi-VN")}</span>
      ),
    },
    {
      title: "Nội dung",
      dataIndex: "reason",
      key: "reason",
      render: (text: string) => <span className="text-gray-800 font-medium text-sm line-clamp-1">{text}</span>,
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      width: 120,
      render: (type: string) => {
        const configs: any = {
          EARN: { color: "green", label: "Tích điểm" },
          SPEND: { color: "volcano", label: "Đổi điểm" },
          REFUND: { color: "blue", label: "Hoàn điểm" },
          EXPIRE: { color: "gray", label: "Hết hạn" },
        };
        const config = configs[type] || configs.EARN;
        return <Tag color={config.color} className="!rounded-full !px-3 font-medium border-none !m-0 !text-[11px] whitespace-nowrap">{config.label}</Tag>;
      },
    },
    {
      title: "Điểm",
      dataIndex: "amount",
      key: "amount",
      align: "right" as const,
      width: 100,
      render: (amount: number) => {
        const isPositive = amount > 0;
        return (
          <span className={`text-base font-bold whitespace-nowrap ${isPositive ? "text-green-500" : "text-red-500"}`}>
            {isPositive ? "+" : ""}{amount.toLocaleString("vi-VN")}
          </span>
        );
      },
    },
  ], []);

  return (
    <SWTCard className="!mt-6 !rounded-2xl !border-none !shadow-sm overflow-hidden" bodyClassName="p-0">
      <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
        <h3 className="font-bold text-gray-900">Lịch sử giao dịch điểm</h3>
      </div>
      <SWTTable
        dataSource={history}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{
          totalCount: history.length,
          page: 1,
          fetch: 5,
          onChange: () => { }
        }}
      />
    </SWTCard>
  );
}

