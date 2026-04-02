"use client"
import { Spin } from "antd";
import { useState, useEffect } from "react";
import {
  usePurchaseOrderById,
  confirmPurchaseOrder,
  cancelPurchaseOrder,
  receiveStock,
} from "@/src/services/admin/purchase.service";
import { exportPOTopdf, exportPOToExcel } from "@/src/utils/exportPO";
import {
  FileText,
  FileDown,
  Truck,
  Calendar,
  CheckCircle2,
  XCircle,
  PackageCheck,
  Edit,
  ArrowLeft,
  FileSpreadsheet,
  Save,
  X,
} from "lucide-react";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import SWTConfirmModal from "@/src/@core/component/AntD/SWTConfirmModal";
import { showNotificationSuccess, showNotificationError, showNotificationWarning } from "@/src/@core/utils/message";
import { POItemDto, POStatus, PO_STATUS_LABELS } from "@/src/services/models/purchase/output.dto";
import { useParams, useRouter } from "next/navigation";
import POHeader from "../components/POHeader";
import Link from "next/link";
import SWTIconButton from "@/src/@core/component/SWTIconButton";
import SWTForm from "@/src/@core/component/AntD/SWTForm";
import SWTFormItem from "@/src/@core/component/AntD/SWTFormItem";
import SWTInput from "@/src/@core/component/AntD/SWTInput";
import SWTInputNumber from "@/src/@core/component/AntD/SWTInputNumber";
import SWTDatePicker from "@/src/@core/component/AntD/SWTDatePicker";
import SWTCheckbox from "@/src/@core/component/AntD/SWTCheckbox";
import dayjs from "dayjs";
import { ReceiveStockInput, ReceiveStockItemInput } from "@/src/services/models/purchase/input.dto";

interface ItemFormValues {
  [key: `qty_${string}`]: number;
  [key: `batch_${string}`]: string;
  [key: `expiry_${string}`]: dayjs.Dayjs | null;
  [key: `mfg_${string}`]: dayjs.Dayjs | null;
}

