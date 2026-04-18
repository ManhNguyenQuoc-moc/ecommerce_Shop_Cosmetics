import React from 'react';
import { Info, Layers } from "lucide-react";
import AdminPageHeader from "../components/AdminPageHeader";
import CategoriesClient from "./CategoriesClient";

export const dynamic = "force-dynamic";

export default function CategoriesPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <AdminPageHeader
        title="Quản lý Danh mục & Nhóm"
        subtitle="Danh sách các danh mục và nhóm phân loại sản phẩm."
        icon={<Layers size={32} />}
        breadcrumbs={[
          { title: "Trang chủ", href: "/admin" },
          { title: "Danh mục & Nhóm" }
        ]}
        tooltip={{
          title: "Quản lý cơ cấu phân cấp sản phẩm giúp khách hàng dễ dàng tìm kiếm.",
          placement: "left"
        }}
      />

      <CategoriesClient />
    </div>
  );
}
