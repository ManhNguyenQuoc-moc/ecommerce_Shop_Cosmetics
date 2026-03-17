"use client";

import { Radio } from "antd";
import { useCheckoutStore } from "@/src/stores/useCheckoutStore";

export default function ShippingMethod() {
  const shipping = useCheckoutStore((s) => s.shippingMethod);
  const setShipping = useCheckoutStore((s) => s.setShipping);

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Phương thức giao hàng</h2>

      <Radio.Group
        value={shipping}
        onChange={(e) => setShipping(e.target.value)}
      >
        <div className="flex flex-col gap-2">
          <Radio value="standard">Giao hàng tiêu chuẩn (Free)</Radio>
          <Radio value="express">Giao nhanh (+30.000đ)</Radio>
        </div>
      </Radio.Group>
    </div>
  );
}