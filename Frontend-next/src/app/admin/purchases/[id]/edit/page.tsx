"use client";

import { useRouter } from "next/navigation";
import EditPOForm from "../../components/EditPOForm";
import { usePurchaseOrderById } from "@/src/services/admin/purchase.service";
import { useParams } from "next/navigation";

import POHeader from "../../components/POHeader";

export default function EditPOPage() {
  const params = useParams() as { id?: string } | null;
  const id = params?.id || null;
  const { po } = usePurchaseOrderById(id);
  const router = useRouter();

  return (
    <div className="space-y-6">
      <POHeader
        title={`Chỉnh Sửa Phiếu #${po?.code ?? "..."}`}
        subtitle="Cập nhật thông tin hàng hóa, số lượng và giá nhập cho phiếu nháp."
        type="edit"
        onBack={() => router.back()}
        breadcrumbItems={[
          { title: "Trang chủ", href: "/admin" },
          { title: "Quản lý Nhập hàng", href: "/admin/purchases" },
          { title: "Chỉnh sửa phiếu nhập" },
        ]}
      />
      <div className="admin-card-form p-6">
        <EditPOForm
          po={po ?? null}
          onCancel={() => router.back()}
          onSuccess={() => router.back()}
        />
      </div>
    </div>
  );
}
