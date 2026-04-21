"use client";

import { Carousel } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Sparkles, Trophy } from "lucide-react";
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
  const router = useRouter();

  if (!banners || banners.length === 0) return null;

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-3 flex flex-col">
          <SWTCard
            className="flex-1 !rounded-3xl !border-none !shadow-lg overflow-hidden relative group/card"
            bodyClassName="!h-full !p-5 md:p-6 !flex !flex-col !justify-between relative overflow-hidden"
          >
            {/* Hiệu ứng quét sáng toàn thẻ */}
            <div className="absolute inset-0 bg-white/20 animate-sweep z-[1] pointer-events-none" />

            <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-700 to-brand-600 opacity-90 transition-all duration-1000 group-hover/card:scale-110" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-[40px] rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-brand-900/30 blur-[30px] rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
              <Sparkles className="absolute top-[10%] left-[15%] w-4 h-4 animate-bounce" />
              <Trophy className="absolute bottom-[15%] right-[10%] w-5 h-5 animate-pulse" />
            </div>
            <div className="relative z-10 flex flex-col gap-3">
              <div className="inline-flex items-center w-fit gap-1.5 px-3 py-1.5 rounded-full bg-brand-500/90 border border-brand-300 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-sm backdrop-blur-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-white/30 animate-sweep" />
                <span className="relative z-10">HOT ITEM</span>
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-white leading-tight drop-shadow-lg">
                  Săn Sale <br className="block sm:hidden" /> Ngay
                </h2>
              </div>
              <div className="flex items-center gap-3 bg-white/10 w-fit p-1.5 rounded-xl backdrop-blur-md border border-white/20 shadow-lg mt-1">
                <div className="relative overflow-hidden bg-white text-brand-600 px-5 py-1.5 rounded-lg text-lg md:text-xl font-black shadow-sm flex items-center justify-center">
                  <div className="absolute inset-0 bg-brand-500/20 animate-sweep z-0" />
                  <span className="relative z-10">-50%</span>
                </div>
                <div className="flex flex-col pr-4">
                  <p className="text-[10px] font-semibold text-white/90 uppercase tracking-wider mb-0.5">
                    Ưu đãi có hạn
                  </p>
                  <p className="text-[10px] font-medium text-white/70 uppercase tracking-wider mb-0">Đến 31/12/2026</p>
                </div>
              </div>
            </div>
            <div className="relative z-10">
              <SWTButton
                type="primary"
                onClick={() => router.push("/profile/vouchers")}
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
            className="!h-full !rounded-3xl !border-none !shadow-lg !overflow-hidden relative"
            bodyClassName="!p-0 h-full relative"
          >
            {/* Hiệu ứng quét sáng toàn ảnh Carousel */}
            <div className="absolute inset-0 bg-white/20 animate-sweep z-50 pointer-events-none mix-blend-overlay" />

            <Carousel
              autoplay
              autoplaySpeed={5000}
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
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : "auto"}
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


