"use client";

import CheckoutForm from "./CheckoutForm";
import CheckoutSummary from "./CheckoutSummary";
import SWTBreadcrumb from "@/src/@core/component/AntD/SWTBreadcrumb";

export default function CheckoutClient() {
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
          <div>
            <CheckoutSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
