"use client";

import React, { useTransition } from 'react';
import VariantTable from "./components/VariantTable";
import VariantFilters from "./components/VariantFilters";
import SWTTabs from "@/src/@core/component/AntD/SWTTabs";
import { useVariants } from "@/src/hooks/admin/product.hook";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ProductQueryParams } from "@/src/services/models/product/input.dto";

export default function VariantsClient() {
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
        <div className="bg-bg-card backdrop-blur-md rounded-2xl shadow-sm border border-border-default dark:border-border-brand transition-colors p-6 mt-4">
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
        <div className="bg-bg-card backdrop-blur-md rounded-2xl shadow-sm border border-border-default dark:border-border-brand transition-colors p-6 mt-4">
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
    <div className="w-full">
      <SWTTabs
        activeKey={activeTab}
        onChange={onTabChange}
        items={tabItems}
        className="[&_.ant-tabs-nav]:!mb-0 [&_.ant-tabs-nav]:after:!hidden [&_.ant-tabs-tab]:!px-6 [&_.ant-tabs-tab]:!py-3 [&_.ant-tabs-tab-active]:!bg-brand-500/10 [&_.ant-tabs-tab]:!rounded-t-2xl transition-all"
      />
    </div>
  );
}
