"use client";

import { Radio } from "antd";
import { useCheckoutStore } from "@/src/stores/useCheckoutStore";

export default function PaymentMethod() {
  const payment = useCheckoutStore((s) => s.paymentMethod);
  const setPayment = useCheckoutStore((s) => s.setPayment);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Phương thức thanh toán</h2>

      <Radio.Group
        className="w-full flex flex-col gap-3"
        value={payment}
        onChange={(e) => setPayment(e.target.value)}
      >
        {/* Tùy chọn 1 */}
        <div className={`border rounded-lg p-4 cursor-pointer transition ${payment === "cod" ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}`}>
          <Radio value="cod" className="w-full font-medium">
            Thanh toán khi nhận hàng (COD)
          </Radio>
          {payment === "cod" && (
            <p className="text-sm text-gray-500 mt-2 ml-6">
              Bạn sẽ thanh toán bằng tiền mặt khi nhận được sản phẩm.
            </p>
          )}
        </div>

        {/* Tùy chọn 2 */}
        <div className={`border rounded-lg p-4 cursor-pointer transition ${payment === "bank" ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}`}>
          <Radio value="bank" className="w-full font-medium flex justify-between">
            <span>Chuyển khoản ngân hàng</span>
          </Radio>
          {payment === "bank" && (
            <div className="mt-3 ml-6 space-y-2">
               <input type="text" placeholder="Số tài khoản" className="w-full p-2 border rounded-md text-sm" disabled />
               <input type="text" placeholder="Tên tài khoản" className="w-full p-2 border rounded-md text-sm" disabled />
            </div>
          )}
        </div>

        {/* Tùy chọn 3 (Mock Trả sau/tabby) */}
        <div className="border border-gray-300 rounded-lg p-4 flex items-center justify-between opacity-50 cursor-not-allowed">
           <Radio value="installments" disabled>Trả góp (Coming soon)</Radio>
           <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">tabby</span>
        </div>
      </Radio.Group>
    </div>
  );
}