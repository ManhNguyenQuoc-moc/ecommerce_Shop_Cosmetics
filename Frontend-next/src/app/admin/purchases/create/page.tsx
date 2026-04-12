"use client";

import CreatePOForm from "../components/CreatePOForm";
import POHeader from "../components/POHeader";
import { useRouter } from "next/navigation";

export default function CreatePOPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <POHeader
        title="Tạo Phiếu Nhập Hàng"
        subtitle="Thiết lập thông tin đơn nhập hàng mới từ thương hiệu."
        type="create"
        onBack={() => router.back()}
        breadcrumbItems={[
          { title: "Trang chủ", href: "/admin" },
          { title: "Quản lý Nhập hàng", href: "/admin/purchases" },
          { title: "Tạo phiếu nhập" },
        ]}
      />
      <div className="admin-card-form p-6">
        <CreatePOForm onSuccess={() => router.push("/admin/purchases")} />
      </div>
    </div>
  );
}
