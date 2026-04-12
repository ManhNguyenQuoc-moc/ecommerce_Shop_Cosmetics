"use client";
import Image from "next/image";
import { useState } from "react";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import SWTCard from "@/src/@core/component/AntD/SWTCard";
import SWTSelect from "@/src/@core/component/AntD/SWTSelect";
import { Modal } from "antd";
import { useCheckout } from "@/src/hooks/useCheckout";

export default function CheckoutSummary() {
  const [loadingPay, setLoadingPay] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const {
    items,
    paymentMethod,
    shippingMethod,
    setPayment,
    setShipping,
    calculateSubtotal,
    calculateShipping,
    calculateTotal,
    placeOrder,
  } = useCheckout();

  const subtotal = calculateSubtotal();
  const shippingFee = calculateShipping();
  const total = calculateTotal();

  const handleConfirm = async () => {
    setConfirmOpen(false);
    setLoadingPay(true);
    try {
      await placeOrder();
    } finally {
      setLoadingPay(false);
    }
  };

  return (
    <SWTCard className="!border border-border-default !shadow-md !rounded-2xl !p-6 !bg-bg-card flex flex-col gap-5">
      <h2 className="text-lg font-extrabold text-text-main uppercase tracking-tight">
        Tóm tắt đơn hàng
      </h2>
      <div className="flex flex-col gap-3 max-h-64 overflow-auto pr-1">
        {items.map((item, index) => (
          <div
            key={item.variantId || item.productId || index}
            className="flex gap-3 items-center border-b border-border-default pb-3 last:border-none"
          >
            <div className="relative w-14 h-14 rounded-lg border border-border-default bg-bg-muted overflow-hidden shrink-0">
              <Image
                src={item.image || "/placeholder.png"}
                alt={item.productName}
                fill
                className="object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-text-main line-clamp-2">
                {item.productName}
              </p>
              <p className="text-xs text-text-muted mt-1 font-bold">
                SL: {item.quantity}
              </p>
            </div>
            <div className="text-sm font-black text-text-main whitespace-nowrap">
              {(item.price * item.quantity).toLocaleString()}đ
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-1 mb-3">
        <p className="text-sm font-bold text-text-sub uppercase tracking-wider">
          Phương thức giao hàng
        </p>
        <SWTSelect
          value={shippingMethod}
          onChange={(v: any) => setShipping(v)}
          allowClear={false}
          className="w-full"
          options={[
            { value: "standard", label: "Tiêu chuẩn (0đ)" },
            { value: "express", label: "Nhanh (30.000đ)" },
          ]}
        />
      </div>

      <div className="flex flex-col gap-1 mb-3">
        <p className="text-sm font-bold text-text-sub uppercase tracking-wider">
          Phương thức thanh toán
        </p>
        <SWTSelect
          value={paymentMethod}
          onChange={(v: any) => setPayment(v)}
          allowClear={false}
          className="w-full"
          options={[
            { value: "COD", label: "Thanh toán khi nhận hàng (COD)" },
            { value: "VNPAY", label: "Chuyển khoản / Online" },
          ]}
        />
      </div>

      <div className="flex flex-col gap-2 text-sm text-text-muted border-t border-border-default pt-3">
        <div className="flex justify-between">
          <span>Tạm tính</span>
          <span className="font-bold text-text-sub">
            {subtotal.toLocaleString()}đ
          </span>
        </div>
        <div className="flex justify-between">
          <span>Phí giao hàng</span>
          <span className="font-bold text-text-sub">
            {shippingFee.toLocaleString()}đ
          </span>
        </div>
      </div>

      <div className="flex justify-between font-black text-xl text-text-main mt-3">
        <span className="uppercase tracking-tighter italic">Tổng cộng</span>
        <span className="text-brand-500">{total.toLocaleString()}đ</span>
      </div>

      <SWTButton
        loading={loadingPay}
        disabled={!items.length}
        onClick={() => setConfirmOpen(true)}
        className="w-full py-4 text-base font-bold !bg-brand-500 !text-white hover:!bg-brand-600 rounded-xl transition shadow-md my-3"
      >
        {paymentMethod === "VNPAY" ? "Thanh toán ngay" : "Đặt hàng ngay"}
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
              className="px-5 py-2 rounded-lg bg-bg-muted hover:opacity-80 text-text-sub font-bold transition-all"
            >
              Huỷ
            </button>
            <button
              onClick={handleConfirm}
              className="px-5 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-bold shadow-lg transition-all"
            >
              Xác nhận
            </button>
          </div>
        }
      >
        <div className="max-h-[400px] overflow-auto">
          <h1 className="font-black text-2xl text-text-main uppercase tracking-tight">Xác nhận đặt hàng</h1>
          <p className="text-text-sub font-medium">Bạn có chắc chắn muốn đặt đơn hàng này không?</p>
          <div className="mt-4 p-4 bg-bg-muted rounded-xl border border-border-default italic text-text-muted text-sm shadow-inner">
            Lưu ý: Bạn nên kiểm tra kỹ địa chỉ và số điện thoại nhận hàng trước khi xác nhận.
          </div>
          <p className="mt-6 text-text-main font-bold text-lg flex justify-between items-center bg-bg-muted p-4 rounded-2xl border border-border-default">
            <span className="uppercase tracking-widest text-xs text-text-muted">Tổng số tiền:</span>
            <b className="text-brand-500 text-3xl font-black">{total.toLocaleString()}đ</b>
          </p>
        </div>
      </Modal>
    </SWTCard>
  );
}