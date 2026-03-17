"use client";

import { Input } from "antd";
import { useCheckoutStore } from "@/src/stores/useCheckoutStore";

export default function CheckoutForm() {
  const info = useCheckoutStore((s) => s.info);
  const setInfo = useCheckoutStore((s) => s.setInfo);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Thông tin khách hàng</h2>

      <Input
        placeholder="Họ tên"
        value={info.name}
        onChange={(e) => setInfo({ name: e.target.value })}
      />

      <Input
        placeholder="Số điện thoại"
        value={info.phone}
        onChange={(e) => setInfo({ phone: e.target.value })}
      />

      <Input.TextArea
        placeholder="Địa chỉ"
        value={info.address}
        onChange={(e) => setInfo({ address: e.target.value })}
      />
    </div>
  );
}