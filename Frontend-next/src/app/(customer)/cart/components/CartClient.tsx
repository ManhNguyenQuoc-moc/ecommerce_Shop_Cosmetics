"use client";

import { useMemo, useState } from "react";
import SWTBreadcrumb from "@/src/@core/component/AntD/SWTBreadcrumb";
import CartTable from "./CartTable";
import CartSummary from "./CartSummary";
import { useCart } from "@/src/services/customer/cart/cart.hook";

export default function CartClient() {
  const { items } = useCart();
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [hasCustomSelection, setHasCustomSelection] = useState(false);

  const selectableItemIds = useMemo(
    () => items.filter((item) => item.stock !== 0).map((item) => item.id),
    [items]
  );

  const validSelectedItemIds = useMemo(
    () => selectedItemIds.filter((id) => selectableItemIds.includes(id)),
    [selectedItemIds, selectableItemIds]
  );

  const effectiveSelectedItemIds = useMemo(() => {
    if (!hasCustomSelection) {
      return selectableItemIds;
    }
    return validSelectedItemIds;
  }, [hasCustomSelection, selectableItemIds, validSelectedItemIds]);

  const handleSelectionChange = (ids: string[]) => {
    setHasCustomSelection(true);
    setSelectedItemIds(ids);
  };

  const selectedItems = useMemo(
    () => items.filter((item) => effectiveSelectedItemIds.includes(item.id)),
    [items, effectiveSelectedItemIds]
  );

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
          <CartTable
            selectedItemIds={effectiveSelectedItemIds}
            onSelectionChange={handleSelectionChange}
          />
        </div>

        <div className="col-span-12 lg:col-span-4">
          <CartSummary selectedItems={selectedItems} />
        </div>
      </div>
    </div>
  );
}
