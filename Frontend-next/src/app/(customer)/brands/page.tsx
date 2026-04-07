import React from "react";
import { getServerBrands } from "@/src/services/customer/server-data";
import BrandCard from "./components/BrandCard";
import SWTBreadcrumb from "@/src/@core/component/AntD/SWTBreadcrumb";
import { Sparkles } from "lucide-react";

export default async function BrandPage() {
  const brands = await getServerBrands(1, 100);

  return (
    <div className="space-y-12 pb-20 animate-fade-in">
      {/* Header Section */}
      <div className="relative pt-8">
        <SWTBreadcrumb items={[
          { title: "Trang chủ", href: "/" },
          { title: "Thương hiệu" }
        ]} />
        
        <div className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-6 overflow-hidden">
          <div className="relative">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-brand-900 drop-shadow-sm">
              Khám phá <br className="hidden md:block" /> Thương hiệu <span className="text-brand-500">Đối tác</span>
            </h1>
            <p className="mt-4 text-slate-500 font-semibold max-w-lg leading-relaxed text-lg">
              Bộ sưu tập những thương hiệu mỹ phẩm cao cấp và chính hãng được tin dùng trên toàn thế giới.
            </p>
          </div>

          <div className="relative group w-full md:w-auto h-32 md:h-24 bg-brand-50 rounded-3xl p-6 flex items-center justify-center border border-brand-200 overflow-hidden shadow-inner">
             <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2" />
             <div className="flex items-center gap-4 relative z-10 transition-transform duration-500 group-hover:scale-105">
                <div className="p-3 bg-white rounded-2xl shadow-xl shadow-brand-500/20">
                   <Sparkles className="text-brand-600 fill-brand-100" size={24} />
                </div>
                <div>
                   <span className="block text-2xl font-black text-brand-900 leading-none">{(brands || []).length}</span>
                   <span className="text-[10px] uppercase font-black tracking-[0.2em] text-brand-600 mt-1 block">Đối tác chính hãng</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Brand Grid Area */}
      {brands && brands.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {brands.map((brand) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-white/50 backdrop-blur-sm rounded-[3rem] border-2 border-dashed border-slate-200">
           <div className="inline-flex p-5 bg-slate-100 rounded-full mb-4">
              <Sparkles size={32} className="text-slate-400" />
           </div>
           <h3 className="text-xl font-bold text-slate-700">Chưa có thương hiệu nào</h3>
           <p className="text-slate-500 mt-2">Dữ liệu thương hiệu đang được cập nhật, vui lòng quay lại sau.</p>
        </div>
      )}

      {/* Discovery Note */}
      <div className="bg-brand-900 rounded-[3rem] p-10 md:p-16 relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-600/30 to-transparent z-0" />
         <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-brand-500/20 blur-3xl rounded-full z-0" />
         
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-2xl text-center md:text-left">
               <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                  Bạn đang tìm mã giảm giá từ thương hiệu yêu thích?
               </h2>
               <p className="mt-4 text-white/70 text-lg font-medium">
                  Đừng bỏ lỡ các chương trình ưu đãi độc quyền chỉ dành riêng cho bạn khi mua sắm tại Cosmetics Shop.
               </p>
            </div>
            <button className="whitespace-nowrap px-8 py-4 bg-white text-brand-900 font-black rounded-2xl hover:bg-brand-50 transition-all shadow-xl hover:-translate-y-1 active:translate-y-0">
               Xem Deal Hot Ngay
            </button>
         </div>
      </div>
    </div>
  );
}