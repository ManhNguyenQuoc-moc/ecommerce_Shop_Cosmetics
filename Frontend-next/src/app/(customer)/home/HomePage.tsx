"use client"
import HeroBanner from "./components/HeroBanner";
import CategorySection from "./components/CategorySection";
import ProductSection from "./components/ProductSection";
import BrandSection from "./components/BrandSection";
import { bestSellingProducts , featuredProducts, newestProducts } from "@/src/service/customer/mockProducts";
import { brands } from "@/src/service/customer/mockBrands";
import {categories} from "@/src/service/customer/mockCategory";
import {banners} from "@/src/service/customer/mockBanner";
import { useState, useEffect } from "react";

export default function HomePage() {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1200);
      return () => clearTimeout(timer);
    }, []);
  return (
    <div className="space-y-10 ">
      <HeroBanner banners={banners} loading={isLoading} />
      <CategorySection categories={categories} loading={isLoading} />
      <ProductSection
        title="Sản phẩm nổi bật"
        products={featuredProducts}
        loading={isLoading}
      />
      <ProductSection
        title="Sản phẩm bán chạy"
        products={bestSellingProducts}
        loading={isLoading}
      />

      <ProductSection
        title="Sản phẩm mới nhất"
        products={newestProducts}
        loading={isLoading}
      />
      <BrandSection
          brands={brands}
          loading={false}/>
      </div>
  );
}