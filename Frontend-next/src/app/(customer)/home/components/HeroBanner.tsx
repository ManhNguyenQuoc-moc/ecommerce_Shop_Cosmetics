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
  
};

const ArrowLeft = (props: any) => (
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

const HeroBanner = ({ banners }: Props) => {
  return (
    <SWTCard className="overflow-hidden rounded-2xl shadow-lg shadow-blue-300 group">

      <div className="relative w-full h-[360px]">

        <Carousel
          autoplay
          autoplaySpeed={4000}
          arrows
          dots
          draggable
          pauseOnHover
          prevArrow={<ArrowLeft />}
          nextArrow={<ArrowRight />}
        >

          {banners.map((banner, index) => (
            <div key={index} className="relative w-full h-[360px]">

              <Image
                src={banner.image}
                alt={banner.title}
                fill
                sizes="100vw"
                priority={index === 0}
                className="object-cover"
              />

            </div>
          ))}

        </Carousel>

      </div>

    </SWTCard>
  );
};

export default HeroBanner;