"use client";

import { useState, useEffect } from "react";
import { Carousel } from "antd";
import { Zap, ChevronRight } from "lucide-react";
import SWTCard from "@/src/@core/component/AntD/SWTCard";
import { Product } from "@/src/@core/type/Product";
import ProductCard from "./ProductCard";
import Link from "next/link";

interface Props {
  products: Product[];
  endDate: string; // ISO string for sale end time
  loading?: boolean;
}

const CountdownTimer = ({ targetDate }: { targetDate: string }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(targetDate).getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex gap-2 items-center">
      <div className="bg-brand-900 text-white px-2.5 py-1.5 rounded-lg font-bold text-sm min-w-[36px] text-center shadow-sm">
        {timeLeft.hours.toString().padStart(2, "0")}
      </div>
      <span className="font-bold text-brand-600">:</span>
      <div className="bg-brand-900 text-white px-2.5 py-1.5 rounded-lg font-bold text-sm min-w-[36px] text-center shadow-sm">
        {timeLeft.minutes.toString().padStart(2, "0")}
      </div>
      <span className="font-bold text-brand-600">:</span>
      <div className="bg-brand-900 text-white px-2.5 py-1.5 rounded-lg font-bold text-sm min-w-[36px] text-center shadow-sm">
        {timeLeft.seconds.toString().padStart(2, "0")}
      </div>
    </div>
  );
};

export default function FlashSaleSection({ products, endDate, loading }: Props) {
  if (!loading && products.length === 0) return null;
  const chunkSize = 4;
  const grouped: Product[][] = [];
  for (let i = 0; i < products.length; i += chunkSize) {
    let group = products.slice(i, i + chunkSize);
    grouped.push(group);
  }
  return (
    <div className="pt-4">
     <div className="flex flex-wrap items-center justify-between gap-4 bg-brand-50/50 p-4 sm:p-6 rounded-2xl border border-brand-100 shadow-sm relative overflow-hidden">
        {/* Hiệu ứng quét sáng toàn thanh Flash Sale */}
        <div className="absolute inset-0 bg-white/40 animate-sweep z-[1] pointer-events-none mix-blend-overlay" />
        
  <div className="flex items-center gap-4 relative z-10">
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-brand-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/40 animate-sweep z-0" />
        <Zap size={20} fill="currentColor" className="relative z-10 animate-pulse" />
      </div>
      <h2 className="text-2xl !mb-0 font-black text-gray-900 tracking-tight uppercase italic relative overflow-hidden px-2 rounded">
        <div className="absolute inset-0 bg-brand-500/10 animate-sweep z-0" />
        <span className="relative z-10">Flash Sale</span>
      </h2>
    </div>
    
    <div className="hidden sm:block h-6 w-px bg-brand-200" />
    
    <div className="flex items-center gap-3">
      {/* Làm đậm nhẹ màu text để dễ đọc hơn trên nền màu */}
      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
        Kết thúc sau
      </span>
      <CountdownTimer targetDate={endDate} />
    </div>
  </div>

  <Link 
    href="/products" 
    // Thêm một background trắng mờ hoặc viền cho nút "Xem tất cả" để nó nổi bật như một button
    className="text-sm font-bold text-brand-600 hover:text-brand-700 bg-white/80 hover:bg-white px-4 py-2 rounded-full flex items-center gap-1 group transition-all shadow-sm hover:shadow border border-brand-100 relative z-10"
  >
    Xem tất cả 
    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
  </Link>
</div>
      <div className="pt-2">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, i) => (
              <ProductCard key={i} loading={true} />
            ))}
          </div>
        ) : (
          <Carousel arrows dots={true} className="pb-6">
            {grouped.map((group, index) => (
              <div key={index}>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-4">
                  {group.map((product) => (
                    <div key={product.variantId || product.id} className="group transition-transform hover:-translate-y-1">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Carousel>
        )}
      </div>
    </div>
  );
}
