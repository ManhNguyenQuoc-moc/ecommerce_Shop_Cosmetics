"use client";

import { CartItem } from "./CartTable";

type Props = {
  items: CartItem[];
};

export default function CartSummary({ items }: Props) {

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="bg-white border rounded-lg p-4 space-y-4">

      <h2 className="font-semibold text-lg">
        Hóa đơn của bạn
      </h2>

      <div className="flex justify-between text-sm">
        <span>Tạm tính:</span>
        <span>{subtotal.toLocaleString()} đ</span>
      </div>

      <div className="flex justify-between text-sm">
        <span>Giảm giá:</span>
        <span>0 đ</span>
      </div>

      <div className="border-t pt-3 flex justify-between font-semibold">
        <span>Tổng cộng:</span>
        <span className="text-orange-500">
          {subtotal.toLocaleString()} đ
        </span>
      </div>

      <button className="w-full bg-orange-500 text-white py-3 rounded">
        Tiến hành đặt hàng
      </button>

    </div>
  );
}