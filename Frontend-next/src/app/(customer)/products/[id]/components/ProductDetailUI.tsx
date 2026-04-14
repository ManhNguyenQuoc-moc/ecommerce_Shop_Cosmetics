"use client";

import { useState, } from "react";
import { useSearchParams } from "next/navigation";
import { ProductDetailDto, ProductDetailVariantDto } from "@/src/services/models/product/output.dto";
import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import ProductGallery from "./ProductGallery";
import ProductVariants from "./ProductVariants";
import ProductInfo from "./ProductInfo";
import ProductQuantity from "./ProductQuantity";
import ProductTabs from "./ProductTabs";
import ProductActions from "./ProductActions";
import ProductSidebar from "./ProductSidebar/ProductSidebar";
import { getProductDetail } from "@/src/services/customer/product.service";
import SWTCard from "@/src/@core/component/AntD/SWTCard";

type Props = {
  product: ProductDetailDto;
};

export default function ProductDetailUI({ product }: Props) {

  const { data, isLoading } = useFetchSWR<ProductDetailDto>(
  ["products", product?.id],
  () => getProductDetail(product.id),
  {
    fallbackData: product,
    revalidateOnMount: true, 
    revalidateOnFocus: false,  
  }
);

  const currentProduct = {
  ...product,
  priceRange: data?.priceRange ?? product?.priceRange,
  variants: data?.variants ?? product?.variants
  };
  
  const searchParams = useSearchParams();
  const variantQueryId = searchParams.get("variant");

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(() => {
    const variants = currentProduct.variants || [];
    if (variantQueryId) {
      const found = variants.find(v => v.id === variantQueryId);
      if (found) return found.id;
    }
    // Auto-select first variant that is in stock (expiry > 3 months)
    return variants.find(v => (v.availableStock ?? 0) > 0)?.id ?? variants[0]?.id ?? null;
  });

  const variant = currentProduct.variants?.find(v => v.id === selectedVariantId) || null;
  
  const [activeImage, setActiveImage] = useState(
    variant?.image ?? currentProduct.images?.[0] ?? ""
  );

  const [qty, setQty] = useState(1);

  const maxAvailable = variant 
    ? Math.min(5, variant.availableStock) 
    : Math.min(5, currentProduct.availableStock || 0);

  const handleVariantChange = (v: ProductDetailVariantDto) => {
    setSelectedVariantId(v.id);
    if (v.image) {
      setActiveImage(v.image);
    }
    // Adjust qty if it exceeds new max
    const newMax = Math.min(5, v.availableStock);
    if (qty > newMax) {
      setQty(newMax || 1);
    }
  };

  const galleryImages: string[] = Array.from(
    new Set([
      ...(currentProduct.images ?? []),
      ...(currentProduct.variants ?? [])
        .map((v) => v.image)
        .filter((img): img is string => !!img),
    ])
  );
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-9 space-y-8">
          <SWTCard loading={!data && !product && isLoading} className="min-h-[600px]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4">
              <ProductGallery
                productName={currentProduct.name}
                activeImage={activeImage}
                galleryImages={galleryImages}
                setActiveImage={setActiveImage}
              />
              <div className="lg:col-span-7 space-y-6">
                <ProductInfo product={currentProduct} />
                {currentProduct.variants?.length > 0 ? (
                  <ProductVariants
                    variants={currentProduct?.variants}
                    variant={variant}
                    setVariant={handleVariantChange}
                    priceRange={currentProduct?.priceRange}
                  />
                ) : (
                  <div className="text-3xl text-orange-600 font-bold">
                    {currentProduct.priceRange?.min?.toLocaleString()}đ
                  </div>
                )}
                <ProductQuantity qty={qty} setQty={setQty} max={maxAvailable} />
                <ProductActions qty={qty} product={currentProduct} variant={variant}/>
              </div>
            </div>
          </SWTCard>
          <ProductTabs product={currentProduct} />
        </div>

        <div className="lg:col-span-3">
          <ProductSidebar brand={currentProduct.brand ?? { id: '', name: 'N/A' }} />
        </div>
      </div>
    </div>
  );
}
