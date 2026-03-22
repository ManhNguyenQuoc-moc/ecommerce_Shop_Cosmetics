"use client";

import { Sparkles, Flower2, Heart, Star, Droplet, Wand2 } from "lucide-react";

const BackgroundDecor = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-gradient-to-br from-[#f8f5f6] to-[#fffbfc] min-h-screen w-full">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-200/20 blur-[130px] rounded-full mix-blend-multiply animate-[spin_20s_linear_infinite]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-brand-500/15 blur-[160px] rounded-full mix-blend-multiply animate-[spin_30s_linear_infinite_reverse]" />
      <div className="absolute top-[25%] right-[5%] w-[40%] h-[40%] bg-brand-200/30 blur-[120px] rounded-full mix-blend-multiply animate-[spin_25s_linear_infinite]" />
      <div className="absolute bottom-[15%] left-[10%] w-[40%] h-[40%] bg-brand-400/15 blur-[140px] rounded-full mix-blend-multiply animate-[spin_35s_linear_infinite_reverse]" />
      <div className="absolute inset-0 z-0 opacity-[0.15]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="premium-pattern" x="0" y="0" width="160" height="160" patternUnits="userSpaceOnUse">
              {/* Star 1 */}
              <path d="M40 25 L41.5 38.5 L55 40 L41.5 41.5 L40 55 L38.5 41.5 L25 40 L38.5 38.5 Z" className="fill-brand-200" />
              <circle cx="15" cy="15" r="2.5" className="fill-brand-200" opacity="0.8" />
              <circle cx="65" cy="65" r="3" className="fill-brand-200" opacity="0.6" />
              
              {/* Star 2 */}
              <path d="M120 105 L121.5 118.5 L135 120 L121.5 121.5 L120 135 L118.5 121.5 L105 120 L118.5 118.5 Z" className="fill-brand-200" opacity="0.7" />
              <circle cx="95" cy="95" r="2" className="fill-brand-200" opacity="0.9" />
              <circle cx="145" cy="145" r="3.5" className="fill-brand-200" opacity="0.5" />
              
              {/* Diamonds */}
              <rect x="80" y="25" width="6" height="6" transform="rotate(45 83 28)" className="fill-brand-200" />
              <rect x="25" y="105" width="8" height="8" transform="rotate(45 29 109)" className="fill-brand-200" opacity="0.7" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#premium-pattern)" />
        </svg>
      </div>

      {/* 3. Floating Cosmetic Accent Icons - Đa dạng icon, màu brand-200/30 (mờ) */}
      <div className="absolute top-[10%] left-[8%] text-brand-200/30 animate-[bounce_5s_infinite]">
        <Sparkles size={90} strokeWidth={1} />
      </div>
      <div className="absolute top-[18%] right-[15%] text-brand-200/30 animate-[bounce_7s_infinite] delay-300">
        <Wand2 size={70} strokeWidth={1} className="animate-[spin_15s_linear_infinite]" />
      </div>
      
      <div className="absolute top-[45%] right-[5%] text-brand-200/30 animate-[bounce_6s_infinite] delay-700">
        <Flower2 size={110} strokeWidth={0.5} className="animate-[spin_20s_linear_infinite]" />
      </div>
      <div className="absolute top-[50%] left-[10%] text-brand-200/30 animate-[bounce_8s_infinite] delay-500">
        <Droplet size={60} strokeWidth={1.5} className="animate-[spin_25s_linear_infinite_reverse]" />
      </div>

      <div className="absolute bottom-[20%] left-[25%] text-brand-200/30 animate-[bounce_5s_infinite] delay-1000">
        <Star size={70} strokeWidth={1} />
      </div>
      <div className="absolute bottom-[10%] right-[20%] text-brand-200/30 animate-[bounce_6s_infinite] delay-1200">
        <Heart size={80} strokeWidth={1} className="animate-[pulse_3s_ease-in-out_infinite]" />
      </div>

    </div>
  );
};

export default BackgroundDecor;