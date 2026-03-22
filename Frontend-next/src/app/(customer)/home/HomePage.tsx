"use client";

import HeroBanner from "./components/HeroBanner";
import CategorySection from "./components/CategorySection";
import ProductSection from "./components/ProductSection";
import BrandSection from "./components/BrandSection";
import TrustSection from "./components/TrustSection";
import FlashSaleSection from "./components/FlashSaleSection";
// import TestimonialSection from "./components/TestimonialSection";
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
    <div className="flex flex-col w-full">
      <section className="w-full relative md:pt-6">
        <HeroBanner
          banners={data?.banners?.map((b, i) => ({
            ...b,
            align: i % 2 === 0 ? "left" : "right"
          })) ?? []}
        />
      </section>
      <section className="w-full bg-blue-light my-3">
        <div className="container mx-auto">
          <FlashSaleSection 
            products={data?.bestSellingProducts?.slice(0, 6) ?? []} 
            endDate={tomorrowMidnight.toISOString()} 
            loading={isLoading}
          />
        </div>
      </section>
       <section className="w-full relative my-3">
        <div className="container mx-auto">
          <TrustSection />
        </div>
      </section>
      <section className="w-full my-3">
        <div className="container mx-auto">
            <CategorySection
              categories={data?.categories ?? []}
              loading={isLoading}
            />
        </div>
      </section>
      <section className="w-full my-3">
        <div className="container mx-auto">
          <ProductSection
            title="Sản phẩm nổi bật"
            products={data?.featuredProducts ?? []}
            loading={isLoading}
          />
        </div>
      </section>
      <section className="w-full bg-slate-50 my-3 py-3 border-y border-gray-100">
        <div className="container mx-auto px-4">
          <BrandSection
            brands={data?.brands ?? []}
            loading={isLoading}
          />
        </div>
      </section>
      <section className="w-full bg-white py-3">
        <div className="container mx-auto">
          <PromoBanner />
        </div>
      </section>
      <section className="w-full bg-white pb-16">
        <div className="container mx-auto px-4">
          <ProductSection
            title="Sản phẩm mới nhất"
            products={data?.newestProducts ?? []}
            loading={isLoading}
          />
        </div>
      </section>
      {/* <section className="w-full bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <TestimonialSection />
        </div>
      </section> */}
    </div>
  );
}
