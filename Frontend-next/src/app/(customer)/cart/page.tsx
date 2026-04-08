"use client";

import SWTBreadcrumb from "@/src/@core/component/AntD/SWTBreadcrumb";
import CartTable from "./components/CartTable";
import CartSummary from "./components/CartSummary";
import { useEffect } from "react";
import { useCartStore } from "@/src/stores/useCartStore";
import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import { cartService } from "@/src/services/customer/cart.service";
import { authStorage } from "@/src/@core/utils/authStorage";

export default function CartPage() {
  const user = authStorage.getUser();
  const { items, setItems } = useCartStore();

  const { data, isLoading } = useFetchSWR(
    user?.id ? `/carts/${user.id}` : null,
    () => cartService.getCartAsync(user!.id)
  );

  useEffect(() => {
    if (data?.items) {
      setItems(data.items);
    }
  }, [data, setItems]);

  return (
    <div className="w-full max-w-7xl mx-auto">
      <SWTBreadcrumb
        items={[
          { title: "Trang chủ", href: "/" },
          { title: "Giỏ hàng" },
        ]}
      />

      <h1 className="text-2xl font-semibold">
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