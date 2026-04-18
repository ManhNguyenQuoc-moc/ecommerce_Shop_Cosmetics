import React from 'react';
import { Info, Truck } from "lucide-react";
import AdminPageHeader from "../components/AdminPageHeader";
import SuppliersClient from "./SuppliersClient";

export const dynamic = "force-dynamic";

export default function SuppliersPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <AdminPageHeader
        title="Quản lý Nhà cung cấp"
        subtitle="Danh sách các đối tác, thương hiệu cung cấp sản phẩm."
        icon={<Truck size={32} />}
        breadcrumbs={[
          { title: "Trang chủ", href: "/admin" },
          { title: "Nhà cung cấp" }
        ]}
        tooltip={{
          title: "Quản lý danh sách các nhà cung cấp, đối tác thương hiệu cung ứng hàng hóa.",
          placement: "left"
        }}
      />

      <SuppliersClient />
    </div>
  );
}
