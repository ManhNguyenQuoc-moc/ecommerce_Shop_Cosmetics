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
      <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-pink-500/20 transition-colors">
        <CreatePOForm onSuccess={() => router.push("/admin/purchases")} />
      </div>
    </div>
  );
}