export default function PODetailPage() {
  const params = useParams() as { id: string };
  const id = params.id;
  const { po, isLoading: loading, mutate } = usePurchaseOrderById(id);
  const router = useRouter();

  const [isConfirming, setIsConfirming] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isReceiving, setIsReceiving] = useState(false);
  const [showReceiveForm, setShowReceiveForm] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  
  const [form] = SWTForm.useForm<ItemFormValues>();
  const [selectedVariantIds, setSelectedVariantIds] = useState<string[]>([]);

  useEffect(() => {
    if (showReceiveForm && po) {
      const pendingItems = po.items?.filter((i) => i.receivedQty < i.orderedQty) ?? [];
      const initialVals: Partial<ItemFormValues> = {};
      pendingItems.forEach((item) => {
        initialVals[`batch_${item.variantId}`] = `LOT-${dayjs().format("YYMMDD")}`;
        initialVals[`qty_${item.variantId}`] = item.orderedQty - item.receivedQty;
      });
      form.setFieldsValue(initialVals);
      setSelectedVariantIds(pendingItems.map((i) => i.variantId));
    }
  }, [showReceiveForm, po, form]);

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
    try {
      setIsCancelling(true);
      await cancelPurchaseOrder(po.id);
      showNotificationSuccess("Đã hủy phiếu nhập!");
      mutate();
    } catch {
      showNotificationError("Lỗi khi hủy phiếu nhập!");
    } finally {
      setIsCancelling(false);
      setCancelOpen(false);
    }
  };

  const handleSaveReceiveStock = async () => {
    if (!po) return;
    if (selectedVariantIds.length === 0) {
      showNotificationWarning("Vui lòng chọn ít nhất 1 mặt hàng để nhập kho!");
      return;
    }
    try {
      setIsReceiving(true);
      const values = await form.validateFields();
      const items: ReceiveStockItemInput[] = [];

      for (const variantId of selectedVariantIds) {
        const poItem = po.items?.find((i) => i.variantId === variantId);
        if (!poItem) continue;

        const qty = values[`qty_${variantId}`];
        const batchNumber = values[`batch_${variantId}`];
        const expiryDayjs = values[`expiry_${variantId}`];
        const mfgDayjs = values[`mfg_${variantId}`];

        if (!qty || !batchNumber || !expiryDayjs) continue;

        items.push({
          variantId,
          quantity: qty,
          batchNumber,
          expiryDate: expiryDayjs.toDate(),
          manufacturingDate: mfgDayjs ? mfgDayjs.toDate() : undefined,
          costPrice: poItem.costPrice,
          note: `Nhập hàng từ PO ${po.code}`,
        });
      }

      if (items.length === 0) {
        showNotificationWarning("Không có mặt hàng hợp lệ để nhập kho!");
        return;
      }

      await receiveStock({ poId: po.id, items });
      showNotificationSuccess(`Đã nhập thành công ${items.length} mặt hàng!`);
      setShowReceiveForm(false);
      mutate();
    } catch {
      showNotificationError("Lỗi khi nhập kho!");
    } finally {
      setIsReceiving(false);
    }
  };

  const handleExport = (type: "pdf" | "excel", includeReceipt: boolean) => {
    if (!po) return;
    if (type === "pdf") {
      exportPOTopdf(po, includeReceipt);
      showNotificationSuccess(`Đã xuất file PDF ${includeReceipt ? "Thực nhận" : "Phiếu nhập"}!`);
    } else {
      exportPOToExcel(po, includeReceipt);
      showNotificationSuccess(`Đã xuất file Excel ${includeReceipt ? "Thực nhận" : "Phiếu nhập"}!`);
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
      <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg border ${map[status] ?? ""}`}>
        {PO_STATUS_LABELS[status] ?? status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center h-[60vh]">
        <Spin size="large" tip="Đang tải thông tin phiếu nhập..." />
      </div>
    );
  }

  if (!po) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="text-slate-400 text-lg">Không tìm thấy dữ liệu phiếu nhập</div>
        <SWTButton icon={<ArrowLeft size={16} />} onClick={() => router.back()}>Quay lại</SWTButton>
      </div>
    );
  }

  const pendingItems = po.items?.filter((i) => i.receivedQty < i.orderedQty) ?? [];
  const hasReceived = po.items?.some(i => i.receivedQty > 0);

  return (
    <div className="pb-24 space-y-6 animate-fade-in relative">
      <POHeader
        title="Chi tiết Phiếu Nhập"
        subtitle={<span className="font-bold flex items-center gap-2">Mã PO: <span className="text-brand-600 drop-shadow-sm">{po.code}</span> {renderStatusBadge(po.status)}</span> as any}
        type="detail"
        onBack={() => router.back()}
        extraActions={
          po.status === "DRAFT" && (
            <Link href={`/admin/purchases/${po.id}/edit`}>
              <SWTButton
                type="primary"
                icon={<Edit size={16} />}
                className="!bg-brand-600 hover:!bg-brand-700 !rounded-xl !font-semibold !h-10 px-5 shadow-lg shadow-brand-500/30 border-none"
              >
                Sửa Phiếu
              </SWTButton>
            </Link>
          )
        }
        breadcrumbItems={[
          { title: "Trang chủ", href: "/admin" },
          { title: "Quản lý Nhập hàng", href: "/admin/purchases" },
          { title: `Chi tiết #${po.code}` },
        ]}
      />

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-pink-500/20 space-y-4">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 text-sm uppercase tracking-wider">
            <Truck size={18} className="text-brand-500" />
            Nhà cung cấp
          </h3>
          <div className="space-y-3">
             <div className="font-black text-xl text-slate-900 dark:text-white group flex items-center gap-2">
                {po.brand?.name}
             </div>
             <div className="space-y-1.5">
               <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0" />
                  {po.brand?.email || "Chưa cập nhật email"}
               </div>
               <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0" />
                  {po.brand?.phone || "Chưa cập nhật SĐT"}
               </div>
             </div>
          </div>
        </div>

        <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-pink-500/20 md:col-span-2 space-y-4">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 text-sm uppercase tracking-wider">
            <Calendar size={18} className="text-brand-500" />
            Thông tin chung
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm">
             <div className="space-y-4">
                <div className="flex justify-between items-center pb-2.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 font-medium">Người tạo:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-3 py-0.5 rounded-full">Admin</span>
                </div>
                <div className="flex justify-between items-center pb-2.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 font-medium">Ngày lập phiếu:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {new Date(po.createdAt).toLocaleDateString("vi-VN", { hour: "2-digit", minute: "2-digit", year: "numeric", month: "long", day: "numeric" })}
                  </span>
                </div>
             </div>
             <div className="space-y-2">
                <span className="text-slate-500 font-bold text-xs uppercase tracking-widest pl-1 mb-2 block">Ghi chú</span>
                <div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 min-h-[70px] text-slate-600 dark:text-slate-400 italic">
                   {po.note || "Không có ghi chú dành cho phiếu này."}
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Section 1: Ordered Items */}
      <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-pink-500/20 space-y-4">
        <div className="flex items-center justify-between px-2">
           <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 text-sm uppercase tracking-wider">
              1. Thông tin đặt hàng (Phiếu Nhập)
           </h3>
           <div className="flex gap-2">
              <SWTIconButton 
                variant="danger" 
                tooltip="Xuất PDF Phiếu Nhập" 
                icon={<FileText size={18} />} 
                onClick={() => handleExport("pdf", false)}
              />
              <SWTIconButton 
                variant="restore" 
                tooltip="Xuất Excel Phiếu Nhập" 
                icon={<FileSpreadsheet size={18} />} 
                onClick={() => handleExport("excel", false)}
              />
           </div>
        </div>
        
        <div className="border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr className="text-left text-slate-500">
                <th className="py-4 px-6 font-bold uppercase text-[11px] tracking-widest text-slate-400">Sản phẩm</th>
                <th className="py-4 px-6 font-bold uppercase text-[11px] tracking-widest text-slate-400">Biến thể</th>
                <th className="py-4 px-6 font-bold uppercase text-[11px] tracking-widest text-slate-400 text-right">Giá nhập</th>
                <th className="py-4 px-6 font-bold uppercase text-[11px] tracking-widest text-slate-400 text-right">SL Đặt</th>
                <th className="py-4 px-6 font-bold uppercase text-[11px] tracking-widest text-slate-400 text-right">Thành tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {po.items?.map((item: POItemDto, idx: number) => {
                const variantName =
                  [item.variant?.color, item.variant?.size].filter(Boolean).join(" - ") || "Tiêu chuẩn";
                return (
                  <tr key={idx} className="hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="py-4 px-6 font-bold text-slate-800 dark:text-slate-100 group-hover:text-brand-500 transition-colors">
                      {item.variant?.product?.name ?? "Không xác định"}
                    </td>
                    <td className="py-4 px-6">
                       <span className="px-2.5 py-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-[12px] font-bold text-slate-600 dark:text-slate-400 shadow-sm">
                          {variantName}
                       </span>
                    </td>
                    <td className="py-4 px-6 text-right font-bold text-slate-700 dark:text-slate-300 italic">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.costPrice)}</td>
                    <td className="py-4 px-6 text-right font-black text-slate-600 dark:text-slate-400">{item.orderedQty}</td>
                    <td className="py-4 px-6 text-right font-black text-brand-600 drop-shadow-sm text-base">
                      {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.orderedQty * item.costPrice)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          <div className="p-8 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/20 dark:to-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex flex-col items-end gap-3">
            <div className="flex items-center gap-10 text-slate-500 font-bold text-xs uppercase tracking-widest">
               <span>Số lượng mặt hàng:</span>
               <span className="text-slate-800 dark:text-slate-200 text-sm font-black">{po.items?.length || 0} SKU</span>
            </div>
            <div className="flex items-center gap-10">
              <span className="text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.2em] text-[10px]">Tổng thanh toán:</span>
              <span className="text-4xl font-black text-brand-600 drop-shadow-xl tracking-tighter">
                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(po.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons Below Table 1 */}
        <div className="flex items-center justify-end gap-3 pt-4 px-2">
           {po.status === "DRAFT" && (
              <>
                <SWTButton
                  icon={<XCircle size={16} />}
                  onClick={() => setCancelOpen(true)}
                  loading={isCancelling}
                  className="!border-red-200 !text-red-500 hover:!bg-red-50 !rounded-xl !h-10 px-6 !font-bold"
                  size="sm"
                >
                  Hủy Phiếu
                </SWTButton>
                <SWTButton
                  type="primary"
                  icon={<CheckCircle2 size={16} />}
                  onClick={() => setConfirmOpen(true)}
                  loading={isConfirming}
                  className="!bg-brand-600 hover:!bg-brand-700 !border-none !rounded-xl !h-10 px-6 !font-bold shadow-md shadow-brand-500/20"
                  size="sm"
                >
                  Duyệt Phiếu
                </SWTButton>
              </>
           )}

           {(po.status === "CONFIRMED" || po.status === "PARTIALLY_RECEIVED") && !showReceiveForm && (
              <SWTButton
                type="primary"
                icon={<PackageCheck size={16} />}
                onClick={() => setShowReceiveForm(true)}
                className="!bg-emerald-600 hover:!bg-emerald-700 !border-none !rounded-xl !h-10 px-6 !font-bold shadow-md shadow-emerald-500/20"
                size="sm"
              >
                Bắt Đầu Nhập Kho
              </SWTButton>
           )}
        </div>
      </div>

      {/* Section 2: Actual Receipt / Inventory Entry */}
      {(showReceiveForm || hasReceived) && (
        <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-emerald-500/20 space-y-4 animate-slide-up">
           <div className="flex items-center justify-between px-2">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 text-sm uppercase tracking-wider">
                 2. Thông tin thực nhận (Stock Receipt)
              </h3>
              {hasReceived && !showReceiveForm && (
                <div className="flex gap-2">
                   <SWTIconButton 
                     variant="danger" 
                     tooltip="Xuất PDF Thực Nhận" 
                     icon={<FileText size={18} />} 
                     onClick={() => handleExport("pdf", true)}
                   />
                   <SWTIconButton 
                     variant="restore" 
                     tooltip="Xuất Excel Thực Nhận" 
                     icon={<FileSpreadsheet size={18} />} 
                     onClick={() => handleExport("excel", true)}
                   />
                </div>
              )}
           </div>
           
           {showReceiveForm ? (
             <SWTForm form={form} layout="vertical">
               <div className="border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden bg-white/50 dark:bg-slate-900/50">
                 <table className="w-full text-sm text-left">
                    <thead className="bg-emerald-50 dark:bg-emerald-900/20 text-slate-500">
                      <tr>
                        <th className="py-4 px-6 font-medium w-10 text-center">
                          <SWTCheckbox
                            checked={selectedVariantIds.length === pendingItems.length && pendingItems.length > 0}
                            onChange={(e) => setSelectedVariantIds(e.target.checked ? pendingItems.map(i => i.variantId) : [])}
                          />
                        </th>
                        <th className="py-4 px-2 font-bold uppercase text-[11px] tracking-widest">Sản phẩm / Phân loại</th>
                        <th className="py-4 px-2 font-bold uppercase text-[11px] tracking-widest text-center">Tiến độ</th>
                        <th className="py-4 px-2 font-bold uppercase text-[11px] tracking-widest w-28">SL Nhận</th>
                        <th className="py-4 px-2 font-bold uppercase text-[11px] tracking-widest w-40">Số Lô (Batch)</th>
                        <th className="py-4 px-2 font-bold uppercase text-[11px] tracking-widest w-36">Ngày HSD *</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                       {pendingItems.map((item) => {
                          const variantName = [item.variant?.color, item.variant?.size].filter(Boolean).join(" - ") || "Tiêu chuẩn";
                          const isSelected = selectedVariantIds.includes(item.variantId);
                          return (
                            <tr key={item.variantId} className={`transition-colors ${isSelected ? "bg-emerald-50/30 dark:bg-emerald-900/10" : "opacity-60"}`}>
                               <td className="py-4 px-6 text-center">
                                  <SWTCheckbox checked={isSelected} onChange={(e) => setSelectedVariantIds(prev => e.target.checked ? [...prev, item.variantId] : prev.filter(id => id !== item.variantId))} />
                               </td>
                               <td className="py-4 px-2">
                                  <div className="font-bold text-slate-800 dark:text-slate-100 text-xs">{item.variant?.product?.name}</div>
                                  <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{variantName}</div>
                               </td>
                               <td className="py-4 px-2 text-center">
                                  <div className="text-xs font-black bg-slate-100 dark:bg-slate-800 py-1 rounded-lg">
                                     <span className="text-emerald-600">{item.receivedQty}</span>
                                     <span className="text-slate-400"> / {item.orderedQty}</span>
                                  </div>
                               </td>
                               <td className="py-4 px-2">
                                  <SWTFormItem name={`qty_${item.variantId}`} rules={[{ required: isSelected }]} className="mb-0">
                                     <SWTInputNumber min={1} max={item.orderedQty - item.receivedQty} disabled={!isSelected} className="!w-full !rounded-xl" />
                                  </SWTFormItem>
                               </td>
                               <td className="py-4 px-2">
                                  <SWTFormItem name={`batch_${item.variantId}`} rules={[{ required: isSelected }]} className="mb-0">
                                     <SWTInput disabled={!isSelected} className="!w-full !rounded-xl text-xs uppercase" placeholder="BATCH..." />
                                  </SWTFormItem>
                               </td>
                               <td className="py-4 px-2">
                                  <SWTFormItem name={`expiry_${item.variantId}`} rules={[{ required: isSelected }]} className="mb-0">
                                     <SWTDatePicker format="DD/MM/YYYY" showToday={false} disabled={!isSelected} className="!w-full !rounded-xl" placeholder="HSD" />
                                  </SWTFormItem>
                               </td>
                            </tr>
                          );
                       })}
                    </tbody>
                 </table>
               </div>
               <div className="flex justify-end gap-3 mt-4">
                  <SWTButton icon={<X size={16} />} onClick={() => setShowReceiveForm(false)} className="!rounded-xl" size="sm">Hủy Bỏ</SWTButton>
                  <SWTButton type="primary" icon={<Save size={16} />} loading={isReceiving} onClick={handleSaveReceiveStock} className="!bg-emerald-600 hover:!bg-emerald-700 !border-none !rounded-xl !font-bold shadow-md shadow-emerald-500/20" size="sm">Lưu Nhập Kho</SWTButton>
               </div>
             </SWTForm>
           ) : (
             <div className="border border-slate-200 dark:border-emerald-500/20 rounded-3xl overflow-hidden bg-emerald-50/10 dark:bg-slate-900/50 backdrop-blur-sm">
                <table className="w-full text-sm">
                   <thead className="bg-emerald-50/50 dark:bg-emerald-900/10">
                      <tr className="text-left text-slate-500">
                        <th className="py-4 px-6 font-bold uppercase text-[11px] tracking-widest text-emerald-600/70">Sản phẩm</th>
                        <th className="py-4 px-6 font-bold uppercase text-[11px] tracking-widest text-emerald-600/70">Biến thể</th>
                        <th className="py-4 px-6 font-bold uppercase text-[11px] tracking-widest text-emerald-600/70 text-center">Số Lô (Batch)</th>
                        <th className="py-4 px-6 font-bold uppercase text-[11px] tracking-widest text-emerald-600/70 text-center">HSD</th>
                        <th className="py-4 px-6 font-bold uppercase text-[11px] tracking-widest text-emerald-600/70 text-right">SL Thực Nhận</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-emerald-100/30 dark:divide-emerald-500/10">
                      {po.receipts?.map((receipt: any, idx: number) => {
                         const poItem = po.items?.find((i: any) => i.variantId === receipt.variantId);
                         const variantName = [poItem?.variant?.color, poItem?.variant?.size].filter(Boolean).join(" - ") || "Tiêu chuẩn";
                         return (
                           <tr key={idx} className="hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-colors">
                              <td className="py-4 px-6 font-bold text-slate-800 dark:text-emerald-50">{poItem?.variant?.product?.name}</td>
                              <td className="py-4 px-6 text-slate-500 text-xs">{variantName}</td>
                              <td className="py-4 px-6 text-center font-bold text-slate-600 dark:text-slate-400">{receipt.batchNumber}</td>
                              <td className="py-4 px-6 text-center text-slate-500">{new Date(receipt.expiryDate).toLocaleDateString("vi-VN")}</td>
                              <td className="py-4 px-6 text-right font-black text-emerald-600">{receipt.quantity}</td>
                           </tr>
                         );
                      })}
                      {(!po.receipts || po.receipts.length === 0) && (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-slate-400 italic">Chưa có lịch sử nhập kho thực tế.</td>
                        </tr>
                      )}
                   </tbody>
                </table>
             </div>
           )}
        </div>
      )}

      {/* Confirmation Modals */}
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
        title="Hủy phiếu nhập hàng?"
        description={`Bạn có chắc chắn muốn hủy phiếu ${po.code}? Hành động này sẽ không thể hoàn tác.`}
        confirmText="Xác nhận Hủy"
        cancelText="Không quay lại"
        loading={isCancelling}
        onConfirm={handleCancel}
        onCancel={() => setCancelOpen(false)}
      />
    </div>
  );
}
