"use client";

import dynamic from "next/dynamic";
import AdminPageHeader from "../../components/AdminPageHeader";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import SWTLoading from "@/src/@core/component/AntD/SWTLoading";

const CreatePOForm = dynamic(() => import("../components/CreatePOForm"), {
  ssr: false,
  loading: () => <SWTLoading tip="Đang chuẩn bị biểu mẫu nhập hàng..." />
});

export default function CreatePOClient() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Tạo Phiếu Nhập Hàng"
        subtitle="Thiết lập thông tin đơn nhập hàng mới từ thương hiệu."
        icon={<Plus size={32} />}
        breadcrumbs={[
          { title: "Trang chủ", href: "/admin" },
          { title: "Quản lý Nhập hàng", href: "/admin/purchases" },
          { title: "Tạo phiếu nhập" },
        ]}
        tooltip={{
          title: "Tạo phiếu nhập hàng mới và quản lý chi tiết từ nhà cung cấp.",
          placement: "left"
        }}
      />
      <CreatePOForm onSuccess={() => router.push("/admin/purchases")} />
    </div>
  );
}
