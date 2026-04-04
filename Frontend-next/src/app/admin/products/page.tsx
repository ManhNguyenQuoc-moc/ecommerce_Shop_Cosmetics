"use client";

import React from 'react';
import ProductFilters from "./components/ProductFilters";
import ProductTable from "./components/ProductTable";
import { Info, Package } from "lucide-react";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";
import SWTBreadcrumb from "@/src/@core/component/AntD/SWTBreadcrumb";
import useSWTTitle from "@/src/@core/hooks/useSWTTitle";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTransition } from "react";
import SWTTabs from "@/src/@core/component/AntD/SWTTabs";
import { useProducts } from "@/src/services/admin/product.service";

export default function ProductsPage() {
  useSWTTitle("Quản Lý Sản Phẩm | Admin");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const activeTab = searchParams.get("status") === "hidden" ? "hidden" : "active";

  const { total: activeTotal } = useProducts(1, 1, { status: "active_tab" });
  const { total: hiddenTotal } = useProducts(1, 1, { status: "hidden" });

  const onTabChange = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (key === "active") {
      params.set("status", "active");
    } else {
      params.set("status", "hidden");
    }
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const tabItems = [
    {
      key: "active",
      label: "Đang hoạt động",
      prefix: { value: activeTotal || 0, color: "primary" as any, variant: "light" as any },
      children: (
        <div className="mt-4 p-6 bg-white/80 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200 dark:border-admin-sidebar-border transition-colors">
          <ProductFilters startTransition={startTransition} />
          <ProductTable isPending={isPending} />
        </div>
      )
    },
    {
      key: "hidden",
      label: "Đã ẩn",
      prefix: { value: hiddenTotal || 0, color: "error" as any, variant: "light" as any },
      children: (
        <div className="mt-4 p-6 bg-white/80 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200 dark:border-admin-sidebar-border transition-colors">
          <ProductFilters startTransition={startTransition} />
          <ProductTable isPending={isPending} />
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <SWTBreadcrumb items={[
            { title: "Trang chủ", href: "/admin" },
            { title: "Products" }
          ]} />
          <div className="flex items-center gap-3.5 mt-4 mb-2">
            <Package size={32} className="text-brand-500 shrink-0" />
            <h2 className="!mb-0 text-3xl font-black tracking-tight text-brand-600 dark:text-admin-accent whitespace-nowrap">
              Quản lý Sản phẩm
            </h2>
          </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-widest">
              Xem, thêm mới và quản lý thông tin các sản phẩm trong kho.
            </p>
        </div>

        <SWTTooltip
          title={<span className="text-sm">Quản lý danh lục sản phẩm, giá bán và phân loại danh mục.</span>}
          placement="left"
          color="pink"
        >
          <div className="!h-11 !w-11 flex items-center justify-center bg-brand-50 hover:bg-brand-500/10 dark:bg-slate-800 dark:hover:bg-slate-700 text-brand-600 dark:text-admin-accent rounded-xl cursor-help transition-all shadow-sm border border-brand-200 dark:border-slate-700 group">
            <Info size={22} className="stroke-[2.5] group-hover:scale-110 transition-transform" />
          </div>
        </SWTTooltip>
      </div>
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
