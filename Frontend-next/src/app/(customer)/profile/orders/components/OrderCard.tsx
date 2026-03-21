"use client";

import { Divider } from "antd";
import { OrderDTO } from "@/src/services/models/customer/order.dto";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import SWTCard from "@/src/@core/component/AntD/SWTCard";
import OrderStatusTag from "./OrderStatusTag";
import Image from "next/image";

interface Props {
  order: OrderDTO;
}

export default function OrderCard({ order }: Props) {
  const firstItem = order.items[0];
  const otherItemsCount = order.items.length - 1;

  return (
    <SWTCard className="!mb-4 !rounded-2xl !border-none !shadow-sm overflow-hidden hover:shadow-md transition-shadow" bodyClassName="p-0">
      {/* Order Header */}
      <div className="px-6 py-4 flex items-center justify-between bg-gray-50/50">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-gray-900">{order.order_code}</span>
          <Divider type="vertical" />
          <span className="text-xs text-gray-500">
            Ngày: {new Date(order.created_at).toLocaleDateString("vi-VN")}
          </span>
        </div>
        <OrderStatusTag status={order.status} />
      </div>

      {/* Order Items Preview */}
      <div className="px-6 py-4">
        <div className="flex gap-4">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-100 shrink-0">
            <Image 
              src={firstItem.product_image} 
              alt={firstItem.product_name} 
              fill 
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-gray-900 truncate">{firstItem.product_name}</h4>
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-gray-500">
                {firstItem.variant_name && <span className="mr-2">Phân loại: {firstItem.variant_name}</span>}
                x{firstItem.quantity}
              </span>
              <span className="text-sm font-bold text-brand-500">
                {firstItem.price.toLocaleString("vi-VN")}₫
              </span>
            </div>
            {otherItemsCount > 0 && (
              <p className="text-[10px] text-gray-400 mt-2 font-medium italic">
                và {otherItemsCount} sản phẩm khác...
              </p>
            )}
          </div>
        </div>
      </div>

      <Divider className="!my-0" />

      {/* Order Footer */}
      <div className="px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">Tổng thanh toán:</p>
          <p className="text-lg font-bold text-brand-600">
            {order.total_amount.toLocaleString("vi-VN")}₫
          </p>
        </div>
        <div className="flex gap-2">
          <SWTButton 
            type="text" 
            className="!text-xs !font-bold !text-gray-500 hover:!text-brand-500"
          >
            Chi tiết
          </SWTButton>
          {(order.status === "COMPLETED" || order.status === "CANCELLED") && (
            <SWTButton 
              type="primary" 
              className="!text-xs !font-bold !bg-brand-500 !rounded-full !px-4"
            >
              Mua lại
            </SWTButton>
          )}
        </div>
      </div>
    </SWTCard>
  );
}
