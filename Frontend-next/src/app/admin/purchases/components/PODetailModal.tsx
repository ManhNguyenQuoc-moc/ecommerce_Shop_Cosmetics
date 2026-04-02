"use client";

import { Spin } from "antd";
import { useState } from "react";
import {
  usePurchaseOrderById,
  confirmPurchaseOrder,
  cancelPurchaseOrder,
} from "@/src/services/admin/purchase.service";
import { exportPOTopdf, exportPOToExcel } from "@/src/utils/exportPO";
import {
  FileText,
  FileDown,
  Truck,
  Calendar,
  Hash,
  CheckCircle2,
  XCircle,
  PackageCheck,
  Edit,
} from "lucide-react";
import SWTModal from "@/src/@core/component/AntD/SWTModal";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import SWTConfirmModal from "@/src/@core/component/AntD/SWTConfirmModal";
import ReceiveStockModal from "./ReceiveStockModal";
import { showNotificationSuccess, showNotificationError } from "@/src/@core/utils/message";
import { POItemDto, POStatus, PO_STATUS_LABELS } from "@/src/services/models/purchase/output.dto";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  poId: string | null;
  onMutate?: () => void;
};

export default function PODetailModal({ isOpen, onClose, poId, onMutate }: Props) {
  const { po, isLoading: loading, mutate } = usePurchaseOrderById(isOpen ? poId : null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [receiveOpen, setReceiveOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const handleConfirm = async () => {
    if (!po) return;
    try {
      setIsConfirming(true);
      await confirmPurchaseOrder(po.id);
      showNotificationSuccess("Phiếu nhập đã được duyệt thành công!");
      mutate();
      onMutate?.();
    } catch {
      showNotificationError("Lỗi khi duyệt phiếu nhập!");
    } finally {
      setIsConfirming(false);
      setConfirmOpen(false);
    }
  };

  const handleCancel = async () => {
    if (!po) return;
    try {
      setIsCancelling(true);
      await cancelPurchaseOrder(po.id);
      showNotificationSuccess("Đã hủy phiếu nhập!");
      mutate();
      onMutate?.();
    } catch {
      showNotificationError("Lỗi khi hủy phiếu nhập!");
    } finally {
      setIsCancelling(false);
      setCancelOpen(false);
    }
  };

  const handleExport = (type: "pdf" | "excel") => {
    if (!po) return;
    if (type === "pdf") {
      exportPOTopdf(po);
      showNotificationSuccess("Đã xuất file PDF!");
    } else {
      exportPOToExcel(po);
      showNotificationSuccess("Đã xuất file Excel!");
    }
  };

  const renderStatusBadge = (status: POStatus) => {
    const map: Record<POStatus, string> = {
      DRAFT: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400",
      CONFIRMED: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-400",
      PARTIALLY_RECEIVED: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/40 dark:text-orange-400",
      COMPLETED: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400",
      CANCELLED: "bg-red-100 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400",
    };
    return (
      <span className={`text-xs font-bold px-3 py-1 rounded-full border ${map[status] ?? ""}`}>
        {PO_STATUS_LABELS[status] ?? status}
      </span>
    );
  };

  return (
    <>
      <SWTModal
        title={
          <div className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Hash size={20} className="text-blue-500" />
            Chi Tiết Phiếu Nhập
          </div>
        }
        open={isOpen}
        onCancel={onClose}
        width={980}
        footer={null}
        destroyOnClose
        className="[&_.ant-modal-header]:!px-6 [&_.ant-modal-header]:!pt-6 [&_.ant-modal-body]:!px-6 dark:[&_.ant-modal-content]:!bg-slate-900/90 dark:[&_.ant-modal-content]:!border dark:[&_.ant-modal-content]:!border-amber-500/20"
      >
        {loading ? (
          <div className="py-20 flex justify-center"><Spin size="large" /></div>
        ) : po ? (
          <div className="py-4 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">{po.code}</span>
                {renderStatusBadge(po.status)}
              </div>

              {/* Actions inside modal */}
              <div className="flex flex-wrap items-center gap-2">
                {po.status === "DRAFT" && (
                  <>
                    <SWTButton
                      type="default"
                      icon={<Edit size={16} />}
                      onClick={() => setEditOpen(true)}
                      className="!border-blue-200 !text-blue-600 hover:!bg-blue-50 dark:!border-blue-500/30 dark:!text-blue-400 dark:hover:!bg-blue-500/10 !rounded-xl !font-semibold"
                      size="sm"
                    >
                      Chỉnh Sửa
                    </SWTButton>
                    <SWTButton
                      type="primary"
                      icon={<CheckCircle2 size={16} />}
                      onClick={() => setConfirmOpen(true)}
                      loading={isConfirming}
                      className="!bg-blue-600 hover:!bg-blue-700 !border-none !rounded-xl !font-semibold"
                      size="sm"
                    >
                      Duyệt Phiếu
                    </SWTButton>
                  </>
                )}

                {(po.status === "CONFIRMED" || po.status === "PARTIALLY_RECEIVED") && (
                  <SWTButton
                    type="primary"
                    icon={<PackageCheck size={16} />}
                    onClick={() => setReceiveOpen(true)}
                    className="!bg-emerald-600 hover:!bg-emerald-700 !border-none !rounded-xl !font-semibold"
                    size="sm"
                  >
                    Nhập Kho
                  </SWTButton>
                )}

                {po.status !== "DRAFT" && po.status !== "CANCELLED" && (
                  <>
                    <SWTButton
                      onClick={() => handleExport("pdf")}
                      className="!w-auto !px-3 !py-1.5 !rounded-xl !border !border-red-200 !bg-red-50 !text-red-600 hover:!bg-red-100 dark:!bg-red-900/20 dark:!border-red-500/30 dark:!text-red-400 !font-medium !text-sm transition-colors inline-flex items-center gap-1.5"
                      startIcon={<FileText size={15} />}
                      size="sm"
                    >
                      PDF
                    </SWTButton>
                    <SWTButton
                      onClick={() => handleExport("excel")}
                      className="!w-auto !px-3 !py-1.5 !rounded-xl !border !border-emerald-200 !bg-emerald-50 !text-emerald-600 hover:!bg-emerald-100 dark:!bg-emerald-900/20 dark:!border-emerald-500/30 dark:!text-emerald-400 !font-medium !text-sm transition-colors inline-flex items-center gap-1.5"
                      startIcon={<FileDown size={15} />}
                      size="sm"
                    >
                      Excel
                    </SWTButton>
                  </>
                )}

                {po.status !== "COMPLETED" && po.status !== "CANCELLED" && (
                  <SWTButton
                    icon={<XCircle size={16} />}
                    onClick={() => setCancelOpen(true)}
                    loading={isCancelling}
                    className="!border-red-200 !text-red-500 hover:!bg-red-50 dark:!border-red-500/30 dark:!text-red-400 dark:hover:!bg-red-500/10 !rounded-xl"
                    size="sm"
                  >
                    Hủy Phiếu
                  </SWTButton>
                )}
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2 text-sm">
                  <Truck size={15} className="text-slate-400" />
                  Nhà cung cấp
                </h3>
                <div className="font-medium text-slate-900 dark:text-white text-sm">{po.brand?.name}</div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2 text-sm">
                  <Calendar size={15} className="text-slate-400" />
                  Thông tin Hóa đơn
                </h3>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ngày tạo:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {new Date(po.createdAt).toLocaleDateString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ghi chú:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200 text-right max-w-[200px]">
                      {po.note || "Không có"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-white dark:bg-slate-900/50">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr className="text-left text-slate-500">
                    <th className="py-3 px-4 font-medium">Sản phẩm</th>
                    <th className="py-3 px-4 font-medium">Biến thể</th>
                    <th className="py-3 px-4 font-medium text-right">Đơn giá</th>
                    <th className="py-3 px-4 font-medium text-right">SL Đặt</th>
                    <th className="py-3 px-4 font-medium text-right">SL Nhận</th>
                    <th className="py-3 px-4 font-medium text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {po.items?.map((item: POItemDto, idx: number) => {
                    const variantName =
                      [item.variant?.color, item.variant?.size].filter(Boolean).join(" - ") || "Tiêu chuẩn";
                    return (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                          {item.variant?.product?.name ?? "Không xác định"}
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{variantName}</td>
                        <td className="py-3 px-4 text-right">{new Intl.NumberFormat("vi-VN").format(item.costPrice)}</td>
                        <td className="py-3 px-4 text-right font-medium">{item.orderedQty}</td>
                        <td className="py-3 px-4 text-right font-medium">
                          <span className={item.receivedQty < item.orderedQty ? "text-orange-500" : "text-emerald-500"}>
                            {item.receivedQty}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-amber-600 dark:text-amber-400">
                          {new Intl.NumberFormat("vi-VN").format(item.orderedQty * item.costPrice)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="p-4 bg-amber-50/50 dark:bg-amber-500/5 border-t border-slate-200 dark:border-slate-700 flex justify-end">
                <div className="flex items-center gap-4">
                  <span className="text-slate-600 font-medium">Tổng thanh toán:</span>
                  <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(po.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-20 text-center text-slate-400">Không tìm thấy dữ liệu</div>
        )}
      </SWTModal>

      <SWTConfirmModal
        open={confirmOpen}
        variant="info"
        title="Duyệt phiếu nhập hàng?"
        description={`Phiếu ${po?.code ?? ""} sẽ chuyển sang "Đã duyệt" và có thể nhập kho.`}
        confirmText="Duyệt ngay"
        cancelText="Hủy"
        loading={isConfirming}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
      />

      <SWTConfirmModal
        open={cancelOpen}
        variant="danger"
        title="Hủy phiếu nhập hàng?"
        description={`Phiếu ${po?.code ?? ""} sẽ bị hủy. Hành động này không thể hoàn tác.`}
        confirmText="Xác nhận hủy"
        cancelText="Không"
        loading={isCancelling}
        onConfirm={handleCancel}
        onCancel={() => setCancelOpen(false)}
      />

      {po && (
        <>
          <ReceiveStockModal
            isOpen={receiveOpen}
            onClose={() => setReceiveOpen(false)}
            poId={po.id}
            onSuccess={() => {
              mutate();
              onMutate?.();
              setReceiveOpen(false);
            }}
          />
          <EditPOModal
            isOpen={editOpen}
            onClose={() => setEditOpen(false)}
            po={po}
            onSuccess={() => {
              mutate();
              onMutate?.();
              setEditOpen(false);
            }}
          />
        </>
      )}
    </>
  );
}
