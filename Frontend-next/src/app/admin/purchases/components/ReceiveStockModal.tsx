"use client";

import { Spin, Tag } from "antd";
import { useEffect, useState } from "react";
import { usePurchaseOrderById } from "@/src/services/admin/purchase.service";
import { useReceiveStock } from "@/src/services/admin/inventory.service";
import { PackageCheck, Save } from "lucide-react";
import dayjs from "dayjs";

import SWTModal from "@/src/@core/component/AntD/SWTModal";
import SWTForm from "@/src/@core/component/AntD/SWTForm";
import SWTFormItem from "@/src/@core/component/AntD/SWTFormItem";
import SWTInput from "@/src/@core/component/AntD/SWTInput";
import SWTInputNumber from "@/src/@core/component/AntD/SWTInputNumber";
import SWTDatePicker from "@/src/@core/component/AntD/SWTDatePicker";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import SWTCheckbox from "@/src/@core/component/AntD/SWTCheckbox";
import { showNotificationError, showNotificationSuccess, showNotificationWarning } from "@/src/@core/utils/message";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  poId: string | null;
  onSuccess: () => void;
};

export default function ReceiveStockModal({ isOpen, onClose, poId, onSuccess }: Props) {
  const [saving, setSaving] = useState(false);
  const [form] = SWTForm.useForm();
  const [selectedItems, setSelectedItems] = useState<string[]>([]); // variantIds

  const { trigger: submitReceiveStock } = useReceiveStock();
  const { po, isLoading: loading } = usePurchaseOrderById(isOpen ? poId : null);

  useEffect(() => {
    if (isOpen && poId) {
      form.resetFields();
      setSelectedItems([]);
    }
  }, [isOpen, poId, form]);

  useEffect(() => {
    if (po && isOpen) {
        // Pre-fill form values for items that still need receiving
        const initialVals: any = {};
        const pendingItems = po.items?.filter((i: any) => i.receivedQty < i.orderedQty) || [];
        
        pendingItems.forEach((item: any) => {
          initialVals[`batch_${item.variantId}`] = `LOT-${dayjs().format('YYMMDD')}`;
          initialVals[`qty_${item.variantId}`] = item.orderedQty - item.receivedQty;
        });
        
        form.setFieldsValue(initialVals);
        // Auto select all pending items
        setSelectedItems(pendingItems.map((i: any) => i.variantId));
    }
  }, [po, isOpen, form]);

  const handleToggleItem = (variantId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, variantId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== variantId));
    }
  };

  const handleSubmit = async () => {
    if (!po) return;
    if (selectedItems.length === 0) {
      showNotificationWarning("Vui lòng chọn ít nhất 1 mặt hàng để nhập kho!");
      return;
    }

    try {
      setSaving(true);
      const values = await form.validateFields();
      
      let successCount = 0;
      let failCount = 0;

      // Process sequentially to avoid locking issues in naive implementations
      for (const variantId of selectedItems) {
        const item = po.items.find((i: any) => i.variantId === variantId);
        if (!item) continue;

        const qty = values[`qty_${variantId}`];
        const batchNumber = values[`batch_${variantId}`];
        const expiryDate = values[`expiry_${variantId}`];
        const mfgDate = values[`mfg_${variantId}`];
        
        if (!qty || !batchNumber || !expiryDate) continue;

        const payload = {
          poId: po.id,
          variantId: variantId,
          batchNumber: batchNumber,
          expiryDate: expiryDate.toDate(),
          manufacturingDate: mfgDate ? mfgDate.toDate() : undefined,
          quantity: qty,
          costPrice: item.costPrice,
          note: "Nhập hàng từ PO " + po.code
        };

        try {
          // hook updates state internally but doesn't throw or return the value directly, 
          // we assume success if it doesn't throw
          await submitReceiveStock(payload);
          successCount++;
        } catch (err) {
          failCount++;
        }
      }

      if (successCount > 0) {
        showNotificationSuccess(`Đã nhập thành công ${successCount} mặt hàng vào kho!`);
        if (failCount > 0) {
          showNotificationWarning(`Có ${failCount} mặt hàng bị lỗi khi nhập kho.`);
        }
        onSuccess();
        onClose();
      } else {
        showNotificationError("Lỗi khi nhập kho. Vui lòng thử lại!");
      }
      
    } catch (e) {
      // form validation failed
    } finally {
      setSaving(false);
    }
  };

  const pendingItems = po?.items?.filter((i: any) => i.receivedQty < i.orderedQty) || [];

  return (
    <SWTModal
      title={
        <div className="flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-slate-100 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <PackageCheck size={20} />
          </div>
          Nhập Kho & Cập Nhật Lô (Batch)
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      width={1000}
      footer={null}
      destroyOnClose
    >
      {loading ? (
        <div className="py-20 flex justify-center"><Spin size="large" /></div>
      ) : po ? (
        <div className="py-4">
          <div className="mb-4 text-sm text-slate-600 dark:text-slate-400">
            Phiếu nhập: <strong className="text-amber-600">{po.code}</strong> • 
            Nhà cung cấp: <strong>{po.supplier?.name}</strong>
          </div>

          {pendingItems.length === 0 ? (
            <div className="py-10 text-center text-emerald-500 font-medium">
              Phiếu nhập này đã được nhập kho đầy đủ!
            </div>
          ) : (
            <SWTForm form={form} layout="vertical">
              <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-x-auto bg-white dark:bg-slate-900/50">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500">
                    <tr>
                      <th className="py-3 px-4 font-medium w-10 text-center">
                        <SWTCheckbox 
                          checked={selectedItems.length === pendingItems.length && pendingItems.length > 0} 
                          onChange={(e) => setSelectedItems(e.target.checked ? pendingItems.map((i: any) => i.variantId) : [])}
                        />
                      </th>
                      <th className="py-3 px-2 font-medium w-48">Sản phẩm / Phân loại</th>
                      <th className="py-3 px-2 font-medium w-24 text-center">Tiến độ</th>
                      <th className="py-3 px-2 font-medium w-28">SL Thực Nhận</th>
                      <th className="py-3 px-2 font-medium w-32">Số Lô (Lot/Batch)</th>
                      <th className="py-3 px-2 font-medium w-36">Ngày Sản Xuất</th>
                      <th className="py-3 px-4 font-medium w-36">Hạn Sử Dụng *</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {pendingItems.map((item: any) => {
                      const variantName = [item.variant?.color, item.variant?.size].filter(Boolean).join(" - ") || "Tiêu chuẩn";
                      const isSelected = selectedItems.includes(item.variantId);
                      const maxQty = item.orderedQty - item.receivedQty;

                      return (
                        <tr key={item.variantId} className={`transition-colors ${isSelected ? "bg-emerald-50/30 dark:bg-emerald-900/10" : "opacity-60"}`}>
                          <td className="py-4 px-4 text-center">
                            <SWTCheckbox 
                              checked={isSelected}
                              onChange={(e) => handleToggleItem(item.variantId, e.target.checked)}
                            />
                          </td>
                          <td className="py-4 px-2">
                            <div className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1" title={item.variant?.product?.name}>
                              {item.variant?.product?.name}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">{variantName}</div>
                          </td>
                          <td className="py-4 px-2 text-center text-xs">
                            <div className="bg-slate-100 dark:bg-slate-800 rounded-md px-1.5 py-1">
                              <span className="text-emerald-600 font-bold">{item.receivedQty}</span> / {item.orderedQty}
                            </div>
                          </td>
                          <td className="py-4 px-2 align-top">
                            <SWTFormItem 
                              name={`qty_${item.variantId}`} 
                              rules={[{ required: isSelected, message: "Nhập SL" }]}
                              className="mb-0"
                            >
                              <SWTInputNumber min={1} max={maxQty} className="w-full" disabled={!isSelected} />
                            </SWTFormItem>
                          </td>
                          <td className="py-4 px-2 align-top">
                            <SWTFormItem 
                              name={`batch_${item.variantId}`} 
                              rules={[{ required: isSelected, message: "Nhập Lot" }]}
                              className="mb-0"
                            >
                              <SWTInput placeholder="Lot..." disabled={!isSelected} />
                            </SWTFormItem>
                          </td>
                          <td className="py-4 px-2 align-top">
                            <SWTFormItem 
                              name={`mfg_${item.variantId}`} 
                              className="mb-0"
                            >
                              <SWTDatePicker format="DD/MM/YYYY" placeholder="Ngày SX" className="w-full" disabled={!isSelected} />
                            </SWTFormItem>
                          </td>
                          <td className="py-4 px-4 align-top">
                            <SWTFormItem 
                              name={`expiry_${item.variantId}`} 
                              rules={[{ required: isSelected, message: "Chọn HSD" }]}
                              className="mb-0"
                            >
                              <SWTDatePicker format="DD/MM/YYYY" placeholder="Ngày HSD" className="w-full" disabled={!isSelected} />
                            </SWTFormItem>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </SWTForm>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <SWTButton onClick={onClose} size="lg" className="rounded-xl font-medium">
              Đóng
            </SWTButton>
            {pendingItems.length > 0 && (
              <SWTButton 
                type="primary" 
                size="lg" 
                icon={<Save size={18} />} 
                onClick={handleSubmit}
                loading={saving}
                className="bg-emerald-500 hover:bg-emerald-600 border-none rounded-xl font-semibold shadow-md shadow-emerald-500/20"
              >
                Lưu Nhập Kho
              </SWTButton>
            )}
          </div>
        </div>
      ) : (
        <div className="py-20 text-center text-slate-400">Không tìm thấy dữ liệu</div>
      )}
    </SWTModal>
  );
}
