import Image from "next/image";
import HeroBanner from "./components/HeroBanner";
import CategorySection from "./components/CategorySection";
import ProductSection from "./components/ProductSection";
import BrandSection from "./components/BrandSection";
import TrustSection from "./components/TrustSection";
import FlashSaleSection from "./components/FlashSaleSection";
import PromoBanner from "./components/PromoBanner";

import { HomeData } from "@/src/services/customer/home/models/home.model";

type Props = {
  initialData: HomeData;
};

export default function HomePage({ initialData }: Props) {
  const data = initialData;

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
          />
        </div>
      </section>



      <section className="w-full my-3">
        <div className="container mx-auto">
          <CategorySection
            categories={data?.categories ?? []}
          />
        </div>
      </section>

      <section className="w-full my-3">
        <div className="container mx-auto">
          <ProductSection
            title="Xu hướng mua sắm"
            products={data?.trendingProducts ?? []}
          />
        </div>
      </section>

      <section className="w-full my-3">
        <div className="container mx-auto">
          <ProductSection
            title="Bán chạy nhất"
            products={data?.bestSellingProducts ?? []}
          />
        </div>
      </section>

      <section className="w-full my-8">
        <div className="container mx-auto px-4">
          <BrandSection
            brands={data?.brands ?? []}
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
          <div className="relative w-full aspect-21/9 md:aspect-3/1 rounded-4xl overflow-hidden shadow-2xl shadow-brand-500/10 border-4 border-white">
            <Image
              src="/images/main/background.jpg"
              alt="Cosmetics banner"
              fill
              className="object-cover transition-transform duration-1000 hover:scale-105"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
