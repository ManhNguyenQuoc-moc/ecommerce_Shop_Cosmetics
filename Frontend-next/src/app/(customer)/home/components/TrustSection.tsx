"use client";

import { ShieldCheck, Truck, RefreshCcw, Headphones } from "lucide-react";
import SWTCard from "@/src/@core/component/AntD/SWTCard";

const features = [
  {
    icon: <Truck className="text-brand-500" size={24} />,
    title: "Miễn phí vận chuyển",
    description: "Cho đơn hàng từ 500k",
  },
  {
    icon: <ShieldCheck className="text-brand-500" size={24} />,
    title: "100% Chính hãng",
    description: "Cam kết nguồn gốc xuất xứ",
  },
  {
    icon: <RefreshCcw className="text-brand-500" size={24} />,
    title: "Đổi trả dễ dàng",
    description: "Trong vòng 7 ngày làm việc",
  },
  {
    icon: <Headphones className="text-brand-500" size={24} />,
    title: "Hỗ trợ 24/7",
    description: "Tư vấn làm đẹp chuyên nghiệp",
  },
];

export default function TrustSection() {
  return (
    <SWTCard className="!border-none !shadow-sm !rounded-2xl overflow-hidden" bodyClassName="p-0">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {features.map((feature, index) => (
        <div 
          key={index} 
          className="group p-5 md:p-6 rounded-[2rem] bg-white/40 backdrop-blur-xl border border-white/20 hover:bg-white/60 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 flex flex-col items-center text-center gap-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-500 group-hover:scale-110 transition-transform">
            {feature.icon}
          </div>
          <div>
            <h3 className="font-bold text-sm text-gray-900">{feature.title}</h3>
            <p className="text-[10px] text-gray-500 font-medium">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
    </SWTCard>
  );
}
