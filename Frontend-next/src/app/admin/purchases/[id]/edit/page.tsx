"use client";

import { useRouter } from "next/navigation";
import EditPOForm from "../../components/EditPOForm";
import AdminPageHeader from "../../../components/AdminPageHeader";
import { usePurchaseOrderById } from "@/src/services/admin/iventory/purchase.hook";
import { useParams } from "next/navigation";
import { PencilLine } from "lucide-react";

export default function EditPOPage() {
  const params = useParams() as { id?: string } | null;
  const id = params?.id || null;
  const { po } = usePurchaseOrderById(id);
  const router = useRouter();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={`Chỉnh Sửa Phiếu #${po?.code ?? "..."}`}
        subtitle="Cập nhật thông tin hàng hóa, số lượng và giá nhập cho phiếu nháp."
        icon={<PencilLine size={32} />}
        breadcrumbs={[
          { title: "Trang chủ", href: "/admin" },
          { title: "Quản lý Nhập hàng", href: "/admin/purchases" },
          { title: "Chỉnh sửa phiếu nhập" },
        ]}
        tooltip={{
          title: "Cập nhật chi tiết phiếu nhập hàng trước khi hoàn tất.",
          placement: "left"
        }}
      />
      <EditPOForm
        po={po ?? null}
        onCancel={() => router.back()}
        onSuccess={() => router.back()}
      />
    </div>
  );
}
