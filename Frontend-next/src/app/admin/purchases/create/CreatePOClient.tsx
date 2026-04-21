"use client";

import dynamic from "next/dynamic";
import AdminPageHeader from "../../components/AdminPageHeader";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import SWTLoading from "@/src/@core/component/AntD/SWTLoading";
import SWTButton from "@/src/@core/component/AntD/SWTButton";

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
        rightActions={(
          <SWTButton
            size="md"
            onClick={() => router.push("/admin/purchases")}
            className="rounded-xl w-auto px-4 py-2 border text-slate-700 dark:text-slate-200 flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Quay lại
          </SWTButton>
        )}
        tooltip={{
          title: "Tạo phiếu nhập hàng mới và quản lý chi tiết từ nhà cung cấp.",
          placement: "left"
        }}
      />
      <CreatePOForm onSuccess={() => router.push("/admin/purchases")} />
    </div>
  );
}
