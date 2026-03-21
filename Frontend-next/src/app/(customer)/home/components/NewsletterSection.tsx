"use client";

import { Mail, Send } from "lucide-react";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import { SWTInput } from "@/src/@core/component/AntD/SWTInput";

export default function NewsletterSection() {
  return (
    <div className="relative overflow-hidden bg-brand-600 rounded-[3rem] p-8 md:p-16 text-white shadow-2xl shadow-brand-200 mt-12 mb-20">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-white/10 to-transparent blur-3xl rounded-full translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-400/20 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2" />


      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="max-w-xl text-center lg:text-left space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-brand-50 text-xs font-black uppercase tracking-widest mb-2">
            <Mail size={14} />
            Đăng ký nhận bản tin
          </div>
          <h2 className="text-4xl md:text-5xl font-black leading-tight italic">
             Nhận ưu đãi <span className="text-brand-200 underline decoration-brand-200/50 underline-offset-8">GIẢM 10%</span> cho đơn hàng đầu tiên
          </h2>
          <p className="text-brand-50/80 font-medium text-lg leading-relaxed">
            Hãy là người đầu tiên nhận thông báo về bộ sưu tập mới và các chương trình khuyến mãi độc quyền từ chúng tôi.
          </p>
        </div>

        <div className="w-full max-w-md">
          <div className="flex flex-col sm:flex-row gap-3 p-2 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20">
            <div className="flex-1">
               <SWTInput 
                placeholder="Địa chỉ email của bạn" 
                className="!bg-white !rounded-2xl !border-none !h-[56px] !px-6 !text-gray-900 placeholder:!text-gray-400"
               />
            </div>
            <SWTButton 
                type="primary" 
                size="lg"
                className="!h-[56px] !px-8 !rounded-2xl !bg-brand-500 !border-none !text-base !font-bold hover:!scale-105 !transition-transform shrink-0 flex items-center gap-2"
                startIcon={<Send size={18} />}
            >
                Gửi mã ngay
            </SWTButton>
          </div>
          <p className="text-white/60 text-[11px] text-center lg:text-left mt-4 font-medium italic">
            * Chúng tôi cam kết bảo mật thông tin và không gửi thư rác.
          </p>
        </div>
      </div>
    </div>
  );
}
