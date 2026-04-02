"use client";

import React, { Suspense, useTransition } from "react";
import useSWTTitle from "@/src/@core/hooks/useSWTTitle";
import POTable from "./components/POTable";
import POFilters from "./components/POFilters";
import POHeader from "./components/POHeader";

export default function PurchasesPage() {
  useSWTTitle("Quản Lý Nhập Hàng | Admin");
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-6 animate-fade-in">
      <POHeader
        title="Quản lý Nhập hàng (PO)"
        subtitle="Tạo phiếu nhập, duyệt và theo dõi trạng thái biên nhận hàng hóa."
        breadcrumbItems={[
          { title: "Trang chủ", href: "/admin" },
          { title: "Quản lý Nhập hàng" },
        ]}
      />
      <div className="p-6 bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl shadow-sm dark:shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-slate-200 dark:border-amber-500/20 transition-colors">
        <Suspense>
          <POFilters startTransition={startTransition} />
          <POTable isPending={isPending} />
        </Suspense>
      </div>
    </div>
  );
}
