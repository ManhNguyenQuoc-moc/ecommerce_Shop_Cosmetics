"use client";

import SWTTable from "@/src/@core/component/AntD/SWTTable";
import SWTCard from "@/src/@core/component/AntD/SWTCard";
import CartItemProduct from "./CartItemProduct";
import CartQuantity from "./CartQuantity";

import { useCartStore } from "@/src/stores/useCartStore";
import type { ColumnsType } from "antd/es/table";

export default function CartTable() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const columns: ColumnsType<any> = [
    {
      title: "Sản phẩm",
      width: "40%",
      render: (_, record) => (
        <CartItemProduct
          item={record}
          onRemove={removeItem}
          outOfStock={record.stock === 0}
        />
      ),
    },
    {
      title: "Giá tiền",
      align: "center",
      width: "15%",
      render: (_, record) => (
        <div>
          <p className="font-semibold text-sm">
            {record.price.toLocaleString()} đ
          </p>
          {record.originalPrice && (
            <p className="text-sm line-through text-gray-400">
              {record.originalPrice.toLocaleString()} đ
            </p>
          )}
        </div>
      ),
    },
    {
      title: "Số lượng",
      width: "15%",
      align: "center",
      render: (_, record) => (
        <CartQuantity
          quantity={record.quantity}
          onChange={(val) => {
          const quantity = Number(val) || 1; 
          updateQuantity(record.id, quantity);
          }}
        />
      ),
    },
  ];

  return (
    <SWTCard className="rounded-lg">
      <SWTTable
        rowKey="id"
        columns={columns}
        dataSource={items}
         scroll={{ x: "max-content" }}
      />
    </SWTCard>
  );
}