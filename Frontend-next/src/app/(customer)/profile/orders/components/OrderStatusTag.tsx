"use client";

import { Tag } from "antd";
import React from "react";
import SWTTag from "@/src/@core/component/AntD/SWTTag";
import { OrderStatus } from "@/src/services/models/customer/order.dto";

interface Props {
  status: OrderStatus;
}

export default function OrderStatusTag({ status }: Props) {
  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return { label: "Chờ xác nhận", color: "blue", className: "bg-blue-50 text-blue-600 border-blue-100" };
      case "CONFIRMED":
        return { label: "Đã xác nhận", color: "orange", className: "bg-orange-50 text-orange-600 border-orange-100" };
      case "SHIPPING":
        return { label: "Đang giao hàng", color: "cyan", className: "bg-cyan-50 text-cyan-600 border-cyan-100" };
      case "DELIVERED":
        return { label: "Hoàn tất", color: "green", className: "bg-green-50 text-green-600 border-green-100" };
      case "CANCELLED":
        return { label: "Đã hủy", color: "red", className: "bg-red-50 text-red-600 border-red-100" };
      case "RETURNED":
        return { label: "Trả hàng", color: "magenta", className: "bg-magenta-50 text-magenta-600 border-magenta-100" };
      default:
        return { label: status, color: "default", className: "" };
    }
  };

  const config = getStatusConfig(status);

  return (
    <SWTTag 
        color={config.color} 
        className={`!rounded-full !px-4 !py-1 !font-black !text-[11px] uppercase tracking-tighter ${config.className}`}
    >
      {config.label}
    </SWTTag>
  );
}
