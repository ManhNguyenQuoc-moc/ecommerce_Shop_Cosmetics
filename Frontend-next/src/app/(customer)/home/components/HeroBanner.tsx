"use client";

import { Carousel } from "antd";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SWTCard from "@/src/@core/component/AntD/SWTCard";

type Banner = {
  title: string;
  subtitle: string;
  image: string;
};

type Props = {
  banners: Banner[];
  loading?: boolean;
};

const ArrowLeft = ( props: any) => (
  <button
    {...props}
    className="
    absolute left-4 top-1/2 -translate-y-1/2 z-10
    rounded-full p-2 shadow bg-white/80
    opacity-0 group-hover:opacity-100
    transition duration-300
    "
  >
    <ChevronLeft size={22} />
  </button>
);

const ArrowRight = (props: any) => (
  <button
    {...props}
    className="
    absolute right-4 top-1/2 -translate-y-1/2 z-10
    rounded-full p-2 shadow bg-white/80
    opacity-0 group-hover:opacity-100
    transition duration-300
    "
  >
    <ChevronRight size={22} />
  </button>
);

const HeroBanner = ({ banners, loading }: Props) => {
  return (
    <SWTCard
      loading={loading}
      height={360}
      className="overflow-hidden rounded-2xl shadow-lg shadow-blue-300 group"
    >
      <Carousel
        autoplay
        autoplaySpeed={4000}
        dots
        arrows
        prevArrow={<ArrowLeft />}
        nextArrow={<ArrowRight />}
      >
        {banners.map((banner, index) => (
          <div key={index}>
            <div className="relative w-full h-[200px] sm:h-[360px] md:h-[420px] lg:h-[360px]">
              <Image
                src={banner.image}
                alt="banner"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        ))}
      </Carousel>
    </SWTCard>
  );
};

export default HeroBanner;