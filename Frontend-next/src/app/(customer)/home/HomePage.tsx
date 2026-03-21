"use client";

import HeroBanner from "./components/HeroBanner";
import CategorySection from "./components/CategorySection";
import ProductSection from "./components/ProductSection";
import BrandSection from "./components/BrandSection";
import TrustSection from "./components/TrustSection";
import FlashSaleSection from "./components/FlashSaleSection";
import TestimonialSection from "./components/TestimonialSection";
import NewsletterSection from "./components/NewsletterSection";
import PromoBanner from "./components/PromoBanner";


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

  const tomorrowMidnight = new Date();
  tomorrowMidnight.setDate(tomorrowMidnight.getDate() + 1);
  tomorrowMidnight.setHours(0, 0, 0, 0);

  return (
    <div className="space-y-16 pb-20">

      <div className="flex flex-col gap-6">
        <HeroBanner
          banners={data?.banners?.map((b, i) => ({
            ...b,
            align: i % 2 === 0 ? "left" : "right"
          })) ?? []}
        />
        <PromoBanner />
      </div>

      <div className="container mx-auto px-4 space-y-20">
        
        <TrustSection />

        <FlashSaleSection 
          products={data?.bestSellingProducts?.slice(0, 6) ?? []} 
          endDate={tomorrowMidnight.toISOString()} 
          loading={isLoading}
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

        <BrandSection
          brands={data?.brands ?? []}
          loading={isLoading}
        />

        <ProductSection
          title="Sản phẩm mới nhất"
          products={data?.newestProducts ?? []}
          loading={isLoading}
        />

        <TestimonialSection />

        <NewsletterSection />

      </div>

    </div>
  );
}
