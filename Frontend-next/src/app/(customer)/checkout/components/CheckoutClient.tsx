"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CheckoutForm from "./CheckoutForm";
import CheckoutSummary from "./CheckoutSummary";
import SWTBreadcrumb from "@/src/@core/component/AntD/SWTBreadcrumb";
import { showNotificationError, showNotificationSuccess } from "@/src/@core/utils/message";
import { checkoutService } from "@/src/services/customer/checkout/checkout.service";

export default function CheckoutClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentHandledRef = useRef(false);

  useEffect(() => {
    if (paymentHandledRef.current) return;

    const status = searchParams.get("payment_status") || searchParams.get("status");
    const orderId = searchParams.get("orderId") || searchParams.get("order_id");
    if (!status && !orderId) return;

    paymentHandledRef.current = true;

    const normalizedStatus = String(status || "").toUpperCase();
    if (normalizedStatus === "CANCELLED" || normalizedStatus === "FAILED") {
      if (orderId) {
        void checkoutService.cancelUnpaidOrder(orderId).catch((error: unknown) => {
          console.error("Cancel unpaid order error:", error);
        });
      }

      showNotificationError("Giao dịch SEPay không thành công. Đơn chưa thanh toán đã được xóa.");
    } else if (normalizedStatus === "SUCCESS") {
      showNotificationSuccess("Thanh toán SEPay thành công.");
    }

    const params = new URLSearchParams(searchParams.toString());
    ["status", "orderId", "order_id", "payment_status", "result", "sign", "signature", "mac", "amount"].forEach(
      (key) => params.delete(key)
    );

    const query = params.toString();
    router.replace(query ? `/checkout?${query}` : "/checkout");
  }, [router, searchParams]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <SWTBreadcrumb
        items={[
          { title: "Trang chủ", href: "/" },
          { title: "Thanh toán" },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        <div className="lg:col-span-7">
          <CheckoutForm />
        </div>
        <div className="lg:col-span-5">
          <div className="sticky top-24">
            <CheckoutSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
