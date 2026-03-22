"use client";

import { Mail, Send } from "lucide-react";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import { SWTInput } from "@/src/@core/component/AntD/SWTInput";

export default function NewsletterSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl p-6 sm:p-8 text-white shadow-lg shadow-brand-200/50 border border-brand-400/30">
      {/* Hiệu ứng quét sáng giống HeroBanner */}
      <div className="absolute inset-0 bg-white/30 animate-sweep z-[1] pointer-events-none mix-blend-overlay" />
      
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-brand-900/20 blur-2xl rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8">
        <div className="space-y-3 flex-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-black uppercase tracking-widest shadow-sm">
            <Mail size={12} />
            Đăng ký nhận tin
          </div>
          <p className="text-brand-50 font-medium text-sm leading-relaxed max-w-md">
            Nhận các thông báo về mã giảm giá độc quyền và cập nhật những chương trình Flash Sale sớm nhất từ chúng tôi.
          </p>
        </div>
        <div className="w-full md:w-[460px] space-y-2">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1">
              <SWTInput
                placeholder="Nhập email của bạn..."
                showCount={false}
                className="!bg-white/95 backdrop-blur-sm !rounded-xl !border-none !h-[48px] !px-4 !text-sm !text-gray-900 !w-full shadow-inner focus:!ring-2 focus:!ring-brand-200 transition-all placeholder:text-gray-400"
              />
            </div>
            <SWTButton
              type="primary"
              className="!h-[48px] !w-full sm:!w-auto !rounded-xl !bg-white !text-brand-500 !border-none !text-sm !font-bold flex items-center justify-center gap-2 shadow-lg"
            >
              <Send size={16} />
              Đăng ký 
            </SWTButton>
          </div>
          <p className="text-white/60 text-[10px] italic font-medium px-1">
            * Cam kết bảo mật thông tin, không spam.
          </p>
        </div>
        
      </div>
    </div>
  );
}