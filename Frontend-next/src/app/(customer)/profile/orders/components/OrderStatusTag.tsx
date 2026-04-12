"use client";
import { OrderStatus } from "@/src/services/models/customer/order.dto";
import SWTStatusTag from "@/src/@core/component/SWTStatusTag";

interface Props {
  status: OrderStatus;
  className?: string;
}
export default function OrderStatusTag({ status, className }: Props) {
  return (
    <SWTStatusTag 
      status={status} 
      className={className}
    />
  );
}
