"use client"

import HeroBanner from "./components/HeroBanner";
import CategorySection from "./components/CategorySection";
import ProductSection from "./components/ProductSection";
import BrandSection from "./components/BrandSection";

import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import useSWTTitle from "@/src/@core/hooks/useSWTTitle";
import { getHomeData } from "@/src/services/customer/home";
import useSWTInitLoading from "@/src/@core/hooks/useSWTInitLoading";

import { HomeData } from "@/src/@core/type/home";

export default function HomePage() {
    useSWTTitle("Trang chủ")
  const { data, isLoading } = useFetchSWR<HomeData>(
    "home",
    getHomeData
  );

  const showInitLoading = useSWTInitLoading(isLoading);

  return (
    <div className="space-y-10">

      <HeroBanner
        banners={data?.banners ?? []}
        loading={showInitLoading}
      />

      <CategorySection
        categories={data?.categories ?? []}
        loading={showInitLoading}
      />

      <ProductSection
        title="Sản phẩm nổi bật"
        products={data?.featuredProducts ?? []}
        loading={showInitLoading}
      />

      <ProductSection
        title="Sản phẩm bán chạy"
        products={data?.bestSellingProducts ?? []}
        loading={showInitLoading}
      />

      <ProductSection
        title="Sản phẩm mới nhất"
        products={data?.newestProducts ?? []}
        loading={showInitLoading}
      />

      <BrandSection
        brands={data?.brands ?? []}
        loading={showInitLoading}
      />

    </div>
  );
}