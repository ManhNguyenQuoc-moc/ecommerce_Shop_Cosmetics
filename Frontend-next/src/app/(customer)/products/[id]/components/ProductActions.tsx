"use client";

import SWTButton from "@/src/@core/component/AntD/SWTButton";
import { ProductDetailDto, ProductDetailVariantDto } from "@/src/services/models/product/output.dto";
import { useCheckoutStore } from "@/src/stores/useCheckoutStore";
import { useCart } from "@/src/services/customer/cart/cart.hook";
import { useRouter } from "next/navigation";
import { useState } from "react";
import SWTLoading from "@/src/@core/component/AntD/SWTLoading";

type Props = {
  qty: number;
  product: ProductDetailDto;
  variant: ProductDetailVariantDto | null;
};

export default function ProductActions({ qty, product, variant }: Props) {
  const setBuyNow = useCheckoutStore((s) => s.setBuyNow);
  const { addItem } = useCart();
  const router = useRouter();
  const hasVariants = product.variants?.length > 0;
  const noVariantSelected = hasVariants && !variant;
  const isOutOfStock = variant
    ? (variant.availableStock === undefined || variant.availableStock <= 0)
    : (product.variants?.length === 0 && (product.availableStock === undefined || product.availableStock <= 0));

  const isDisabled = noVariantSelected || isOutOfStock;
  const disabledTitle = noVariantSelected
    ? "Vui lòng chọn biến thể"
    : isOutOfStock
      ? "Sản phẩm đã hết hàng (hoặc cận date)"
      : undefined;

  const [loading, setLoading] = useState(false);

  const currentVariantId = variant ? variant.id : "default";

  const currentPrice = variant?.salePrice || variant?.price || product.priceRange?.min || 0;
  const currentPriceOrigin = variant?.price;
  const currentImage = variant?.image || product.images?.[0] || "";
  const variantLabel = variant ? ` - ${variant.color || variant.size || ""}` : "";
  const currentProductName = `${product.name}${variantLabel}`;

  const handleBuyNow = () => {
    setBuyNow({
      id: `${product.id}-${currentVariantId}-buy`,
      productId: product.id,
      variantId: currentVariantId,
      productName: currentProductName,
      image: currentImage,
      price: currentPrice,
      quantity: qty,
    });
    setLoading(true);
    router.push("/checkout");
  };

  const handleAddToCart = () => {
    addItem({
      id: `${product.id}-${currentVariantId}`,
      productId: product.id,
      variantId: currentVariantId,
      productName: currentProductName,
      brandName: product.brand?.name || "Đang cập nhật",
      image: currentImage,
      price: currentPrice,
      originalPrice: currentPriceOrigin ?? null,
      quantity: qty,
      color: variant?.color ?? null,
      size: variant?.size ?? null,
      sku: variant?.sku ?? null,
      salePrice: variant?.salePrice ?? null,
      subTotal: currentPrice * qty,
      stock: variant?.totalStock ?? product.totalStock,
      availableStock: variant?.availableStock ?? product.availableStock,
    });
  };

  return (
    <>
      <div className="flex gap-3 pt-4">
        <SWTButton
          onClick={handleAddToCart}
          disabled={isDisabled}
          title={disabledTitle}
          className="flex-1 !border-brand-500 !text-brand-500 !py-5 font-medium hover:!bg-brand-50 transition disabled:!opacity-50 disabled:!cursor-not-allowed"
        >
          Thêm vào giỏ hàng
        </SWTButton>

        <SWTButton
          onClick={handleBuyNow}
          disabled={isDisabled}
          title={disabledTitle}
          className="flex-1 !bg-brand-500 !text-white !py-5 font-medium hover:!bg-brand-700 transition disabled:!opacity-50 disabled:!cursor-not-allowed"
        >
          Mua ngay ({qty})
        </SWTButton>
      </div>
      {loading && <SWTLoading fullPage tip="Đang chuyển đến thanh toán..." />}
    </>
  );
}