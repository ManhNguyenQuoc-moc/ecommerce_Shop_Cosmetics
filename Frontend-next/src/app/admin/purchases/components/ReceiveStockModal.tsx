"use client";

import { Spin } from "antd";
import { useEffect, useState } from "react";
import { usePurchaseOrderById } from "@/src/services/admin/purchase.service";
import { receiveStock } from "@/src/services/admin/purchase.service";
import { revalidateAllInventory } from "@/src/services/admin/product.service";
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
import { POItemDto } from "@/src/services/models/purchase/output.dto";
import { ReceiveStockInput, ReceiveStockItemInput } from "@/src/services/models/purchase/input.dto";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  poId: string | null;
  onSuccess: () => void;
};

/** Dynamic form field keys per variant */
interface ItemFormValues {
  [key: `qty_${string}`]: number;
  [key: `batch_${string}`]: string;
  [key: `expiry_${string}`]: dayjs.Dayjs | null;
  [key: `mfg_${string}`]: dayjs.Dayjs | null;
}

export default function ReceiveStockModal({ isOpen, onClose, poId, onSuccess }: Props) {
  const [saving, setSaving] = useState(false);
  const [form] = SWTForm.useForm<ItemFormValues>();
  const [selectedVariantIds, setSelectedVariantIds] = useState<string[]>([]);
  const submitReceiveStock = receiveStock;
  const { po, isLoading: loading } = usePurchaseOrderById(isOpen ? poId : null);

  useEffect(() => {
    if (isOpen && poId) {
      form.resetFields();
      setSelectedVariantIds([]);
    }
  }, [isOpen, poId, form]);

  useEffect(() => {
    if (po && isOpen) {
      const pendingItems: POItemDto[] = po.items?.filter((i) => i.receivedQty < i.orderedQty) ?? [];
      const initialVals: Partial<ItemFormValues> = {};

      pendingItems.forEach((item) => {
        initialVals[`batch_${item.variantId}`] = `LOT-${dayjs().format("YYMMDD")}`;
        initialVals[`qty_${item.variantId}`] = item.orderedQty - item.receivedQty;
      });

      form.setFieldsValue(initialVals);
      setSelectedVariantIds(pendingItems.map((i) => i.variantId));
    }
  }, [po, isOpen, form]);

  const pendingItems: POItemDto[] = po?.items?.filter((i) => i.receivedQty < i.orderedQty) ?? [];

  const handleToggleItem = (variantId: string, checked: boolean) => {
    setSelectedVariantIds((prev) =>
      checked ? [...prev, variantId] : prev.filter((id) => id !== variantId)
    );
  };

  const handleToggleAll = (checked: boolean) => {
    setSelectedVariantIds(checked ? pendingItems.map((i) => i.variantId) : []);
  };

  const handleSubmit = async () => {
    if (!po) return;
    if (selectedVariantIds.length === 0) {
      showNotificationWarning("Vui lòng chọn ít nhất 1 mặt hàng để nhập kho!");
      return;
    }

    try {
      setSaving(true);
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

      const payload: ReceiveStockInput = { poId: po.id, items };
      await submitReceiveStock(payload);

      showNotificationSuccess(`Đã nhập thành công ${items.length} mặt hàng vào kho!`);
      revalidateAllInventory();
      onSuccess();
    } catch {
      showNotificationError("Lỗi khi nhập kho. Vui lòng thử lại!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SWTModal
      title={
        <div className="flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-slate-100">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <PackageCheck size={20} />
          </div>
          Nhập Kho & Cập Nhật Lô (Batch)
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      width={1020}
      footer={null}
      destroyOnClose
      className="dark:[&_.ant-modal-content]:!bg-slate-900/90 dark:[&_.ant-modal-content]:!border dark:[&_.ant-modal-content]:!border-emerald-500/20"
    >
      {loading ? (
        <div className="py-20 flex justify-center"><Spin size="large" /></div>
      ) : po ? (
        <div className="py-4">
          <div className="mb-4 text-sm text-slate-600 dark:text-slate-400">
            Phiếu nhập: <strong className="text-amber-600 dark:text-amber-400">{po.code}</strong>{" "}
            • Thương hiệu: <strong className="text-slate-800 dark:text-slate-200">{po.brand?.name}</strong>
          </div>

          {pendingItems.length === 0 ? (
            <div className="py-10 text-center text-emerald-500 dark:text-emerald-400 font-medium">
              ✅ Phiếu nhập này đã được nhập kho đầy đủ!
            </div>
          ) : (
            <SWTForm form={form} layout="vertical">
              <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-x-auto bg-white dark:bg-slate-900/50">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500">
                    <tr>
                      <th className="py-3 px-4 font-medium w-10 text-center">
                        <SWTCheckbox
                          checked={selectedVariantIds.length === pendingItems.length && pendingItems.length > 0}
                          onChange={(e) => handleToggleAll(e.target.checked)}
                        />
                      </th>
                      <th className="py-3 px-2 font-medium w-48">Sản phẩm / Phân loại</th>
                      <th className="py-3 px-2 font-medium w-24 text-center">Tiến độ</th>
                      <th className="py-3 px-2 font-medium w-28">SL Thực Nhận</th>
                      <th className="py-3 px-2 font-medium w-32">Số Lô (Batch)</th>
                      <th className="py-3 px-2 font-medium w-36">Ngày Sản Xuất</th>
                      <th className="py-3 px-4 font-medium w-36">Hạn Sử Dụng *</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {pendingItems.map((item) => {
                      const variantName =
                        [item.variant?.color, item.variant?.size].filter(Boolean).join(" - ") || "Tiêu chuẩn";
                      const isSelected = selectedVariantIds.includes(item.variantId);
                      const maxQty = item.orderedQty - item.receivedQty;

                      return (
                        <tr
                          key={item.variantId}
                          className={`transition-colors ${isSelected ? "bg-emerald-50/30 dark:bg-emerald-900/10" : "opacity-60"}`}
                        >
                          <td className="py-4 px-4 text-center">
                            <SWTCheckbox
                              checked={isSelected}
                              onChange={(e) => handleToggleItem(item.variantId, e.target.checked)}
                            />
                          </td>
                          <td className="py-4 px-2">
                            <div className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1 text-xs" title={item.variant?.product?.name}>
                              {item.variant?.product?.name ?? "Unknown"}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">{variantName}</div>
                          </td>
                          <td className="py-4 px-2 text-center">
                            <div className="bg-slate-100 dark:bg-slate-800 rounded-md px-1.5 py-1 text-xs">
                              <span className="text-emerald-600 dark:text-emerald-400 font-bold">{item.receivedQty}</span>
                              <span className="text-slate-400"> / {item.orderedQty}</span>
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
                              <SWTInput
                                placeholder="LOT-..."
                                disabled={!isSelected}
                                className="dark:!bg-slate-800 dark:!border-slate-700 dark:!text-white"
                              />
                            </SWTFormItem>
                          </td>
                          <td className="py-4 px-2 align-top">
                            <SWTFormItem name={`mfg_${item.variantId}`} className="mb-0">
                              <SWTDatePicker
                                format="DD/MM/YYYY"
                                placeholder="Ngày SX"
                                className="w-full"
                                disabled={!isSelected}
                              />
                            </SWTFormItem>
                          </td>
                          <td className="py-4 px-4 align-top">
                            <SWTFormItem
                              name={`expiry_${item.variantId}`}
                              rules={[{ required: isSelected, message: "Chọn HSD" }]}
                              className="mb-0"
                            >
                              <SWTDatePicker
                                format="DD/MM/YYYY"
                                placeholder="Ngày HSD"
                                className="w-full"
                                disabled={!isSelected}
                              />
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
            <SWTButton onClick={onClose} size="lg" className="!rounded-xl">
              Đóng
            </SWTButton>
            {pendingItems.length > 0 && (
              <SWTButton
                type="primary"
                size="lg"
                icon={<Save size={18} />}
                onClick={handleSubmit}
                loading={saving}
                className="!bg-emerald-600 hover:!bg-emerald-700 !border-none !rounded-xl !font-semibold shadow-md shadow-emerald-500/20"
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
