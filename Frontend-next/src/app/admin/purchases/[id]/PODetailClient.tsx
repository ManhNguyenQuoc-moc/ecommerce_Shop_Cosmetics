"use client";

import { useState } from "react";
import {
  usePurchaseOrderById,
} from "@/src/services/admin/iventory/purchase.hook";
import {  confirmPurchaseOrder,
  cancelPurchaseOrder,
  resubmitPurchaseOrder } from "@/src/services/admin/iventory/purchase.service";
import { exportPOTopdf, exportPOToExcel } from "@/src/@core/utils/excelandpdf/exportPO";
import {
  CheckCircle2,
  PackageCheck,
  Edit,
  ArrowLeft,
  XCircle,
} from "lucide-react";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import SWTConfirmModal from "@/src/@core/component/AntD/SWTConfirmModal";
import { showNotificationSuccess, showNotificationError } from "@/src/@core/utils/message";
import { POStatusType, PO_STATUS_LABELS } from "@/src/services/models/purchase/output.dto";
import { useRouter } from "next/navigation";
import POHeader from "../components/POHeader";
import Link from "next/link";

// Sub-components
import POStatusTimeline from "./components/POStatusTimeline";
import PODetailCards from "./components/PODetailCards";
import POOrderedItems from "./components/POOrderedItems";
import POReceiptSection from "./components/POReceiptSection";
import SWTLoading from "@/src/@core/component/AntD/SWTLoading";
import { Empty } from "antd";

