"use client";

import { useTransition } from 'react';
import ProductFilters from "./components/ProductFilters";
import ProductTable from "./components/ProductTable";
import SWTTabs from "@/src/@core/component/AntD/SWTTabs";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useProducts } from "@/src/hooks/admin/product.hook";

export default function ProductsClient() {
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
        <div className="mt-4 p-6 bg-bg-card backdrop-blur-md rounded-2xl shadow-sm border border-border-default dark:border-border-brand transition-colors">
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
        <div className="mt-4 p-6 bg-bg-card backdrop-blur-md rounded-2xl shadow-sm border border-border-default dark:border-border-brand transition-colors">
          <ProductFilters startTransition={startTransition} />
          <ProductTable isPending={isPending} />
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
