"use client"
import SWTBreadcrumb from "@/src/@core/component/AntD/SWTBreadcrumb";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import SWTInput from "@/src/@core/component/AntD/SWTInput";
import { Layers, Info } from "lucide-react";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";
import VariantTable from "./components/VariantTable";
import VariantFilters from "./components/VariantFilters";
import useSWTTitle from "@/src/@core/hooks/useSWTTitle";
import { useVariants } from "@/src/services/admin/product.service";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTransition } from "react";
import SWTTabs from "@/src/@core/component/AntD/SWTTabs";
import { ProductQueryParams } from "@/src/services/models/product/input.dto";

export default function AdminVariantsPage() {
  useSWTTitle("Quản lý Biến Thể | Admin");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const activeTab = searchParams.get("status") === "hidden" ? "hidden" : "active";

  const onTabChange = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("status", key);
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const page = Number(searchParams.get("page") ?? 1);
  const pageSize = Number(searchParams.get("pageSize") ?? 6);
  
  const filters: ProductQueryParams = {
    status: activeTab,
    search: searchParams.get("search") || undefined,
    sortBy: searchParams.get("sortBy") || undefined,
    classification: searchParams.get("classification") || undefined,
    priceRange: searchParams.get("priceRange") || undefined,
    statusName: searchParams.get("statusName") || undefined,
  };

  const { variants, total, isLoading, mutate } = useVariants(page, pageSize, filters);

  const { total: activeTotal } = useVariants(1, 1, { status: 'active' });
  const { total: hiddenTotal } = useVariants(1, 1, { status: 'hidden' });

  const handlePaginationChange = (p: number, f: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", p.toString());
    params.set("pageSize", f.toString());
    router.replace(`${pathname}?${params.toString()}`);
  };

  const tabItems = [
    {
      key: "active",
      label: "Đang hoạt động",
      prefix: { value: activeTotal || 0, color: "primary", variant: "light" } as const,
      children: (
        <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl shadow-sm dark:shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-slate-200 dark:border-pink-500/20 transition-colors p-6 mt-4">
          <VariantFilters startTransition={startTransition} onUpdate={() => mutate()} />
          <VariantTable 
            variants={variants} 
            total={total} 
            isLoading={isLoading} 
            isPending={isPending}
            page={page} 
            pageSize={pageSize} 
            onPaginationChange={handlePaginationChange}
            mutate={mutate}
          />
        </div>
      )
    },
    {
      key: "hidden",
      label: "Đã ẩn",
      prefix: { value: hiddenTotal || 0, color: "error", variant: "light" } as const,
      children: (
        <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl shadow-sm dark:shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-slate-200 dark:border-pink-500/20 transition-colors p-6 mt-4">
          <VariantFilters startTransition={startTransition} onUpdate={() => mutate()} />
          <VariantTable 
            variants={variants} 
            total={total} 
            isLoading={isLoading} 
            isPending={isPending}
            page={page} 
            pageSize={pageSize} 
            onPaginationChange={handlePaginationChange}
            mutate={mutate}
          />
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in relative z-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <SWTBreadcrumb items={[
            { title: "Trang chủ", href: "/admin" },
            { title: "Variants" }
          ]} />
          <div className="relative mt-2 overflow-hidden bg-gradient-to-r from-brand-500 to-rose-600 text-white px-5 py-2.5 rounded-tl-xl rounded-tr-3xl rounded-br-3xl rounded-bl-md shadow-lg shadow-brand-500/40 border border-white/20 flex items-center gap-3 w-fit group/title cursor-default mt-3 mb-2">
            <div className="absolute inset-0 bg-white/20 -skew-x-12 animate-sweep" />
            <Layers size={28} className="drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] animate-pulse shrink-0" />
            <h2 className="!mb-0 text-2xl font-black tracking-tight drop-shadow-md whitespace-nowrap">
              Quản lý Biến thể
            </h2>
          </div>
          <p className="text-brand-500 dark:text-cyan-400 text-sm font-semibold uppercase tracking-widest drop-shadow-sm dark:drop-shadow-[0_0_5px_rgba(0,240,255,0.3)]">
             Phân loại thuộc tính màu sắc, kích thước và dung tích.
          </p>
        </div>
        <SWTTooltip
          title={<span className="text-sm">Quản lý kích thước, màu sắc và thuộc tính sản phẩm.</span>}
          placement="left"
          color="purple"
        >
          <div className="!h-11 !w-11 flex items-center justify-center bg-fuchsia-50 hover:bg-fuchsia-500/10 dark:bg-slate-800 dark:hover:bg-slate-700 text-fuchsia-600 dark:text-purple-400 rounded-xl cursor-help transition-all shadow-sm border border-fuchsia-200 dark:border-slate-700 group">
            <Info size={22} className="stroke-[2.5] group-hover:scale-110 transition-transform" />
          </div>
        </SWTTooltip>
      </div>

      {/* Tabs Container */}
      <div className="w-full">
        <SWTTabs
          activeKey={activeTab}
          onChange={onTabChange}
          items={tabItems}
          className="[&_.ant-tabs-nav]:!mb-0 [&_.ant-tabs-nav]:after:!hidden [&_.ant-tabs-tab]:!px-6 [&_.ant-tabs-tab]:!py-3 [&_.ant-tabs-tab-active]:!bg-brand-500/10 [&_.ant-tabs-tab]:!rounded-t-2xl transition-all"
        />
      </div>
    </div>
  );
}
