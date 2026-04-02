"use client";

import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import {
  updatePurchaseOrder,
  PURCHASE_API_ENDPOINT,
} from "@/src/services/admin/purchase.service";
import { useBrands } from "@/src/services/admin/brand.service";
import { useVariants } from "@/src/services/admin/product.service";
import { mutate } from "swr";

import SWTForm from "@/src/@core/component/AntD/SWTForm";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import SWTFormItem from "@/src/@core/component/AntD/SWTFormItem";
import SWTTable from "@/src/@core/component/AntD/SWTTable";
import { SWTInputTextArea } from "@/src/@core/component/AntD/SWTInput";
import SWTInputNumber from "@/src/@core/component/AntD/SWTInputNumber";
import SWTSelect from "@/src/@core/component/AntD/SWTSelect";

import {
  showNotificationError,
  showNotificationSuccess,
  showNotificationWarning,
} from "@/src/@core/utils/message";

import {
  UpdatePOInput,
  POItemInput,
} from "@/src/services/models/purchase/input.dto";
import { PODetailDto } from "@/src/services/models/purchase/output.dto";

interface FormValues {
  brandId: string;
  note?: string;
  priority: 'LOW' | 'NORMAL' | 'HIGH';
}

interface VariantOption {
  label: string;
  value: string;
  costPrice: number;
}

interface SelectedPOItem extends POItemInput {
  name: string;
  receivedQty?: number;
}

type Props = {
  po: PODetailDto | null;
  onCancel?: () => void;
  onSuccess?: () => void;
};

