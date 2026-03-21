"use client";

import { useState, useEffect } from "react";
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

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-brand-200">
              <Zap size={20} fill="currentColor" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase italic">Flash Sale</h2>
          </div>

          <div className="hidden sm:block h-6 w-px bg-gray-200" />
          <div className="flex items-center gap-3">
             <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Kết thúc sau</span>
             <CountdownTimer targetDate={endDate} />
          </div>
        </div>
        <Link 
          href="/products" 
          className="text-sm font-bold text-brand-500 hover:text-brand-600 flex items-center gap-1 group transition-all"
        >
          Xem tất cả 
          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <SWTCard className="!border-none !shadow-xl !bg-white/40 !backdrop-blur-xl border border-white/20" bodyClassName="p-4 md:p-6">

        <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth">
          {loading ? (
             Array(4).fill(0).map((_, i) => (
                <div key={i} className="min-w-[260px] max-w-[260px]">
                   <ProductCard loading={true} />
                </div>
             ))
          ) : (
            products.map((product) => (
              <div key={product.id} className="min-w-[260px] max-w-[260px] group transition-transform hover:-translate-y-1">
                <ProductCard product={product} />
              </div>
            ))
          )}
        </div>
      </SWTCard>
    </div>
  );
}
