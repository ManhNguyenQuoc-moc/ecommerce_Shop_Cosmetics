"use client";

import SWTTable from "@/src/@core/component/AntD/SWTTable";
import CartItemProduct from "./CartItemProduct";
import CartQuantity from "./CartQuantity";

export type CartItem = {
  id: string;
  productId: string;
  variantId: string;

  productName: string;
  brand: string;
  image: string;

  price: number;
  originalPrice?: number;

  quantity: number;
};

type Props = {
  items: CartItem[];
};

export default function CartTable({ items }: Props) {

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "product",
      render: (_: unknown, record: CartItem) => (
        <CartItemProduct item={record} />
      ),
    },
    {
      title: "Giá tiền",
      align: "center",
      render: (_: unknown, record: CartItem) => (
        <div>
          <p className="font-semibold">
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
      align: "center",
      render: (_: unknown, record: CartItem) => (
        <CartQuantity quantity={record.quantity} />
      ),
    },
    {
      title: "Thành tiền",
      align: "right",
      render: (_: unknown, record: CartItem) => (
        <span className="font-semibold">
          {(record.price * record.quantity).toLocaleString()} đ
        </span>
      ),
    },
  ];

  return (
    <div className="bg-white border rounded-lg">
      <SWTTable
        rowKey="id"
        columns={columns}
        dataSource={items}
      />
    </div>
  );
}