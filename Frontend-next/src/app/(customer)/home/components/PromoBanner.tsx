"use client";

import { Sparkles, Zap, ArrowRight, Gift } from "lucide-react";
import { useRouter } from "next/navigation";
import SWTButton from "@/src/@core/component/AntD/SWTButton";

const PromoBanner = () => {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4">
      <div className="w-full h-[80px] md:h-[100px] relative overflow-hidden rounded-[2rem] shadow-xl group">
        <div className="absolute inset-0 bg-gray-950 flex items-center">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-600/30 via-brand-500/40 to-brand-700/30 animate-gradient-x opacity-60" />
          <div className="absolute inset-0 opacity-5" 
               style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
          />
        </div>
        <div className="relative h-full container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-8">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-brand-500 rounded-xl shadow-lg shadow-brand-500/20 animate-pulse">
              <Zap size={18} className="text-white fill-white" />
              <span className="text-white font-black text-sm uppercase tracking-wider">Flash Deal</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
               <h3 className="text-white !mb-0 text-lg md:text-2xl font-black tracking-tight">
                 Siêu Hội Làm Đẹp <span className="text-brand-300">2026</span>
               </h3>
               <div className="flex items-center gap-2 text-white/50 text-xs md:text-sm font-medium">
                  <Gift size={14} className="text-brand-300" />
                  <span>Nhập mã <b className="text-white">BEAUTY2026</b> giảm ngay 100k</span>
               </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-6 mr-4">
              
            </div>
            <SWTButton
              type="primary"
              onClick={() => router.push("/profile/vouchers")}
              className="!h-[48px] !px-8 !rounded-xl !bg-white !text-brand-600 !border-none !font-black hover:!bg-brand-50 hover:!scale-105 !transition-all flex items-center gap-2 group/btn"
            >
              SĂN NGAY
            </SWTButton>
          </div>
        </div>

        {/* Floating Sparkles */}
        <div className="absolute bottom-2 right-[20%] text-white/20 animate-bounce delay-300">
          <Sparkles size={16} />
        </div>
      </div>
    </div>
  );
};


export default PromoBanner;
