"use client";

import SWTCard from "@/src/@core/component/AntD/SWTCard";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SWTLoading from "@/src/@core/component/AntD/SWTLoading";
import { useState } from "react";
import { useCart } from "@/src/services/customer/cart/cart.hook";
import { useCheckoutStore } from "@/src/stores/useCheckoutStore";
import { showNotificationError } from "@/src/@core/utils/message";
import { CartItem } from "@/src/stores/useCartStore";

type CartSummaryProps = {
  selectedItems: CartItem[];
};

export default function CartSummary({ selectedItems }: CartSummaryProps) {
  const [loading, setLoading] = useState(false);
  const { items } = useCart();
  const router = useRouter();

  const selectedSubtotal = selectedItems.reduce(
    (sum, item) =>
      sum + (item.originalPrice ?? item.price) * item.quantity,
    0
  );

  const selectedTotal = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const discount = selectedSubtotal - selectedTotal;

  const formatPrice = (value: number) =>
    value.toLocaleString("vi-VN") + " đ";
  const handleCheckout = async () => {
    if (selectedItems.length === 0) {
      showNotificationError("Vui lòng chọn ít nhất 1 sản phẩm để đặt hàng.");
      return;
    }

    // Kiểm tra sản phẩm hết hàng
    const outOfStockItems = selectedItems.filter((item) => item.stock === 0);
    if (outOfStockItems.length > 0) {
      const names = outOfStockItems.map((i) => i.productName).join(", ");
      showNotificationError(`Sản phẩm đã hết hàng: ${names}. Vui lòng xóa khỏi giỏ hàng trước khi tiếp tục.`);
      return;
    }

    const checkoutItems = selectedItems.map((item) => ({
      id: item.id,
      productId: item.productId,
      variantId: item.variantId,
      productName: item.productName,
      image: item.image ?? "",
      price: item.price,
      quantity: item.quantity,
    }));

    useCheckoutStore.getState().setCartMode(checkoutItems);
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 800));

    router.push("/checkout");
  };

  return (
    <>
      <SWTCard
        title="Hóa đơn của bạn"
        className="rounded-xl! shadow-md! border! border-border-default bg-bg-card!"
        bodyClassName="!p-4 !space-y-4"
      >
        <div className="space-y-3 max-h-60 overflow-auto pr-1 pb-3 border-b border-border-default">
          {selectedItems.map((item) => (
            <div key={item.id} className="flex gap-3 items-start">
              <div className="w-12 h-12 relative shrink-0">
                <div className="w-full h-full relative border border-border-default rounded overflow-hidden">
                  <Image
                    src={item.image || "/placeholder-image.png"}
                    alt={item.productName}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-main line-clamp-1 wrap-break-word">
                  {item.productName}
                </p>
                <p className="text-xs text-text-muted font-bold">
                  x{item.quantity}
                </p>
              </div>

              <div className="text-right whitespace-nowrap self-start">
                <p className="text-sm font-bold text-text-main">
                  {formatPrice(item.price * item.quantity)}
                </p>

                {item.originalPrice &&
                  item.originalPrice > item.price && (
                    <p className="text-xs text-text-muted line-through">
                      {formatPrice(
                        item.originalPrice * item.quantity
                      )}
                    </p>
                  )}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2 pt-1">
          <div className="flex justify-between text-sm text-text-sub">
            <span>Tạm tính:</span>
            <span className="font-semibold">{formatPrice(selectedSubtotal)}</span>
          </div>

          <div className="flex justify-between text-sm text-text-sub">
            <span>Giảm giá:</span>
            <span className="text-status-success-text font-bold">
              -{formatPrice(discount)}
            </span>
          </div>
        </div>

        <div className="border-t border-border-default pt-3 flex justify-between font-bold text-base mt-2">
          <span className="text-text-main">Tổng cộng:</span>
          <span className="text-brand-500 text-lg">
            {formatPrice(selectedTotal)}
          </span>
        </div>

        <SWTButton
          type="primary"
          block
          size="lg"
          onClick={handleCheckout}
          disabled={!selectedItems.length || !items.length}
          className="bg-brand-500! hover:bg-brand-600! text-white! border-none!"
        >
          {selectedItems.length > 0
            ? `Đặt hàng (${selectedItems.length} sản phẩm đã chọn)`
            : "Chọn sản phẩm để đặt hàng"}
        </SWTButton>
      </SWTCard>
      {loading && <SWTLoading fullPage tip="Đang chuẩn bị thanh toán..." />}
    </>
  );

}