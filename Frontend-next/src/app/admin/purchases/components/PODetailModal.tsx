"use client";

import { Descriptions, Spin, Tag } from "antd";
import { usePurchaseOrderById } from "@/src/services/admin/purchase.service";
import { exportPOTopdf, exportPOToExcel } from "@/src/utils/exportPO";
import { FileText, FileDown, Truck, Mail, MapPin, Calendar, Hash } from "lucide-react";

import SWTModal from "@/src/@core/component/AntD/SWTModal";
import { showNotificationSuccess } from "@/src/@core/utils/message";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  poId: string | null;
};

export default function PODetailModal({ isOpen, onClose, poId }: Props) {
  const { po, isLoading: loading } = usePurchaseOrderById(isOpen ? poId : null);

  const handleExport = (type: 'pdf' | 'excel') => {
    if (!po) return;
    if (type === 'pdf') {
      exportPOTopdf(po);
      showNotificationSuccess("Đã xuất ra file PDF");
    } else {
      exportPOToExcel(po);
      showNotificationSuccess("Đã xuất ra file Excel");
    }
  };

  const renderStatus = (status: string) => {
    if (status === "DRAFT") return <Tag color="default">DRAFT</Tag>;
    if (status === "CONFIRMED" || status === "APPROVED") return <Tag color="blue">ĐÃ DUYỆT</Tag>;
    if (status === "PARTIALLY_RECEIVED") return <Tag color="orange">ĐANG NHẬP HÀNG</Tag>;
    if (status === "COMPLETED") return <Tag color="green">HOÀN TẤT</Tag>;
    return <Tag>{status}</Tag>;
  };

  return (
    <SWTModal
      title={<div className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2"><Hash size={20} className="text-amber-500" /> Chi Tiết Phiếu Nhập</div>}
      open={isOpen}
      onCancel={onClose}
      width={900}
      footer={null}
      destroyOnClose
    >
      {loading ? (
        <div className="py-20 flex justify-center"><Spin size="large" /></div>
      ) : po ? (
        <div className="py-4 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-amber-600">{po.code}</span>
              {renderStatus(po.status)}
            </div>
            {(po.status === "CONFIRMED" || po.status === "APPROVED" || po.status === "PARTIALLY_RECEIVED" || po.status === "COMPLETED") && (
              <div className="flex gap-2">
                <button onClick={() => handleExport("pdf")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 font-medium text-sm transition-colors">
                  <FileText size={16} /> Tiện ích PDF
                </button>
                <button onClick={() => handleExport("excel")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-medium text-sm transition-colors">
                  <FileDown size={16} /> Tiện ích Excel
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                <Truck size={16} className="text-slate-400" />
                Thông tin Nhà cung cấp
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="font-medium text-slate-900 dark:text-white">{po.supplier?.name}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Mail size={14} /> {po.supplier?.email || "Không có Email"}
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <MapPin size={14} /> {po.supplier?.address || "Không có địa chỉ"}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                <Calendar size={16} className="text-slate-400" />
                Thông tin Hóa đơn
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Ngày tạo:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {new Date(po.createdAt).toLocaleDateString("vi-VN", { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Người lập:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">System Admin</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ghi chú:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200 text-right">{po.note || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-white dark:bg-slate-900/50">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr className="text-left text-slate-500">
                  <th className="py-3 px-4 font-medium">Sản phẩm</th>
                  <th className="py-3 px-4 font-medium">Biến thể</th>
                  <th className="py-3 px-4 font-medium text-right">Đơn giá</th>
                  <th className="py-3 px-4 font-medium text-right">SL Đặt</th>
                  <th className="py-3 px-4 font-medium text-right">SL Nhận</th>
                  <th className="py-3 px-4 font-medium text-right hover:text-amber-500 transition-colors">Thành tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {po.items?.map((item: any, idx: number) => {
                  const variantName = [item.variant?.color, item.variant?.size].filter(Boolean).join(" - ") || "Tiêu chuẩn";
                  return (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                        {item.variant?.product?.name || "Unknown Product"}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                        {variantName}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {new Intl.NumberFormat('vi-VN').format(item.costPrice)}
                      </td>
                      <td className="py-3 px-4 text-right font-medium">
                        {item.orderedQty}
                      </td>
                      <td className="py-3 px-4 text-right font-medium">
                        <span className={item.receivedQty < item.orderedQty ? "text-orange-500" : "text-emerald-500"}>
                          {item.receivedQty}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-amber-600">
                        {new Intl.NumberFormat('vi-VN').format(item.orderedQty * item.costPrice)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            
            <div className="p-4 bg-amber-50/50 dark:bg-amber-500/5 border-t border-slate-200 dark:border-slate-700 flex justify-end">
               <div className="flex items-center gap-4">
                  <span className="text-slate-600 font-medium">Tổng số tiền thanh toán:</span>
                  <span className="text-2xl font-bold text-amber-600">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(po.totalAmount)}
                  </span>
               </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-20 text-center text-slate-400">Không tìm thấy dữ liệu</div>
      )}
    </SWTModal>
  );
}
