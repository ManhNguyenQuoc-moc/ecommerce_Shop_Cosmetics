"use client";

import { Tag } from "antd";
import { 
  ClockCircleOutlined, 
  SyncOutlined, 
  CarOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  RollbackOutlined 
} from "@ant-design/icons";
import { OrderStatus } from "@/src/services/models/customer/order.dto";

interface Props {
  status: OrderStatus;
}

export default function OrderStatusTag({ status }: Props) {
  const configs: Record<OrderStatus, { color: string; icon: any; label: string }> = {
    PENDING: {
      color: "default",
      icon: <ClockCircleOutlined />,
      label: "Chờ xác nhận",
    },
    PROCESSING: {
      color: "blue",
      icon: <SyncOutlined spin />,
      label: "Đang xử lý",
    },
    SHIPPING: {
      color: "warning",
      icon: <CarOutlined />,
      label: "Đang giao hàng",
    },
    COMPLETED: {
      color: "success",
      icon: <CheckCircleOutlined />,
      label: "Đã hoàn thành",
    },
    CANCELLED: {
      color: "error",
      icon: <CloseCircleOutlined />,
      label: "Đã huỷ",
    },
    RETURNED: {
      color: "purple",
      icon: <RollbackOutlined />,
      label: "Trả hàng/Hoàn tiền",
    },
  };

  const config = configs[status] || configs.PENDING;

  return (
    <Tag 
      color={config.color} 
      icon={config.icon}
      className="!rounded-full !px-3 font-medium border-none py-0.5"
    >
      {config.label}
    </Tag>
  );
}
