"use client";

import SWTButton from "@/src/@core/component/AntD/SWTButton";
import { ProductDetailDto, ProductDetailVariantDto } from "@/src/services/models/product/output.dto";
import { useCheckoutStore } from "@/src/stores/useCheckoutStore";
import { useCartStore } from "@/src/stores/useCartStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Loading from "@/src/@core/component/Loading";

type Props = {
  qty: number;
  product: ProductDetailDto;
  variant: ProductDetailVariantDto | null;
};

export default function ProductActions({ qty, product, variant }: Props) {
  const setBuyNow = useCheckoutStore((s) => s.setBuyNow);
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();
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
      stock: variant?.stock ?? product.totalStock,
    });
  };

  return (
    <>
    <div className="flex gap-3 pt-4">
      <SWTButton
        onClick={handleAddToCart}
        className="flex-1 !border-brand-500 !text-brand-500 !py-5 font-medium hover:!bg-brand-50 transition"
      >
        Thêm vào giỏ hàng
      </SWTButton>

      <SWTButton
        onClick={handleBuyNow}
        className="flex-1 !bg-brand-500 !text-white !py-5 font-medium hover:!bg-brand-700 transition"
      >
        Mua ngay ({qty})
      </SWTButton>
    </div>
    {loading && <Loading shopName="SWT Shop" />}
    </>
  );
}