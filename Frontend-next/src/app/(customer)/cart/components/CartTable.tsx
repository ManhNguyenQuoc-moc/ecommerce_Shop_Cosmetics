"use client";

import SWTTable from "@/src/@core/component/AntD/SWTTable";
import SWTCard from "@/src/@core/component/AntD/SWTCard";
import CartItemProduct from "./CartItemProduct";
import CartQuantity from "./CartQuantity";
import { useCart } from "@/src/services/customer/cart/cart.hook";
import type { ColumnsType } from "antd/es/table";
import { CartItem } from "@/src/stores/useCartStore";

type CartTableProps = {
  selectedItemIds: string[];
  onSelectionChange: (ids: string[]) => void;
};

export default function CartTable({ selectedItemIds, onSelectionChange }: CartTableProps) {
  const { items, updateQuantity, removeItem } = useCart();

  const columns: ColumnsType<CartItem> = [
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
            <p className="text-sm line-through text-text-muted">
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
          max={record.availableStock}
          onChange={(val) => {
            const quantity = Number(val) || 1;
            updateQuantity(record.id, record.variantId, quantity);
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
        rowSelection={{
          selectedRowKeys: selectedItemIds,
          onChange: (keys) => onSelectionChange(keys as string[]),
          getCheckboxProps: (record: CartItem) => ({
            disabled: record.stock === 0 || record.availableStock === 0,
          }),
        }}
        scroll={{ x: "max-content" }}
      />
    </SWTCard>
  );
}