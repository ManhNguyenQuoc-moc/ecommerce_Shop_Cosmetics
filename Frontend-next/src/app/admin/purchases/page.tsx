
import { Suspense } from "react";
import { Truck } from "lucide-react";
import AdminPageHeader from "../components/AdminPageHeader";
import PurchasesClient from "./PurchasesClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Quản Lý Nhập Hàng | Admin",
};

export default function PurchasesPage() {
  return (
    <div className="space-y-6 animate-fade-in text-text-main">
      <AdminPageHeader
        title="Quản lý Nhập hàng (PO)"
        subtitle="Tạo phiếu nhập, duyệt và theo dõi trạng thái biên nhận hàng hóa."
        icon={<Truck size={32} />}
        breadcrumbs={[
          { title: "Trang chủ", href: "/admin" },
          { title: "Quản lý Nhập hàng" },
        ]}
        tooltip={{
          title: "Quản lý phiếu nhập hàng, duyệt và lịch sử nhập kho.",
          placement: "left"
        }}
      />
        <PurchasesClient />
    </div>
  );
}