export default function PODetailClient({ id }: { id: string }) {
  const { po, isLoading: loading, mutate } = usePurchaseOrderById(id);
  const router = useRouter();

  const [isConfirming, setIsConfirming] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showReceiveForm, setShowReceiveForm] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [resubmitOpen, setResubmitOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const handleConfirm = async () => {
    if (!po) return;
    try {
      setIsConfirming(true);
      await confirmPurchaseOrder(po.id);
      showNotificationSuccess("Phiếu nhập đã được duyệt thành công!");
      mutate();
    } catch {
      showNotificationError("Lỗi khi duyệt phiếu nhập!");
    } finally {
      setIsConfirming(false);
      setConfirmOpen(false);
    }
  };

  const handleCancel = async () => {
    if (!po) return;
    if (!cancelReason.trim()) {
      showNotificationError("Vui lòng nhập lý do hủy/chỉnh sửa!");
      return;
    }
    try {
      setIsCancelling(true);
      await cancelPurchaseOrder(po.id, cancelReason);
      showNotificationSuccess("Phiếu nhập đã được chuyển sang trạng thái đã hủy!");
      setCancelReason("");
      setCancelOpen(false);
      mutate();
    } catch {
      showNotificationError("Lỗi khi hủy phiếu!");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleResubmit = async () => {
    if (!po) return;
    try {
      setIsConfirming(true); // Using isConfirming spinner
      await resubmitPurchaseOrder(po.id);
      showNotificationSuccess("Phiếu nhập đã được gửi duyệt lại!");
      setResubmitOpen(false);
      mutate();
    } catch {
      showNotificationError("Lỗi khi gửi duyệt lại!");
    } finally {
      setIsConfirming(false);
    }
  };

  const handleExport = async (type: "pdf" | "excel", includeReceipt: boolean) => {
    if (!po) return;
    try {
      if (type === "pdf") {
        await exportPOTopdf(po, includeReceipt);
        showNotificationSuccess(`Đã xuất file PDF ${includeReceipt ? "Thực nhận" : "Phiếu nhập"}!`);
      } else {
        await exportPOToExcel(po, includeReceipt);
        showNotificationSuccess(`Đã xuất file Excel ${includeReceipt ? "Thực nhận" : "Phiếu nhập"}!`);
      }
    } catch {
      showNotificationError("Xuất file thất bại. Vui lòng thử lại.");
    }
  };

  const renderStatusBadge = (status: POStatusType | "CANCELLED") => {
    const map: Record<POStatusType | "CANCELLED", string> = {
      DRAFT: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400",
      CONFIRMED: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-400",
      PARTIALLY_RECEIVED: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/40 dark:text-orange-400",
      COMPLETED: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400",
      CANCELLED: "bg-red-100 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400",
    };
    return (
      <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg border ${map[status] ?? ""}`}>
        {PO_STATUS_LABELS[status] ?? status}
      </span>
    );
  };

  if (loading) {
    return <SWTLoading tip="Đang tải thông tin phiếu nhập..." />;
  }

  if (!po) {
    return (
      <div className="py-20 text-center space-y-4">
        <Empty description="Không tìm thấy dữ liệu phiếu nhập" />
        <SWTButton size="md" className="!w-auto" icon={<ArrowLeft size={16} />} onClick={() => router.back()}>Quay lại</SWTButton>
      </div>
    );
  }

  return (
    <div className="pb-24 flex flex-col gap-6 animate-fade-in relative">
      <POHeader
        title="Chi tiết Phiếu Nhập"
        subtitle={<span className="font-bold flex items-center gap-2">Mã PO: <span className="text-brand-600 drop-shadow-sm">{po.code}</span> {renderStatusBadge(po.status)}</span> as any}
        breadcrumbItems={[
          { title: "Quản lý" },
          { title: "Phiếu nhập hàng", href: "/admin/purchases" },
          { title: po.code },
        ]}
        type="detail"
        onBack={() => router.push("/admin/purchases")}
        extraActions={
          <>
            {(po.status === "DRAFT" || po.status === "CANCELLED") && (
              <Link href={`/admin/purchases/${po.id}/edit`}>
                <SWTButton
                  type="primary"
                  icon={<Edit size={16} />}
                  size="md"
                  className="!bg-brand-500/10 !border-brand-500/20 !text-brand-500 hover:!bg-brand-500/20 !rounded-xl !font-bold !h-10 px-5 !w-auto shadow-sm transition-all"
                >
                  Sửa Phiếu
                </SWTButton>
              </Link>
            )}
            {po.status === "DRAFT" && (
              <div className="flex items-center gap-2">
                <SWTButton
                  icon={<XCircle size={16} />}
                  onClick={() => setCancelOpen(true)}
                  loading={isCancelling}
                  size="sm"
                  className="!bg-red-500/10 !border-red-500/20 !text-red-500 hover:!bg-red-500/20 !rounded-xl !h-10 px-6 !font-bold !w-auto transition-all"
                >
                  Hủy Phiếu
                </SWTButton>
                <SWTButton
                  type="primary"
                  icon={<CheckCircle2 size={16} />}
                  onClick={() => setConfirmOpen(true)}
                  loading={isConfirming}
                  size="sm"
                  className="!bg-brand-500/10 !border-brand-500/20 !text-brand-500 hover:!bg-brand-500/20 !rounded-xl !h-10 px-6 !font-bold shadow-sm !w-auto transition-all"
                >
                  Duyệt Phiếu
                </SWTButton>
              </div>
            )}
            {po.status === "CANCELLED" && (
              <SWTButton
                type="primary"
                icon={<PackageCheck size={16} />}
                onClick={() => setResubmitOpen(true)}
                loading={isConfirming}
                size="sm"
                className="!bg-emerald-500/10 !border-emerald-500/20 !text-emerald-600 dark:!text-emerald-400 hover:!bg-emerald-500/20 !rounded-xl !h-10 px-6 !font-bold shadow-sm !w-auto transition-all"
              >
                Gửi Duyệt Lại
              </SWTButton>
            )}
            {(po.status === "CONFIRMED" || po.status === "PARTIALLY_RECEIVED") && !showReceiveForm && (
              <SWTButton
                type="primary"
                icon={<PackageCheck size={16} />}
                onClick={() => setShowReceiveForm(true)}
                size="sm"
                className="!bg-brand-500/10 !border-brand-500/20 !text-brand-500 hover:!bg-brand-500/20 !rounded-xl !h-10 px-6 !font-bold shadow-sm !w-auto transition-all"
              >
                Bắt Đầu Nhập Kho
              </SWTButton>
            )}
          </>
        }
      />

      <POStatusTimeline status={po.status} />

      <PODetailCards po={po} />

      <POOrderedItems po={po} onExport={handleExport} />

      <POReceiptSection
        po={po}
        showReceiveForm={showReceiveForm}
        setShowReceiveForm={setShowReceiveForm}
        onReceiveSuccess={() => mutate()}
        onExport={handleExport}
      />

      <SWTConfirmModal
        open={confirmOpen}
        variant="info"
        title="Duyệt phiếu nhập hàng?"
        description={`Phiếu ${po.code} sẽ chuyển sang "Đã duyệt" và có thể nhập kho. Các thông tin về giá nhập và số lượng đặt sẽ được chốt.`}
        confirmText="Xác nhận Duyệt"
        cancelText="Để sau"
        loading={isConfirming}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
      />

      <SWTConfirmModal
        open={cancelOpen}
        variant="danger"
        title="Hủy / Yêu cầu chỉnh sửa?"
        description={`Nhập lý do để chuyển phiếu ${po.code} sang trạng thái đã hủy. Nhân viên có thể chỉnh sửa lại sau đó.`}
        confirmText="Xác nhận"
        cancelText="Quay lại"
        loading={isCancelling}
        onConfirm={handleCancel}
        onCancel={() => {
          setCancelOpen(false);
          setCancelReason("");
        }}
      >
        <div className="mt-4">
          <textarea
            className="w-full h-24 p-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-red-500/20 transition-all resize-none"
            placeholder="Màu sắc không đúng, thay đổi số lượng, v.v..."
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
        </div>
      </SWTConfirmModal>

      <SWTConfirmModal
        open={resubmitOpen}
        variant="info"
        title="Gửi duyệt lại phiếu nhập hàng?"
        description={`Phiếu ${po.code} sẽ chuyển sang trạng thái "Nháp" để quản trị viên có thể xem xét và phê duyệt lại.`}
        confirmText="Xác nhận gửi"
        cancelText="Để sau"
        loading={isConfirming}
        onConfirm={handleResubmit}
        onCancel={() => setResubmitOpen(false)}
      />
    </div>
  );
}
