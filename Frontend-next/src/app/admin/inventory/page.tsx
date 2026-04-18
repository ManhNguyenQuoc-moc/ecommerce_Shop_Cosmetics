import React from "react";
import AdminPageHeader from "../components/AdminPageHeader";
import { Package, Info } from "lucide-react";
import InventoryClient from "./InventoryClient";

export const metadata = {
  title: "Quản lý Tồn Kho | Admin",
};

export const dynamic = "force-dynamic";

export default function InventoryPage() {
  return (
    <div className="space-y-6 animate-fade-in relative z-0">
      <AdminPageHeader
        title="Quản lý Tồn kho"
        subtitle="Theo dõi số lượng hàng, hạn sử dụng và lịch sử nhập xuất."
        icon={<Package size={32} />}
        breadcrumbs={[
          { title: "Trang chủ", href: "/admin" },
          { title: "Tồn kho" }
        ]}
        tooltip={{
          title: "Quản lý lô hàng, hạn sử dụng và phân tích tồn kho thực tế.",
          placement: "left"
        }}
      />

      <InventoryClient />
    </div>
  );
}
