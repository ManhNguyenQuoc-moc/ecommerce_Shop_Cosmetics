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
        <div className="bg-white/80 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200 dark:border-admin-sidebar-border transition-colors p-6 mt-4">
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
        <div className="bg-white/80 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200 dark:border-admin-sidebar-border transition-colors p-6 mt-4">
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
          <div className="flex items-center gap-3.5 mt-4 mb-2">
            <Layers size={32} className="text-brand-500 shrink-0" />
            <h2 className="!mb-0 text-3xl font-black tracking-tight text-brand-600 dark:text-admin-accent whitespace-nowrap">
              Quản lý Biến thể
            </h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-widest">
             Phân loại thuộc tính màu sắc, kích thước và dung tích.
          </p>
        </div>
        <SWTTooltip
          title={<span className="text-sm">Quản lý kích thước, màu sắc và thuộc tính sản phẩm.</span>}
          placement="left"
          color="pink"
        >
          <div className="!h-11 !w-11 flex items-center justify-center bg-brand-50 hover:bg-brand-500/10 dark:bg-slate-800 dark:hover:bg-slate-700 text-brand-600 dark:text-admin-accent rounded-xl cursor-help transition-all shadow-sm border border-brand-200 dark:border-slate-700 group">
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
