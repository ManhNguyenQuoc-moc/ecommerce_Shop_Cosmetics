"use client";

import { Radio } from "antd";
import { useCheckoutStore } from "@/src/stores/useCheckoutStore";

export default function PaymentMethod() {
  const payment = useCheckoutStore((s) => s.paymentMethod);
  const setPayment = useCheckoutStore((s) => s.setPayment);

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Thanh toán</h2>

      <Radio.Group
        value={payment}
        onChange={(e) => setPayment(e.target.value)}
      >
        <div className="flex flex-col gap-2">
          <Radio value="cod">Thanh toán khi nhận hàng (COD)</Radio>
          <Radio value="bank">Chuyển khoản</Radio>
        </div>
      </Radio.Group>
    </div>
  );
}