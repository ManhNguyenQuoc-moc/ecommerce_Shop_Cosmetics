"use client";

import { useState, } from "react";
import { ProductDetail, ProductVariant } from "@/src/@core/type/Product";
import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import ProductGallery from "./components/ProductGallery";
import ProductVariants from "./components/ProductVariants";
import ProductInfo from "./components/ProductInfo";
import ProductQuantity from "./components/ProductQuantity";
import ProductTabs from "./components/ProductTabs";
import ProductActions from "./components/ProductActions";
import ProductSidebar from "./components/ProductSidebar/ProductSidebar";
import { getProductDetail } from "@/src/services/customer/product.service";
import SWTCard from "@/src/@core/component/AntD/SWTCard";

type Props = {
  product: ProductDetail;
};

export default function ProductDetailUI({ product }: Props) {

  const { data, isLoading } = useFetchSWR(
  ["products", product.id],
  () => getProductDetail(product.id),
  {
    fallbackData: product,
    revalidateOnMount: true, 
    revalidateOnFocus: false,  
  }
);

  const currentProduct = {
  ...product,
  priceRange: data?.priceRange ?? product.priceRange,
  variants: data?.variants ?? product.variants
  };
  
  const [variant, setVariant] = useState<ProductVariant | null>(
    currentProduct.variants?.[0] ?? null
  );
  
  const [activeImage, setActiveImage] = useState(
    variant?.image ?? currentProduct.images?.[0] ?? ""
  );

  const [qty, setQty] = useState(1);

  const handleVariantChange = (v: ProductVariant) => {
    setVariant(v);
    if (v.image) {
      setActiveImage(v.image);
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
          <SWTCard loading={isLoading} className="min-h-[600px]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4">
              <ProductGallery
                productName={currentProduct.name}
                activeImage={activeImage}
                galleryImages={galleryImages}
                setActiveImage={setActiveImage}
              />
              <div className="lg:col-span-7 space-y-6">
                <ProductInfo product={currentProduct} />
                {currentProduct.variants.length > 0 ? (
                  <ProductVariants
                    variants={currentProduct.variants}
                    variant={variant}
                    setVariant={handleVariantChange}
                    priceRange={currentProduct.priceRange}
                  />
                ) : (
                  <div className="text-3xl text-orange-600 font-bold">
                    {currentProduct.priceRange.min.toLocaleString()}đ
                  </div>
                )}
                <ProductQuantity qty={qty} setQty={setQty} />
                <ProductActions qty={qty} product={currentProduct} variant={variant}/>
              </div>
            </div>
          </SWTCard>
          <ProductTabs product={currentProduct} />
        </div>
        <div className="lg:col-span-3">
          <ProductSidebar brand={currentProduct.brand} />
        </div>
      </div>
    </div>
  );
}
