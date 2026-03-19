"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCheckoutStore } from "@/src/stores/useCheckoutStore";
import { useCartStore } from "@/src/stores/useCartStore";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import { showMessageSuccess, showMessageError } from "@/src/@core/utils/message";
import SWTCard from "@/src/@core/component/AntD/SWTCard";
import SWTSelect from "@/src/@core/component/AntD/SWTSelect";
import { checkoutService } from "@/src/services/customer/checkout.service";
import { CheckoutRequestDTO } from "@/src/services/models/checkout/input.dto";
import {Modal} from "antd";
export default function CheckoutSummary() {
  const [loadingPay, setLoadingPay] = useState(false);
   const [confirmOpen, setConfirmOpen] = useState(false); // 👈 thêm
  const router = useRouter();
  const {
    items,
    customer,
    selectedAddress,
    shippingMethod,
    paymentMethod,
    mode,
    reset,
    setPayment,
    setShipping,
  } = useCheckoutStore();

  const clearCart = useCartStore((state) => state.clearCart);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shippingFee = shippingMethod === "express" ? 30000 : 0;
  const total = subtotal + shippingFee;

  const handleCheckout = async () => {
    if (!items.length) {
      showMessageError("Không có sản phẩm trong đơn hàng");
      return;
    }

    if (!customer.name || !customer.phone || !selectedAddress) {
      showMessageError("Vui lòng nhập đầy đủ thông tin giao hàng");
      return;
    }
    
    try {
      setLoadingPay(true);

      const payload: CheckoutRequestDTO = {
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          productName: i.productName,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
        })),
        customer: {
          name: customer.name,
          phone: customer.phone,
        },
        address: {
          address: selectedAddress.address,
          lat: selectedAddress.lat,
          lon: selectedAddress.lon,
        },
        total,
        paymentMethod,
      };
      const res = await checkoutService.createOrder(payload);
      if (res?.paymentUrl) {
        window.location.href = res.paymentUrl;
        return;
      }
      showMessageSuccess("Đặt hàng thành công 🎉");
      if (mode === "cart" && typeof clearCart === "function") {
        clearCart();
      }
      
      reset();
      router.push("/");
    } catch (err) {
      console.error("Checkout error:", err);
      showMessageError("Đã có lỗi xảy ra trong quá trình thanh toán");
    } finally {
      setLoadingPay(false);
    }
  };
   const handleConfirm = async () => {
    setConfirmOpen(false);
    await handleCheckout();
  };
  return (
    <SWTCard className="!border-none !shadow-md !rounded-2xl !p-6 flex flex-col gap-5">
      <h2 className="text-lg font-bold text-gray-800 uppercase tracking-tight">
        Tóm tắt đơn hàng
      </h2>
      <div className="flex flex-col gap-3 max-h-64 overflow-auto pr-1">
        {items.map((item, index) => (
          <div
            key={item.variantId || item.productId || index}
            className="flex gap-3 items-center border-b pb-3 last:border-none"
          >
            <div className="relative w-14 h-14 rounded-lg border bg-white overflow-hidden shrink-0">
              <Image
                src={item.image || "/placeholder.png"}
                alt={item.productName}
                fill
                className="object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 line-clamp-2">
                {item.productName}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                SL: {item.quantity}
              </p>
            </div>
            <div className="text-sm font-semibold whitespace-nowrap">
              {(item.price * item.quantity).toLocaleString()}đ
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-1 mb-3">
        <p className="text-sm font-medium text-gray-700">
          Phương thức giao hàng
        </p>
        <SWTSelect
          value={shippingMethod}
          onChange={(v) => setShipping(v)}
          allowClear={false}
          className="w-full"
          options={[
            { value: "standard", label: "Tiêu chuẩn (0đ)" },
            { value: "express", label: "Nhanh (30.000đ)" },
          ]}
        />
      </div>

      <div className="flex flex-col gap-1 mb-3">
        <p className="text-sm font-medium text-gray-700">
          Phương thức thanh toán
        </p>
        <SWTSelect
          value={paymentMethod}
          onChange={(v) => setPayment(v)}
          allowClear={false}
          className="w-full"
          options={[
            { value: "cod", label: "Thanh toán khi nhận hàng (COD)" },
            { value: "bank", label: "Chuyển khoản / Online" },
          ]}
        />
      </div>

      <div className="flex flex-col gap-2 text-sm text-gray-600 border-t pt-3">
        <div className="flex justify-between">
          <span>Tạm tính</span>
          <span className="font-medium text-gray-800">
            {subtotal.toLocaleString()}đ
          </span>
        </div>
        <div className="flex justify-between">
          <span>Phí giao hàng</span>
          <span className="font-medium text-gray-800">
            {shippingFee.toLocaleString()}đ
          </span>
        </div>
      </div>

      <div className="flex justify-between font-bold text-lg text-gray-900 mt-3">
        <span>Tổng cộng</span>
        <span>{total.toLocaleString()}đ</span>
      </div>

      <SWTButton
        loading={loadingPay}
        disabled={!items.length}
       onClick={() => setConfirmOpen(true)}
        className="w-full py-4 text-base font-bold !bg-brand-500 !text-white hover:!bg-brand-600 rounded-xl transition shadow-md my-3"
      >
        {paymentMethod === "bank" ? "Thanh toán ngay" : "Đặt hàng ngay"}
      </SWTButton>
      <Modal
  width={600}
  open={confirmOpen}
  onOk={handleConfirm}
  onCancel={() => setConfirmOpen(false)}
  confirmLoading={loadingPay}
  styles={{
    body: {
      padding: "24px",
    },
  }}
  footer={
    <div className="flex justify-end gap-3 p-5">
      <button
        onClick={() => setConfirmOpen(false)}
        className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
      >
        Huỷ
      </button>
      <button
        onClick={handleConfirm}
        className="px-5 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold"
      >
        Xác nhận
      </button>
    </div>
  }
    >
    <div className="max-h-[400px] overflow-auto">
      <h1 className ="font-bold">Xác nhận đặt hàng</h1>
    <p>Bạn có chắc chắn muốn đặt đơn hàng này không?</p>
    <p className="mt-2 text-black-500 text-sm">
      Tổng tiền: <b className="text-orange-600">{total.toLocaleString()}đ</b>
    </p>
  </div>
</Modal>
    </SWTCard>
  );
}