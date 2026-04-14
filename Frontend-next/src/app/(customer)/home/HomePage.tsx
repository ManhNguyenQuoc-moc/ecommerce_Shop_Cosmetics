"use client";
import Image from "next/image";
import HeroBanner from "./components/HeroBanner";
import CategorySection from "./components/CategorySection";
import ProductSection from "./components/ProductSection";
import BrandSection from "./components/BrandSection";
import TrustSection from "./components/TrustSection";
import FlashSaleSection from "./components/FlashSaleSection";
import PromoBanner from "./components/PromoBanner";

import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import useSWTTitle from "@/src/@core/hooks/useSWTTitle";

import { getHomeData } from "@/src/services/customer/home/home.service";

import { HomeData } from "@/src/services/customer/home/models/home.model";

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

  const isActuallyLoading = !data && !initialData && isValidating;

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
            products={data?.flashSaleProducts ?? []}
            endDate={tomorrowMidnight.toISOString()}
            loading={isActuallyLoading}
          />
        </div>
      </section>



      <section className="w-full my-3">
        <div className="container mx-auto">
          <CategorySection
            categories={data?.categories ?? []}
            loading={isActuallyLoading}
          />
        </div>
      </section>

      <section className="w-full my-3">
        <div className="container mx-auto">
          <ProductSection
            title="Xu hướng mua sắm"
            products={data?.trendingProducts ?? []}
            loading={isActuallyLoading}
          />
        </div>
      </section>

      <section className="w-full my-3">
        <div className="container mx-auto">
          <ProductSection
            title="Bán chạy nhất"
            products={data?.bestSellingProducts ?? []}
            loading={isActuallyLoading}
          />
        </div>
      </section>

      <section className="w-full my-8">
        <div className="container mx-auto px-4">
          <BrandSection
            brands={data?.brands ?? []}
            loading={isActuallyLoading}
          />
        </div>
      </section>

      <section className="w-full py-6">
        <div className="container mx-auto">
          <PromoBanner />
        </div>
      </section>

      <section className="w-full">
        <div className="container mx-auto px-4">
          <ProductSection
            title="Sản phẩm mới nhất"
            products={data?.newestProducts ?? []}
            loading={isActuallyLoading}
          />
        </div>
      </section>
      <section className="w-full relative px-4">
        <div className="container mx-auto">
          <TrustSection />
        </div>
      </section>
          
      <section className="w-full relative px-4 mt-4">
        <div className="container mx-auto">
          <div className="relative w-full aspect-[21/9] md:aspect-[3/1] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-brand-500/10 border-4 border-white">
            <Image
              src="/images/main/background.jpg"
              alt="Cosmetics banner"
              fill
              priority
              className="object-cover transition-transform duration-1000 hover:scale-105"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
