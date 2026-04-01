"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { createPurchaseOrder, PURCHASE_API_ENDPOINT } from "@/src/services/admin/purchase.service";
import { useBrands } from "@/src/services/admin/brand.service";
import { useVariants } from "@/src/services/admin/product.service";
import { mutate } from "swr";

import SWTModal from "@/src/@core/component/AntD/SWTModal";
import SWTForm from "@/src/@core/component/AntD/SWTForm";
import SWTFormItem from "@/src/@core/component/AntD/SWTFormItem";
import SWTTable from "@/src/@core/component/AntD/SWTTable";
import { SWTInputTextArea } from "@/src/@core/component/AntD/SWTInput";
import SWTInputNumber from "@/src/@core/component/AntD/SWTInputNumber";
import SWTSelect from "@/src/@core/component/AntD/SWTSelect";
import { showNotificationError, showNotificationSuccess, showNotificationWarning } from "@/src/@core/utils/message";
import { CreatePOInput, POItemInput } from "@/src/services/models/purchase/input.dto";

interface FormValues {
  brandId: string;
  note?: string;
}

interface VariantOption {
  label: string;
  value: string;
  costPrice: number;
}

interface SelectedPOItem extends POItemInput {
  name: string;
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function CreatePOModal({ isOpen, onClose, onSuccess }: Props) {
  const [form] = SWTForm.useForm<FormValues>();
  const [selectedItems, setSelectedItems] = useState<SelectedPOItem[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const submitCreatePO = createPurchaseOrder;
  const { variants } = useVariants(1, 1000, selectedBrandId ? { brandId: selectedBrandId } : undefined);
  const { brands } = useBrands();

  const brandList: Array<{ id: string; name: string }> = brands?.data || brands || [];

  const variantOptions: VariantOption[] = (variants ?? []).map((v: any) => ({
    label: `[${v.sku ?? "N/A"}] ${v.productName || v.product?.name || ""} — ${[v.color, v.size].filter(Boolean).join(" / ") || "Tiêu chuẩn"}`,
    value: v.id,
    costPrice: v.costPrice ?? v.price ?? 0,
  }));

  // Selected variants in the brand-variant table before adding to PO
  const [selectedVariantState, setSelectedVariantState] = useState<Record<string, { qty: number; costPrice: number; name: string }>>({});
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const handleAddVariant = (variantId: string) => {
    if (selectedItems.find((i) => i.variantId === variantId)) {
      showNotificationWarning("Biến thể này đã được thêm!");
      return;
    }
    const option = variantOptions.find((o) => o.value === variantId);
    if (!option) return;

    setSelectedItems((prev) => [
      ...prev,
      { variantId, name: option.label, orderedQty: 1, costPrice: option.costPrice },
    ]);
  };

  const updateItem = (index: number, field: keyof Pick<SelectedPOItem, "orderedQty" | "costPrice">, value: number) => {
    setSelectedItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removeItem = (idx: number) => {
    setSelectedItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const totalAmount = selectedItems.reduce((acc, curr) => acc + curr.orderedQty * curr.costPrice, 0);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (selectedItems.length === 0) {
        showNotificationWarning("Vui lòng thêm ít nhất 1 mặt hàng!");
        return;
      }

      const payload: CreatePOInput = {
        brandId: values.brandId,
        note: values.note,
        items: selectedItems.map((i) => ({
          variantId: i.variantId,
          orderedQty: i.orderedQty,
          costPrice: i.costPrice,
        })),
      };

      try {
        setSaving(true);
        const res = await submitCreatePO(payload);
        showNotificationSuccess("Tạo phiếu nhập thành công!");
        mutate((key: unknown) => typeof key === "string" && key.startsWith(PURCHASE_API_ENDPOINT));
        onClose();
        onSuccess?.();
        form.resetFields();
        setSelectedItems([]);
        setSelectedBrandId(null);
      } finally {
        setSaving(false);
      }
    } catch (e: unknown) {
      if (e instanceof Error) showNotificationError(e.message);
    }
  };

  return (
    <SWTModal
      title={
        <span className="text-xl font-black text-amber-600 dark:text-amber-400">
          Tạo Phiếu Nhập Hàng
        </span>
      }
      open={isOpen}
      onCancel={onClose}
      width={900}
      okText="Lưu Phiếu (DRAFT)"
      cancelText="Hủy"
      onOk={handleSubmit}
      confirmLoading={saving}
      destroyOnClose
      okButtonProps={{
        className: "!bg-amber-600 hover:!bg-amber-700 !border-none !text-white !font-semibold !h-10 !px-6 !rounded-xl",
      }}
      cancelButtonProps={{
        className: "dark:!text-slate-300 dark:!bg-slate-800 dark:!border-slate-700 !rounded-xl !h-10",
      }}
      className="[&_.ant-modal-header]:!px-6 [&_.ant-modal-header]:!pt-6 [&_.ant-modal-body]:!px-6 [&_.ant-modal-footer]:!px-6 [&_.ant-modal-footer]:!pb-6 dark:[&_.ant-modal-content]:!bg-slate-900/90 dark:[&_.ant-modal-content]:!border dark:[&_.ant-modal-content]:!border-amber-500/20"
    >
      <div className="py-4 space-y-6">
        <SWTForm form={form} layout="vertical" className="[&_.ant-form-item-label>label]:font-semibold [&_.ant-form-item-label>label]:text-slate-700 dark:[&_.ant-form-item-label>label]:!text-slate-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <SWTFormItem
              name="brandId"
              label="Thương hiệu (Nhà cung cấp)"
              rules={[{ required: true, message: "Vui lòng chọn thương hiệu" }]}
            >
              <SWTSelect
                placeholder="Chọn hoặc tìm kiếm thương hiệu..."
                showSearch
                optionFilterProp="label"
                options={brandList.map((b) => ({ label: b.name, value: b.id }))}
                className="w-full dark:[&_.ant-select-selector]:!bg-slate-800/80 dark:[&_.ant-select-selector]:!border-slate-700 dark:[&_.ant-select-selection-item]:!text-white"
                onChange={(val) => {
                  setSelectedBrandId(val as string);
                  setSelectedItems([]);
                }}
              />
            </SWTFormItem>

            <SWTFormItem name="note" label="Ghi chú" className="md:col-span-1">
              <SWTInputTextArea
                rows={2}
                placeholder="Vd: Đơn hàng nhập cuối tháng..."
                className="dark:!bg-slate-800/80 dark:!border-slate-700 dark:!text-white"
              />
            </SWTFormItem>
          </div>
        </SWTForm>

        {/* Item Selection */}
        <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="bg-white dark:bg-slate-800 p-4 border-b border-slate-200 dark:border-slate-700">
            <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
              <Plus size={16} className="text-amber-500" />
              Thêm Hàng Hóa Vào Phiếu
            </h4>
            <div className="flex items-center gap-3">
              <div className="flex-1 text-sm text-slate-500">Chọn biến thể từ danh sách biến thể của thương hiệu đã chọn. Hiển thị tồn kho và số đã bán để quyết định SL đặt.</div>
              <button
                onClick={() => {
                  // Add all currently selected rows into selectedItems
                  const toAdd = Object.entries(selectedVariantState).filter(([, v]) => v.qty > 0);
                  if (toAdd.length === 0) {
                    showNotificationWarning("Vui lòng chọn ít nhất 1 biến thể để thêm vào phiếu");
                    return;
                  }
                  setSelectedItems((prev) => {
                    const existingIds = new Set(prev.map((p) => p.variantId));
                    const added = toAdd.map(([variantId, v]) => ({
                      variantId,
                      name: v.name,
                      orderedQty: v.qty,
                      costPrice: v.costPrice,
                    })).filter((i) => !existingIds.has(i.variantId));
                    if (added.length === 0) {
                      showNotificationWarning("Các biến thể đã được thêm trước đó");
                    }
                    return [...prev, ...added];
                  });
                  // clear selection
                  setSelectedVariantState({});
                  setSelectedRowKeys([]);
                }}
                className="px-3 py-1 rounded-xl bg-amber-500 text-white text-sm hover:opacity-90"
              >
                Thêm biến thể đã chọn
              </button>
            </div>
          </div>

          <div className="p-4">
            {/* Variant table for selected brand using SWTTable */}
            {selectedBrandId && (variants ?? []).length > 0 && (
              <div className="mb-4">
                <SWTTable
                  rowKey={(r: any) => r.variant.id}
                  columns={[
                    {
                      title: "Sản phẩm",
                      dataIndex: ["product", "name"],
                      key: "product",
                      render: (text: string, record: any) => <div className="font-medium">{record.product.name}</div>,
                    },
                    {
                      title: "Biến thể",
                      key: "variantDesc",
                      render: (_: any, record: any) => ([record.variant.color, record.variant.size].filter(Boolean).join(' - ') || 'Tiêu chuẩn'),
                    },
                    { title: "SKU", dataIndex: ["variant", "sku"], key: "sku" },
                    { title: "Tồn", dataIndex: ["variant", "stock"], key: "stock", align: 'right' as const },
                    { title: "Đã bán", dataIndex: ["variant", "soldCount"], key: "sold", align: 'right' as const },
                    {
                      title: "SL đặt",
                      key: "qty",
                      align: 'right' as const,
                      render: (_: any, record: any) => {
                        const vid = record.variant.id;
                        const sel = selectedVariantState[vid];
                        return (
                          <SWTInputNumber
                            min={1}
                            value={sel?.qty ?? 0}
                            onChange={(v) => setSelectedVariantState((s) => ({ ...s, [vid]: { ...(s[vid] || { qty: 0, costPrice: record.variant.costPrice ?? 0, name: `[${record.variant.sku ?? 'N/A'}] ${record.product.name}` }), qty: typeof v === 'number' ? v : 0 } }))}
                            disabled={!selectedRowKeys.includes(vid)}
                            className="w-full"
                          />
                        );
                      },
                    },
                    {
                      title: "Giá nhập",
                      key: "cost",
                      align: 'right' as const,
                      render: (_: any, record: any) => {
                        const vid = record.variant.id;
                        const sel = selectedVariantState[vid];
                        return (
                          <SWTInputNumber
                            min={0}
                            value={sel?.costPrice ?? record.variant.costPrice ?? 0}
                            onChange={(v) => setSelectedVariantState((s) => ({ ...s, [vid]: { ...(s[vid] || { qty: 1, costPrice: 0, name: `[${record.variant.sku ?? 'N/A'}] ${record.product.name}` }), costPrice: typeof v === 'number' ? v : 0 } }))}
                            disabled={!selectedRowKeys.includes(vid)}
                            className="w-full"
                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          />
                        );
                      },
                    },
                  ]}
                  dataSource={(variants ?? []).map((v: any) => ({ product: { name: v.productName, id: v.productId }, variant: { ...v, id: v.id } }))}
                  pagination={false}
                  rowSelection={{
                    selectedRowKeys,
                    onChange: (keys: any) => {
                      const newKeys = keys as string[];
                      // add defaults for newly selected
                      const added = newKeys.filter((k) => !selectedRowKeys.includes(k));
                      const removed = selectedRowKeys.filter((k) => !newKeys.includes(k));
                      setSelectedRowKeys(newKeys);
                      setSelectedVariantState((s) => {
                        const next = { ...s };
                        // remove unselected
                        removed.forEach((k) => { delete next[k]; });
                        // add defaults for added
                        added.forEach((k) => {
                          const row = (variants ?? []).find((v: any) => v.id === k);
                          const mappedRow = row ? { product: { name: row.productName, id: row.productId }, variant: row } : null;
                          if (row) {
                            const name = `[${mappedRow.variant.sku ?? 'N/A'}] ${mappedRow.product.name} — ${[mappedRow.variant.color, mappedRow.variant.size].filter(Boolean).join(' / ') || 'Tiêu chuẩn'}`;
                            next[k] = { qty: 1, costPrice: mappedRow.variant.costPrice ?? mappedRow.variant.price ?? 0, name };
                          }
                        });
                        return next;
                      });
                    },
                  }}
                />
              </div>
            )}
            {selectedItems.length === 0 ? (
              <div className="text-center py-8 text-slate-400 dark:text-slate-600 italic text-sm">
                Chưa có sản phẩm nào được thêm vào phiếu.
              </div>
            ) : (
              <div>
                <SWTTable
                  rowKey={(r: any, idx: number) => r.variantId ?? String(idx)}
                  columns={[
                    {
                      title: "Sản phẩm",
                      dataIndex: "name",
                      key: "name",
                      render: (text: string) => <div className="font-medium text-xs leading-snug">{text}</div>,
                    },
                    {
                      title: "Giá nhập (Cost)",
                      key: "cost",
                      render: (_: any, record: any, idx: number) => (
                        <SWTInputNumber
                          min={0}
                          value={record.costPrice}
                          onChange={(v) => updateItem(idx, "costPrice", typeof v === "number" ? v : 0)}
                          className="w-full dark:[&_.ant-input-number-input]:!text-white dark:!bg-slate-800 dark:!border-slate-700"
                          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        />
                      ),
                      width: 140,
                    },
                    {
                      title: "Số lượng",
                      key: "qty",
                      render: (_: any, record: any, idx: number) => (
                        <SWTInputNumber
                          min={1}
                          value={record.orderedQty}
                          onChange={(v) => updateItem(idx, "orderedQty", typeof v === "number" ? v : 1)}
                          className="w-full dark:[&_.ant-input-number-input]:!text-white dark:!bg-slate-800 dark:!border-slate-700"
                        />
                      ),
                      width: 120,
                    },
                    {
                      title: "Thành tiền",
                      key: "total",
                      align: 'right' as const,
                      render: (_: any, record: any) => (
                        <div className="font-semibold text-amber-600 dark:text-amber-400">{new Intl.NumberFormat("vi-VN").format(record.orderedQty * record.costPrice)}</div>
                      ),
                      width: 140,
                    },
                    {
                      title: "",
                      key: "actions",
                      render: (_: any, _record: any, idx: number) => (
                        <div className="text-center">
                          <button
                            onClick={() => removeItem(idx)}
                            className="text-red-400 hover:text-red-600 transition-colors bg-red-50 dark:bg-red-500/10 p-1.5 rounded-lg"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ),
                      width: 80,
                    },
                  ]}
                  dataSource={selectedItems}
                  pagination={false}
                />
              </div>
            )}

            {selectedItems.length > 0 && (
              <div className="flex justify-end pt-4 mt-2 border-t border-slate-200 dark:border-slate-700">
                <div className="text-right">
                  <div className="text-slate-500 text-sm mb-1">Tổng cộng hóa đơn:</div>
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(totalAmount)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SWTModal>
  );
}
