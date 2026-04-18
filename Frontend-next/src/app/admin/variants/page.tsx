import React from 'react';
import { Layers, Info } from "lucide-react";
import AdminPageHeader from "../components/AdminPageHeader";
import VariantsClient from "./VariantsClient";

export const dynamic = "force-dynamic";

export default function AdminVariantsPage() {
  return (
    <div className="space-y-6 animate-fade-in relative z-0">
      <AdminPageHeader
        title="Quản lý Biến thể"
        subtitle="Phân loại thuộc tính màu sắc, kích thước và dung tích."
        icon={<Layers size={32} />}
        breadcrumbs={[
          { title: "Trang chủ", href: "/admin" },
          { title: "Variants" }
        ]}
        tooltip={{
          title: "Quản lý kích thước, màu sắc và thuộc tính sản phẩm.",
          placement: "left"
        }}
      />

      <VariantsClient />
    </div>
  );
}
