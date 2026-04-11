"use client";

import SWTBreadcrumb from "@/src/@core/component/AntD/SWTBreadcrumb";
import CartTable from "./CartTable";
import CartSummary from "./CartSummary";
import { useCart } from "@/src/hooks/useCart";

export default function CartClient() {
  const { items } = useCart();

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="mb-6">
        <SWTBreadcrumb
          items={[
            { title: "Trang chủ", href: "/" },
            { title: "Giỏ hàng" },
          ]}
        />
      </div>

      <h1 className="text-2xl font-semibold mb-6">
        Giỏ hàng ({items.length} sản phẩm)
      </h1>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <CartTable />
        </div>

        <div className="col-span-12 lg:col-span-4">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