export default function EditPOForm({ po, onCancel, onSuccess }: Props) {
  const [form] = SWTForm.useForm<FormValues>();

  const [selectedItems, setSelectedItems] = useState<SelectedPOItem[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [showVariantPicker, setShowVariantPicker] = useState(false);
  const [selectedVariantState, setSelectedVariantState] = useState<
    Record<string, { qty: number; costPrice: number; name: string }>
  >({});
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const [newlyAddedIds, setNewlyAddedIds] = useState<string[]>([]);

  const skipBrandClearRef = useRef(false);
  const selectedItemsRef = useRef<HTMLDivElement | null>(null);

  /* ================= DATA ================= */

  const { variants } = useVariants(
    1,
    1000,
    selectedBrandId ? { brandId: selectedBrandId } : undefined
  );

  const { brands } = useBrands();

  const brandList = brands?.data || brands || [];

  const variantOptions: VariantOption[] = (variants ?? []).map((v: any) => ({
    label: `[${v.sku ?? "N/A"}] ${v.productName || ""} — ${
      [v.color, v.size].filter(Boolean).join(" / ") || "Tiêu chuẩn"
    }`,
    value: v.id,
    costPrice: v.costPrice ?? v.price ?? 0,
  }));

  /* ================= EFFECT ================= */

  useEffect(() => {
    if (!po) return;

    form.setFieldsValue({
      brandId: po.brandId,
      note: po.note || "",
      priority: po.priority,
    });

    skipBrandClearRef.current = true;
    setSelectedBrandId(po.brandId);

    const items: SelectedPOItem[] = po.items.map((item) => {
      const variantName =
        [item.variant?.color, item.variant?.size]
          .filter(Boolean)
          .join(" / ") || "Tiêu chuẩn";

      return {
        variantId: item.variantId,
        orderedQty: item.orderedQty,
        costPrice: item.costPrice,
        receivedQty: item.receivedQty,
        name: `[${item.variant?.sku ?? "N/A"}] ${
          item.variant?.product?.name ?? "Không xác định"
        } — ${variantName}`,
      };
    });
    setSelectedItems(items);
  }, [po, form]);

  /* ================= HELPERS ================= */

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

  // Live-sync: when top picker edits change, update already-added items
  useEffect(() => {
    setSelectedItems((prev) =>
      prev.map((item) => {
        const s = selectedVariantState[item.variantId];
        return s ? { ...item, orderedQty: s.qty, costPrice: s.costPrice } : item;
      })
    );
  }, [selectedVariantState]);

  const isAdded = (vid: string) => selectedItems.some((i) => i.variantId === vid);

  const updateItem = (
    index: number,
    field: keyof Pick<SelectedPOItem, "orderedQty" | "costPrice">,
    value: number
  ) => {
    setSelectedItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const removeItem = (idx: number) => {
    setSelectedItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const totalAmount = selectedItems.reduce(
    (acc, curr) => acc + curr.orderedQty * curr.costPrice,
    0
  );

  const handleSubmit = async () => {
    if (!po) return;

    try {
      const values = await form.validateFields();
      if (selectedItems.length === 0) {
        showNotificationWarning("Vui lòng thêm ít nhất 1 mặt hàng!");
        return;
      }

      const payload: UpdatePOInput = {
        brandId: values.brandId,
        note: values.note,
        priority: values.priority,
        items: selectedItems.map((i) => ({
          variantId: i.variantId,
          orderedQty: i.orderedQty,
          costPrice: i.costPrice,
        })),
      };

      try {
        setSaving(true);
        await updatePurchaseOrder(po.id, payload);
        showNotificationSuccess("Cập nhật phiếu nhập thành công!");
        mutate((key: unknown) => typeof key === "string" && key.startsWith(PURCHASE_API_ENDPOINT));
        onSuccess?.();
      } finally {
        setSaving(false);
      }
    } catch (e: unknown) {
      if (e instanceof Error) showNotificationError(e.message);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedItems([]);
    setSelectedBrandId(null);
    onCancel?.();
  };

  /* ================= UI ================= */

  return (
    <div className="py-4 space-y-6">
      {/* FORM */}
      <SWTForm form={form} layout="vertical">
        <div className="grid md:grid-cols-3 gap-4">
          <SWTFormItem name="brandId" label="Thương hiệu" required>
            <SWTSelect
              options={brandList.map((b: any) => ({
                label: b.name,
                value: b.id,
              }))}
              onChange={(val) => {
                if (skipBrandClearRef.current) {
                  skipBrandClearRef.current = false;
                  setSelectedBrandId(val);
                  return;
                }
                setSelectedBrandId(val);
                setSelectedItems([]);
              }}
              disabled={!!po}
            />
          </SWTFormItem>

          <SWTFormItem
            name="priority"
            label="Mức độ ưu tiên"
            rules={[{ required: true, message: "Vui lòng chọn mức độ ưu tiên" }]}
          >
            <SWTSelect
              options={[
                { label: 'Thấp', value: 'LOW' },
                { label: 'Thường', value: 'NORMAL' },
                { label: 'Cao', value: 'HIGH' },
              ]}
              className="w-full"
            />
          </SWTFormItem>

          <SWTFormItem name="note" label="Ghi chú">
            <SWTInputTextArea rows={2} />
          </SWTFormItem>
        </div>
      </SWTForm>

      {/* Item Selection */}
      <div className="mt-6">
        <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="bg-white dark:bg-slate-800 p-4 border-b border-slate-200 dark:border-slate-700">
            <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
              <Plus size={16} className="text-blue-500" />
              Thêm Hàng Hóa Vào Phiếu
            </h4>
            <div className="flex items-center gap-3">
              <div className="flex-1 text-sm text-slate-500">Chọn biến thể từ danh sách biến thể của thương hiệu đã chọn. Hiển thị tồn kho và số đã bán để quyết định SL đặt.</div>
              <div className="flex items-center gap-2">
                <SWTButton
                  onClick={() => {
                    const toAdd = Object.entries(selectedVariantState).filter(([, v]) => v.qty > 0);
                    if (toAdd.length === 0) {
                      showNotificationWarning("Vui lòng chọn ít nhất 1 biến thể để thêm vào phiếu");
                      return;
                    }

                    const addedItems = toAdd.map(([variantId, v]) => ({
                      variantId,
                      name: v.name,
                      orderedQty: v.qty,
                      costPrice: v.costPrice,
                    }));

                    const existingIdsSet = new Set(selectedItems.map((p) => p.variantId));
                    const toActuallyAdd = addedItems.filter((i) => !existingIdsSet.has(i.variantId));
                    const addedIds = toActuallyAdd.map((a) => a.variantId);

                    if (toActuallyAdd.length === 0) {
                      showNotificationWarning("Các biến thể đã được thêm trước đó");
                    } else {
                      setSelectedItems((prev) => [...prev, ...toActuallyAdd]);
                      setNewlyAddedIds(addedIds);
                      setSelectedRowKeys((prev) => Array.from(new Set([...prev, ...addedIds])));
                      setTimeout(() => selectedItemsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
                      setTimeout(() => setNewlyAddedIds([]), 2700);
                    }

                    setSelectedVariantState({});
                  }}
                  className="!rounded-xl px-3 py-1 !bg-blue-500 !text-white text-sm hover:opacity-90"
                >
                  Thêm biến thể đã chọn
                </SWTButton>

                <SWTButton
                  onClick={() => setShowVariantPicker((s) => !s)}
                  className="!rounded-xl px-3 py-1 !bg-blue-500 !text-white text-sm hover:opacity-90"
                >
                  {showVariantPicker ? 'Đóng danh sách' : 'Mở danh sách biến thể'}
                </SWTButton>
              </div>
            </div>
          </div>
          <div className="p-4">
            {showVariantPicker && selectedBrandId && (variants ?? []).length > 0 && (
              <div className="mb-4">
                <SWTTable
                  rowKey={(r: any) => r.variant.id}
                  columns={[
                    {
                      title: "Sản phẩm",
                      dataIndex: ["product", "name"],
                      key: "product",
                      render: (text: string, record: any) => (
                        <div className="font-medium">
                          {record.product.name}
                          {isAdded(record.variant.id) && (
                            <span className="ml-2 inline-block text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Đã thêm</span>
                          )}
                        </div>
                      ),
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
                            disabled={!selectedRowKeys.includes(vid) || isAdded(vid)}
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
                            disabled={!selectedRowKeys.includes(vid) || isAdded(vid)}
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
                    getCheckboxProps: (record: any) => ({ disabled: isAdded(record.variant.id) }),
                    onChange: (keys: any) => {
                      const newKeys = keys as string[];
                      const added = newKeys.filter((k) => !selectedRowKeys.includes(k));
                      const removed = selectedRowKeys.filter((k) => !newKeys.includes(k));
                      setSelectedRowKeys(newKeys);
                      setSelectedVariantState((s) => {
                        const next = { ...s };
                        removed.forEach((k) => { delete next[k]; });
                        added.forEach((k) => {
                          const row = (variants ?? []).find((v: any) => v.id === k);
                          if (row) {
                            const mappedRow = { product: { name: row.productName, id: row.productId }, variant: row };
                            const name = `[${mappedRow.variant.sku ?? 'N/A'}] ${mappedRow.product.name} — ${[mappedRow.variant.color, mappedRow.variant.size].filter(Boolean).join(' / ') || 'Tiêu chuẩn'}`;
                            next[k] = { 
                              qty: 1, 
                              costPrice: mappedRow.variant.costPrice ?? mappedRow.variant.price ?? 0, 
                              name 
                            };
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
              <div ref={selectedItemsRef}>
                <SWTTable
                  rowKey={(r: any, idx?: number) => r.variantId ?? String(idx)}
                  rowClassName={(record: any) => (newlyAddedIds.includes(record.variantId) ? 'bg-blue-50/60 animate-fade-in' : '')}
                  columns={[
                    {
                      title: "Sản phẩm",
                      dataIndex: "name",
                      key: "name",
                      render: (text: string) => <div className="font-medium text-xs leading-snug">{text}</div>,
                    },
                    {
                      title: "Đã nhận",
                      dataIndex: "receivedQty",
                      key: "receivedQty",
                      render: (v: any) => <div className="text-sm text-slate-600 dark:text-slate-400">{typeof v === 'number' ? v : 0}</div>,
                      width: 100,
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
                        <div className="font-semibold text-blue-600 dark:text-blue-400">{new Intl.NumberFormat("vi-VN").format(record.orderedQty * record.costPrice)}</div>
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
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(totalAmount)}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={handleCancel} className="!rounded-xl px-4 py-2 bg-white border">Hủy</button>
              <button onClick={handleSubmit} className="!rounded-xl px-4 py-2 bg-blue-600 text-white">Lưu Phiếu (DRAFT)</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
