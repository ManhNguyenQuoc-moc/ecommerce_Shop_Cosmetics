import React from "react";
import POTable from "./components/POTable";
import POFilters from "./components/POFilters";
import POHeader from "./components/POHeader";
import { Suspense } from "react";
import PurchasesClient from "./PurchasesClient";

export const metadata = {
  title: "Quản Lý Nhập Hàng | Admin",
};

export default function PurchasesPage() {
  return (
    <div className="space-y-6 animate-fade-in text-slate-900">
      <POHeader
        title="Quản lý Nhập hàng (PO)"
        subtitle="Tạo phiếu nhập, duyệt và theo dõi trạng thái biên nhận hàng hóa."
        breadcrumbItems={[
          { title: "Trang chủ", href: "/admin" },
          { title: "Quản lý Nhập hàng" },
        ]}
      />
      <div className="p-6 bg-white/80 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200 dark:border-admin-sidebar-border transition-colors">
        <Suspense>
          <PurchasesClient />
        </Suspense>
      </div>
    </div>
  );
}
