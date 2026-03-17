"use client";

import CheckoutForm from "./components/CheckoutForm";
import ShippingMethod from "./components/ShippingMethod";
import PaymentMethod from "./components/PaymentMethod";
import CheckoutSummary from "./components/CheckoutSummary";
import SWTBreadcrumb from "@/src/@core/component/AntD/SWTBreadcrumb";
import OrderItems from "./components/OrderItems";
export default function CheckoutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

      <SWTBreadcrumb
        items={[
          { title: "Trang chủ", href: "/" },
          { title: "Thanh toán" },
        ]}
      />

      <h1 className="text-2xl font-semibold">
        Thanh toán
      </h1>

      <div className="grid grid-cols-12 gap-6">


  {/* LEFT */}
  <div className="col-span-12 lg:col-span-8 space-y-6">

    <OrderItems /> 

    <div className="bg-white p-5 rounded-xl shadow">
      <CheckoutForm />
    </div>

    <div className="bg-white p-5 rounded-xl shadow">
      <ShippingMethod />
    </div>

    <div className="bg-white p-5 rounded-xl shadow">
      <PaymentMethod />
    </div>

  </div>

  {/* RIGHT */}
  <div className="col-span-12 lg:col-span-4">
    <CheckoutSummary />
  </div>

      </div>
    </div>
  );
}