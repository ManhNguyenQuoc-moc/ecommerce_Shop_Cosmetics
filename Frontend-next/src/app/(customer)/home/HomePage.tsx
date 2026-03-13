"use client";

import HeroBanner from "./components/HeroBanner";
import CategorySection from "./components/CategorySection";
import ProductSection from "./components/ProductSection";
import BrandSection from "./components/BrandSection";

import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import useSWTTitle from "@/src/@core/hooks/useSWTTitle";
import { getHomeData } from "@/src/services/customer/home";

import { HomeData } from "@/src/@core/type/home";

type Props = {
  initialData: HomeData;
};

export default function HomePage({ initialData }: Props) {

  useSWTTitle("Trang chủ");

  const { data, isValidating } = useFetchSWR<HomeData>(
    "home",
    getHomeData,
    {
      fallbackData: initialData,
      revalidateOnMount: false,
    }
  );

  const isLoading = !data && isValidating;

  return (
    <div className="space-y-10">

      <HeroBanner
        banners={data?.banners ?? []}
      />
      <CategorySection
        categories={data?.categories ?? []}
        loading={isLoading}
      />
      <ProductSection
        title="Sản phẩm nổi bật"
        products={data?.featuredProducts ?? []}
        loading={isLoading}
      />
      <ProductSection
        title="Sản phẩm bán chạy"
        products={data?.bestSellingProducts ?? []}
        loading={isLoading}
      />
      <ProductSection
        title="Sản phẩm mới nhất"
        products={data?.newestProducts ?? []}
        loading={isLoading}
      />
      <BrandSection
        brands={data?.brands ?? []}
        loading={isLoading}
      />

    </div>
  );
}