"use client";
import Image from "next/image";
import { useCartStore } from "@/src/stores/useCartStore";
import { useCheckoutStore } from "@/src/stores/useCheckoutStore";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import { showMessageSuccess, showMessageError } from "@/src/@core/utils/message";

export default function CheckoutSummary() {
  const mode = useCheckoutStore((s) => s.mode);
  const checkoutItems = useCheckoutStore((s) => s.items);
  const { info, shippingMethod } = useCheckoutStore();

  const cartItems = useCartStore((s) => s.items);

  const clearCart = useCartStore((s) => s.clearCart);

  const items = mode === "buy_now" ? checkoutItems : cartItems;
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shippingFee = shippingMethod === "express" ? 30000 : 0;
  const total = subtotal + shippingFee;

  const handleCheckout = async () => {
    if (!items.length) {
      showMessageError("Không có sản phẩm trong giỏ hàng");
      return;
    }
    if (!info.name || !info.phone || !info.address) {
      showMessageError("Vui lòng nhập đầy đủ thông tin giao hàng");
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
      showMessageError("Đặt hàng thất bại, vui lòng thử lại");
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-xl space-y-6 sticky top-24">
      <h2 className="text-xl font-semibold text-gray-800">Tóm tắt đơn hàng</h2>
      <div className="space-y-4 max-h-64 overflow-auto pr-2">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 items-center border-b pb-3">
            <div className="relative w-16 h-16 rounded-lg border bg-white overflow-hidden shrink-0">
              <Image
                src={item.image || "/placeholder.png"}
                alt={item.productName}
                fill
                className="object-contain p-1"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 line-clamp-2">
                {item.productName}
              </p>
              <p className="text-xs text-gray-500 mt-1">SL: {item.quantity}</p>
            </div>
            <div className="text-sm font-semibold whitespace-nowrap">
              {(item.price * item.quantity).toLocaleString()}đ
            </div>
          </div>
        ))}
      </div>

      {/* TÍNH TIỀN */}
      <div className="space-y-3 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Tạm tính giỏ hàng</span>
          <span className="font-medium text-gray-800">{subtotal.toLocaleString()}đ</span>
        </div>
        <div className="flex justify-between">
          <span>Phí giao hàng</span>
          <span className="font-medium text-gray-800">{shippingFee.toLocaleString()}đ</span>
        </div>
        <div className="flex justify-between">
          <span>Thuế VAT</span>
          <span className="font-medium text-gray-800">0đ</span>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-xl text-gray-900">
        <span>Tổng cộng</span>
        <span>{total.toLocaleString()}đ</span>
      </div>
      <div className="flex gap-2">
        <input 
          type="text" 
          placeholder="Nhập mã giảm giá..." 
          className="flex-1 p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
        />
        <button className="px-5 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition">
          Áp dụng
        </button>
      </div>
      <SWTButton
        disabled={!items.length}
        onClick={handleCheckout}
        className="w-full py-4 text-lg font-bold !bg-black !text-white hover:!bg-gray-900 rounded-lg transition shadow-lg"
      >
        Tiến hành Đặt hàng
      </SWTButton>
    </div>
  );
}