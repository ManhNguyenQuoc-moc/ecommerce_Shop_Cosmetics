"use client";

import Link from "next/link";
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail } from "lucide-react";
import NewsletterSection from "@/src/app/(customer)/home/components/NewsletterSection";

export default function AppFooter() {
  return (
    <footer className="bg-brand-25">
      <div className="border-t border-brand-200/50 pt-16 pb-12">

        {/* Grid */}
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-y-12">

          {/* LEFT */}
          <div className="lg:col-span-4 lg:row-span-2 flex flex-col justify-between h-full max-w-md space-y-10 lg:space-y-0">

            <div>
              {/* Logo */}
              <Link href="/" className="group flex items-center gap-3 w-fit">
                <div className="flex flex-col">
                  <span className="font-black text-xl md:text-2xl text-brand-900 tracking-tight leading-none">
                    COSMETICS
                  </span>
                  <span className="font-bold text-[10px] md:text-[11px] text-brand-600 tracking-[0.3em] leading-none mt-1.5 uppercase">
                    Premium Beauty Shop
                  </span>
                </div>
              </Link>

              {/* Description */}
              <p className="text-sm text-brand-900/70 leading-loose font-medium pr-4 mt-5">
                Tự hào là điểm đến mua sắm mỹ phẩm chính hãng cực kỳ uy tín.
                Chúng tôi cam kết mang lại vẻ đẹp tỏa sáng và sự tự tin cho bạn
                với những sản phẩm chăm sóc sắc đẹp hàng đầu.
              </p>
            </div>

            {/* Social + Payment */}
            <div className="flex flex-col gap-8">

              {/* Social */}
              <div>
                <p className="text-xs text-brand-500 font-bold uppercase tracking-wider mb-4">
                  Kết nối với chúng tôi
                </p>
                <div className="flex items-center gap-4">
                  <a className="w-11 h-11 rounded-full bg-white border border-brand-200 flex items-center justify-center text-brand-600 hover:bg-brand-500 hover:text-white transition-all shadow-sm hover:shadow-lg hover:-translate-y-1 cursor-pointer">
                    <Facebook size={20} />
                  </a>
                  <a className="w-11 h-11 rounded-full bg-white border border-brand-200 flex items-center justify-center text-brand-600 hover:bg-brand-500 hover:text-white transition-all shadow-sm hover:shadow-lg hover:-translate-y-1 cursor-pointer">
                    <Instagram size={20} />
                  </a>
                  <a className="w-11 h-11 rounded-full bg-white border border-brand-200 flex items-center justify-center text-brand-600 hover:bg-brand-500 hover:text-white transition-all shadow-sm hover:shadow-lg hover:-translate-y-1 cursor-pointer">
                    <Youtube size={20} />
                  </a>
                </div>
              </div>

              {/* Payment */}
              <div>
                <p className="text-xs text-brand-500 font-bold uppercase tracking-wider mb-4">
                  Phương thức thanh toán
                </p>
                <div className="flex flex-wrap gap-3">

                  {/* Mastercard */}
                  <div className="bg-white px-2 py-1 rounded shadow-sm border border-gray-100 flex items-center justify-center h-9 w-14 transition-transform hover:-translate-y-1 cursor-default">
                    <div className="flex -space-x-1.5">
                      <div className="w-4 h-4 rounded-full bg-[#eb001b] mix-blend-multiply opacity-90"></div>
                      <div className="w-4 h-4 rounded-full bg-[#f79e1b] mix-blend-multiply opacity-90"></div>
                    </div>
                  </div>

                  {/* ATM */}
                  <div className="bg-white px-1.5 py-0.5 rounded shadow-sm border border-gray-100 flex flex-col items-center justify-center h-9 w-14 transition-transform hover:-translate-y-1 cursor-default">
                    <div className="w-full h-1.5 bg-[#008c45]"></div>
                    <span className="text-[9px] font-black text-[#008c45] mt-0.5 tracking-tighter">
                      ATM
                    </span>
                  </div>

                  {/* VISA */}
                  <div className="bg-white px-2 py-1 rounded shadow-sm border border-gray-100 flex items-center justify-center h-9 w-14 transition-transform hover:-translate-y-1 cursor-default">
                    <span className="text-[12px] font-black text-[#1a1f71] italic tracking-tighter">
                      VISA
                    </span>
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* ABOUT */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-brand-900 text-lg mb-6">Về chúng tôi</h3>
            <ul className="space-y-5 text-sm font-medium text-brand-900/70">
              <li><Link href="#" className="text-brand-900/70 hover:text-brand-600 hover:pl-1 transition-all">Giới thiệu cửa hàng</Link></li>
              <li><Link href="#" className="text-brand-900/70 hover:text-brand-600 hover:pl-1 transition-all">Tuyển dụng</Link></li>
              <li><Link href="#" className="text-brand-900/70 hover:text-brand-600 hover:pl-1 transition-all">Liên hệ hợp tác</Link></li>
              <li><Link href="#" className="text-brand-900/70 hover:text-brand-600 hover:pl-1 transition-all">Tin tức làm đẹp</Link></li>
            </ul>
          </div>

          {/* SUPPORT */}
          <div className="lg:col-span-3">
            <h3 className="font-bold text-brand-900 text-lg mb-6">Hỗ trợ khách hàng</h3>
            <ul className="space-y-5 text-sm font-medium text-brand-900/70">
              <li><Link href="#" className="text-brand-900/70 hover:text-brand-600 hover:pl-1 transition-all">Chính sách đổi trả</Link></li>
              <li><Link href="#" className="text-brand-900/70 hover:text-brand-600 hover:pl-1 transition-all">Chính sách bảo hành</Link></li>
              <li><Link href="#" className="text-brand-900/70 hover:text-brand-600 hover:pl-1 transition-all">Hướng dẫn mua sắm</Link></li>
              <li><Link href="#" className="text-brand-900/70 hover:text-brand-600 hover:pl-1 transition-all">Kiểm tra đơn hàng</Link></li>
            </ul>
          </div>

          {/* CONTACT */}
          <div className="lg:col-span-3">
            <h3 className="font-bold text-brand-900 text-lg mb-6">Liên hệ</h3>
            <ul className="space-y-5 text-sm font-medium text-brand-900/70">
              <li className="flex items-start gap-4">
                <MapPin size={20} className="text-brand-500 mt-0.5 shrink-0" />
                <span className="leading-relaxed">123 Đường Sắc Đẹp, Quận 1, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone size={20} className="text-brand-500 shrink-0" />
                <span>1900 1234 (Miễn phí)</span>
              </li>
              <li className="flex items-center gap-4">
                <Mail size={20} className="text-brand-500 shrink-0" />
                <span>support@cosmetics.com</span>
              </li>
            </ul>
          </div>
          <div className="lg:col-span-8 lg:col-start-5 w-full pt-8 lg:pt-0 self-end">
            <NewsletterSection />
          </div>

        </div>
      </div>

      {/* Bottom */}
      <div className="bg-brand-50 border-t border-brand-200/50 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm font-medium text-brand-900/60 text-center md:text-left">
            © 2026 Cosmetics Shop. Đã đăng ký bản quyền.
          </div>
        </div>
      </div>

    </footer>
  );
}