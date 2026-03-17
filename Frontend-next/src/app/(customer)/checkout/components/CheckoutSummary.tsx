"use client";
import { useCartStore } from "@/src/stores/useCartStore";
import { useCheckoutStore } from "@/src/stores/useCheckoutStore";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import {
  showMessageSuccess,
  showMessageError,
} from "@/src/@core/utils/message";



export default function CheckoutSummary() {

  const mode = useCheckoutStore((s) => s.mode);
  const checkoutItems = useCheckoutStore((s) => s.items);
  const { info, shippingMethod } = useCheckoutStore();
  const cartItems = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const items = mode === "buy_now" ? checkoutItems : cartItems;
  const subtotal = items.reduce(
    (sum, i) => sum + i.price * i.quantity,

    0

  );
  const shippingFee = shippingMethod === "express" ? 30000 : 0;
  const total = subtotal + shippingFee;
  const handleCheckout = async () => {
    if (!items.length) {
      showMessageError("Không có sản phẩm");
      return;
    }
    if (!info.name || !info.phone || !info.address) {
      showMessageError("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    try {
      await new Promise((res) => setTimeout(res, 1000));
      showMessageSuccess("Đặt hàng thành công 🎉");
      if (mode === "cart") {
        clearCart();
      }
      useCheckoutStore.getState().reset();
    } catch {
      showMessageError("Đặt hàng thất bại");

    }
  };
  return (
    <div className="bg-white p-5 rounded-xl shadow space-y-4 sticky top-24">
      <h2 className="text-lg font-semibold">
        Đơn hàng
      </h2>
      {/* ITEMS */}
      <div className="space-y-2 max-h-64 overflow-auto">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between text-sm"
          >
            <span className="line-clamp-1">
              {item.productName} x{item.quantity}
            </span>
            <span>
              {(item.price * item.quantity).toLocaleString()}đ
            </span>
          </div>
        ))}
      </div>
      <div className="border-t pt-3 text-sm space-y-1">
        <div className="flex justify-between">
          <span>Tạm tính</span>
          <span>{subtotal.toLocaleString()}đ</span>
        </div>
        <div className="flex justify-between">
          <span>Phí ship</span>
          <span>{shippingFee.toLocaleString()}đ</span>
        </div>
      </div>
      <div className="flex justify-between font-bold text-lg">
        <span>Tổng</span>
        <span className="text-red-500">
          {total.toLocaleString()}đ
        </span>
      </div>
      {/* BUTTON */}
      <SWTButton
        disabled={!items.length}
        onClick={handleCheckout}
        className="w-full h-11 !bg-brand-500 !text-white"
      >
        Đặt hàng
      </SWTButton>
    </div>
  );
}