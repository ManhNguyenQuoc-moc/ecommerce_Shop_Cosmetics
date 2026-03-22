"use client";

import { Star, Quote } from "lucide-react";
import Image from "next/image";
import SWTCard from "@/src/@core/component/AntD/SWTCard";

const testimonials = [
  {
    id: 1,
    name: "Minh Anh",
    role: "Beauty Blogger",
    content: "Sản phẩm ở đây thực sự chất lượng, mình đã tin dùng hơn 2 năm nay. Giao hàng cực nhanh và đóng gói rất cẩn thận.",
    rating: 5,
    avatar: "https://placehold.co/100x100?text=MA",
  },
  {
    id: 2,
    name: "Linh Chi",
    role: "Customer",
    content: "Team tư vấn rất nhiệt tình, giúp mình chọn được đúng loại serum phù hợp với da nhạy cảm. Rất hài lòng với dịch vụ!",
    rating: 5,
    avatar: "https://placehold.co/100x100?text=LC",
  },
  {
    id: 3,
    name: "Thảo Vy",
    role: "Makeup Artist",
    content: "Nguồn hàng 100% chính hãng làm mình rất yên tâm khi mua sắm cho khách hàng của mình. Nhiều ưu đãi hấp dẫn nữa.",
    rating: 5,
    avatar: "https://placehold.co/100x100?text=TV",
  },
];

export default function TestimonialSection() {
  return (
    <div className="py-12">
      <div className="flex items-center gap-3 mb-10 px-2 justify-center text-center flex-col md:flex-row md:text-left">
        <div className="w-12 h-12 rounded-full bg-brand-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-brand-200">
          <Quote size={24} fill="currentColor" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight uppercase italic">Khách hàng nói gì về chúng tôi</h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1 opacity-70">Hơn 50.000+ phụ nữ Việt Nam đã tin dùng</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((t) => (
          <SWTCard 
            key={t.id} 
            className="!border-none !shadow-xl !rounded-[2.5rem] !bg-white/40 !backdrop-blur-xl border border-white/20 shadow-brand-500/5 hover:scale-[1.02] transition-transform duration-300"
            bodyClassName="p-8 md:p-10 flex flex-col justify-between h-full"
          >
            <div className="space-y-6">
              <div className="flex gap-1">
                {Array(t.rating).fill(0).map((_, i) => (
                  <Star key={i} size={16} fill="var(--color-brand-100)" className="text-brand-100" />
                ))}
              </div>
              <p className="text-gray-700 italic font-medium leading-relaxed text-lg quote-text">
                "{t.content}"
              </p>
            </div>
            <div className="flex items-center gap-4 pt-8 border-t border-gray-100/50">
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-brand-100 p-0.5">
                <Image src={t.avatar} alt={t.name} fill className="object-cover rounded-full" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">{t.name}</h4>
                <p className="text-xs text-gray-500 font-medium">{t.role}</p>
              </div>
            </div>
          </SWTCard>
        ))}
      </div>
    </div>
  );
}
