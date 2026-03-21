"use client";

import { Carousel } from "antd";
import Image from "next/image";
import { Sparkles, Trophy, Flame, Gift, ChevronLeft, ChevronRight } from "lucide-react";
import SWTCard from "@/src/@core/component/AntD/SWTCard";
import SWTButton from "@/src/@core/component/AntD/SWTButton";

type Banner = {
  title: string;
  subtitle: string;
  image: string;
  link?: string;
  ctaText?: string;
};

type Props = {
  banners: Banner[];
};

const HeroBanner = ({ banners }: Props) => {
  if (!banners || banners.length === 0) return null;

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[220px] md:min-h-[250px] lg:min-h-[280px]">
        {/* Left: Pure CSS Animated Marketing Card (Reduced size) */}
        <div className="lg:col-span-3 flex flex-col">
          <SWTCard 
            className="flex-1 !rounded-3xl !border-none !shadow-lg overflow-hidden relative group/card"
            bodyClassName="!h-full !p-5 md:p-6 !flex !flex-col !justify-between"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-500 to-brand-700 opacity-90 transition-all duration-1000 group-hover/card:scale-110" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-[40px] rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-brand-900/30 blur-[30px] rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
               <Sparkles className="absolute top-[10%] left-[15%] w-4 h-4 animate-bounce" />
               <Trophy className="absolute bottom-[15%] right-[10%] w-5 h-5 animate-pulse" />
            </div>

            <div className="relative z-10 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 border border-brand-200 text-brand-900 text-[8px] font-black uppercase tracking-widest shadow-sm">
                HOT ITEM
              </div>
              
              <div className="space-y-0.5">
                <h2 className="text-lg md:text-xl font-black text-white leading-tight drop-shadow-md">
                  Săn Sale <br/> Thần Tốc
                </h2>
              </div>
              
              <div className="flex items-center gap-2">
                 <div className="bg-white/95 text-brand-600 px-2 py-0.5 rounded-lg text-base font-black shadow-md">
                    -50%
                 </div>
                 <div className="text-white">
                    <p className="text-[7px] font-bold uppercase tracking-tighter opacity-80 leading-none">Ưu đãi</p>
                    <p className="text-[9px] font-black underline decoration-brand-200 underline-offset-2">Lấy mã</p>
                 </div>
              </div>
            </div>

            <div className="relative z-10">
              <SWTButton
                type="primary"
                size="sm"
                className="!h-[38px] !w-full !rounded-xl !bg-white !border-none !text-brand-600 !text-[10px] !font-black hover:!scale-[1.05] hover:!shadow-xl !transition-all active:scale-95"
              >
                LẤY MÃ NGAY
              </SWTButton>
            </div>
          </SWTCard>
        </div>

        {/* Right: Standard High-Quality Image Carousel (Expanded) */}
        <div className="lg:col-span-9">
          <SWTCard 
            className="!h-full !rounded-3xl !border-none !shadow-lg !overflow-hidden"
            bodyClassName="!p-0 h-full"
          >
            <Carousel
              autoplay
              autoplaySpeed={5000}
              effect="fade"
              dots={{ className: "!bottom-4Scale-75" }}
              arrows
              className="h-full"
            >
              {banners.map((banner, index) => (
                <div key={index} className="relative w-full h-[220px] md:h-[250px] lg:h-[280px]">
                  <Image
                    src={banner.image}
                    alt={banner.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 75vw"
                    priority={index === 0}
                    className="object-cover"
                  />
                </div>
              ))}
            </Carousel>
          </SWTCard>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;


