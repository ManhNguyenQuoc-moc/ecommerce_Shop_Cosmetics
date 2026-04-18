
import { getServerBrands, getServerCategories } from "@/src/services/customer/home/customer.service";
import SWTBreadcrumb from "@/src/@core/component/AntD/SWTBreadcrumb";
import BrandFeaturedSelection from "./components/BrandFeaturedSelection";
import BrandGridClient from "./components/BrandGridClient";

export const revalidate = 3600; // 1 hour

export default async function BrandPage() {
  const [brands, categories] = await Promise.all([
    getServerBrands(1, 1000),
    getServerCategories()
  ]);
  const featuredBrands = brands.slice(0, 3);
  return (
    <div className="flex flex-col gap-16 pb-24 animate-fade-in max-w-7xl mx-auto">
      {/* Header & Breadcrumb */}
      <div className="relative pt-8 flex flex-col gap-4">
        <SWTBreadcrumb items={[
          { title: "Trang chủ", href: "/" },
          { title: "Thương hiệu" }
        ]} />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="!m-0 text-5xl font-black tracking-tight text-brand-900 drop-shadow-sm mt-2">
              Thương hiệu <span className="text-brand-500">Đối tác</span>
            </h1>
            <p className="text-brand-500 max-w-lg leading-relaxed text-lg italic">
              Nơi quy tụ những cái tên hàng đầu thế giới về chăm sóc vẻ đẹp.
            </p>
          </div>
        </div>
      </div>
      {featuredBrands.length > 0 && (
        <BrandFeaturedSelection brands={featuredBrands} />
      )}
      <section className="flex flex-col gap-12">
        <div className="flex items-center gap-4">
          <div className="h-px bg-slate-100 flex-1" />
          <p className="text-sm font-black uppercase tracking-[0.3em] text-brand-500 px-8 whitespace-nowrap bg-white relative z-10 shadow-sm py-2 rounded-full border border-slate-50">
            Khám phá tất cả
          </p>
          <div className="h-px bg-slate-100 flex-1" />
        </div>
        <BrandGridClient brands={brands} categories={categories} />
      </section>
    </div>
  );
}