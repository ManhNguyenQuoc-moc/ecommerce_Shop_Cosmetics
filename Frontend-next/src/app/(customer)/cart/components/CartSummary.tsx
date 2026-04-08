"use client";

import SWTCard from "@/src/@core/component/AntD/SWTCard";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import Image from "next/image";
import { useRouter } from "next/navigation"; 
import Loading from "@/src/@core/component/Loading";
import { useState } from "react";
import { useCartStore } from "@/src/stores/useCartStore";
import { useCheckoutStore } from "@/src/stores/useCheckoutStore";

export default function CartSummary() {
   const [loading, setLoading] = useState(false);
  const items = useCartStore((s) => s.items);
  const router = useRouter();

  const subtotal = items.reduce(
    (sum, item) =>
      sum + (item.originalPrice ?? item.price) * item.quantity,
    0
  );

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const discount = subtotal - total;

  const formatPrice = (value: number) =>
    value.toLocaleString("vi-VN") + " đ";
  const  handleCheckout = async () => {
    if (items.length === 0) return;

    const checkoutItems = items.map((item) => ({
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
      className="!rounded-xl !shadow-md !border-0"
      bodyClassName="!p-4 !space-y-4"
    >
      <div className="space-y-3 max-h-60 overflow-auto pr-1 pb-3 border-b">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3 items-start">
            <div className="w-12 h-12 relative flex-shrink-0">
              <div className="w-full h-full relative border rounded overflow-hidden">
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
              <p className="text-sm font-medium line-clamp-1 break-words">
                {item.productName}
              </p>
              <p className="text-xs text-gray-500">
                x{item.quantity}
              </p>
            </div>

            <div className="text-right whitespace-nowrap self-start">
              <p className="text-sm font-medium">
                {formatPrice(item.price * item.quantity)}
              </p>

              {item.originalPrice &&
                item.originalPrice > item.price && (
                  <p className="text-xs text-gray-400 line-through">
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
        <div className="flex justify-between text-sm">
          <span>Tạm tính:</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span>Giảm giá:</span>
          <span className="text-green-600">
            -{formatPrice(discount)}
          </span>
        </div>
      </div>
      
      <div className="border-t pt-3 flex justify-between font-semibold text-base mt-2">
        <span>Tổng cộng:</span>
        <span className="text-orange-500 text-lg">
          {formatPrice(total)}
        </span>
      </div>

      <SWTButton
        type="primary"
        block
        size="lg"
        onClick={handleCheckout} 
        disabled={!items.length}
        className="!bg-brand-500 hover:!bg-brand-600 !border-none"
      >
        Tiến hành đặt hàng
      </SWTButton>
    </SWTCard>
     {loading && <Loading shopName="CosmeticsShop"/>} 
     </>
  );
   
}