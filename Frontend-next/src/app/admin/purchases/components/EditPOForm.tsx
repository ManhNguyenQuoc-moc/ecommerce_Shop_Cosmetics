"use client";

import { Plus, Search } from "lucide-react";
import { useEffect, useState, useRef, useMemo } from "react";
import {
  updatePurchaseOrder,
  PURCHASE_API_ENDPOINT,
} from "@/src/services/admin/iventory/purchase.service";
import { useBrands } from "@/src/services/admin/brand/brand.hook";
import { useVariants } from "@/src/services/admin/product/product.hook";
import { mutate } from "swr";

import SWTForm from "@/src/@core/component/AntD/SWTForm";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import SWTFormItem from "@/src/@core/component/AntD/SWTFormItem";
import SWTTable from "@/src/@core/component/AntD/SWTTable";
import SWTInputNumber from "@/src/@core/component/AntD/SWTInputNumber";
import SWTSelect from "@/src/@core/component/AntD/SWTSelect";
import SWTCheckbox from "@/src/@core/component/AntD/SWTCheckbox"; // Import Checkbox

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
import { SWTInput } from "@/src/@core/component/AntD/SWTInput";

// 1. Đồng bộ cấu trúc COLUMN_WIDTH
const COLUMN_WIDTH = {
  checkbox: 60,
  product: 220,
  variant: 160,
  sku: 140,
  stock: 90,
  sold: 90,
  qty: 180, // = stock + sold
  price: 130,
};

interface FormValues {
  brandId: string;
  note?: string;
  priority: 'LOW' | 'NORMAL' | 'HIGH';
}

// 2. Cập nhật interface SelectedPOItem để bóc tách sku, color, size
interface SelectedPOItem extends POItemInput {
  name: string;
  sku?: string;
  color?: string;
  size?: string;
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
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const [showVariantPicker, setShowVariantPicker] = useState(false);

  const [newlyAddedIds, setNewlyAddedIds] = useState<string[]>([]);

  const skipBrandClearRef = useRef(false);
  const selectedItemsRef = useRef<HTMLDivElement | null>(null);


  const { variants, total, isLoading: variantsLoading } = useVariants(page, pageSize, selectedBrandId ? { brandId: selectedBrandId } : undefined);

  const [brandSearch, setBrandSearch] = useState("");
  const { brands, isLoading: brandsLoading } = useBrands(1, 10, { search: brandSearch, minimal: true });

  const brandList: Array<{ id: string; name: string }> = Array.isArray(brands) ? brands : [];

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
      return {
        variantId: item.variantId,
        orderedQty: item.orderedQty,
        costPrice: item.costPrice,
        receivedQty: item.receivedQty,
        name: item.variant?.product?.name ?? "Không xác định",
        sku: item.variant?.sku ?? "N/A",
        color: item.variant?.color ?? "",
        size: item.variant?.size ?? "",
      };
    });
    setSelectedItems(items);
  }, [po, form]);


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

  const totalAmount = selectedItems.reduce(
    (acc, curr) => acc + curr.orderedQty * curr.costPrice,
    0
  );

  const [itemSearch, setItemSearch] = useState("");
  const filteredSelectedItems = useMemo(() => {
    if (!itemSearch.trim()) return selectedItems;
    const q = itemSearch.toLowerCase();
    return selectedItems.filter((i) => {
      const name = i.name?.toLowerCase() ?? "";
      const variant = [i.color, i.size].join(" ").toLowerCase();
      const sku = i.sku?.toLowerCase() ?? "";
      return name.includes(q) || variant.includes(q) || sku.includes(q);
    });
  }, [selectedItems, itemSearch]);

  // Logic for Select All in Table 1
  const sourceRows = useMemo(
    () => (variants ?? []).map((v: any) => ({ product: { name: v.productName, id: v.productId }, variant: { ...v, id: v.id } })),
    [variants]
  );

  const visibleVariantIds = useMemo(() => sourceRows.map((row) => row.variant.id), [sourceRows]);
  const visibleSelectedCount = useMemo(
    () => visibleVariantIds.filter((id) => selectedItems.some((item) => item.variantId === id)).length,
    [visibleVariantIds, selectedItems]
  );
  const isAllVisibleSelected = visibleVariantIds.length > 0 && visibleSelectedCount === visibleVariantIds.length;
  const isPartiallyVisibleSelected = visibleSelectedCount > 0 && !isAllVisibleSelected;

  const handleToggleSelectAllVisible = (checked: boolean) => {
    if (checked) {
      const addedIds: string[] = [];
      setSelectedItems((prev) => {
        const existing = new Set(prev.map((item) => item.variantId));
        const toAdd = sourceRows
          .filter((row) => !existing.has(row.variant.id))
          .map((row) => {
            addedIds.push(row.variant.id);
            return {
              variantId: row.variant.id,
              name: row.product.name,
              sku: row.variant.sku,
              color: row.variant.color,
              size: row.variant.size,
              orderedQty: 1,
              costPrice: row.variant.costPrice ?? row.variant.price ?? 0,
            };
          });
        return toAdd.length ? [...prev, ...toAdd] : prev;
      });

      if (addedIds.length > 0) {
        setNewlyAddedIds(addedIds);
        setTimeout(() => selectedItemsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 150);
        setTimeout(() => setNewlyAddedIds([]), 2700);
      }
      return;
    }

    const visibleSet = new Set(visibleVariantIds);
    setSelectedItems((prev) => prev.filter((item) => !visibleSet.has(item.variantId)));
  };

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


  return (
    <div className="py-4 flex flex-col gap-6">
      {/* FORM */}
      <SWTForm
        form={form}
        layout="vertical"
        className="[&_.ant-form-item-label>label]:font-semibold [&_.ant-form-item-label>label]:text-slate-700 dark:[&_.ant-form-item-label>label]:!text-slate-300"
      >
        <div className="grid md:grid-cols-3 gap-x-6">
          <SWTFormItem name="brandId" label="Thương hiệu (Nhà cung cấp)" required>
            <SWTSelect
              options={brandList.map((b: any) => ({
                label: b.name,
                value: b.id,
              }))}
              showSearch
              filterOption={false}
              onSearch={(val) => setBrandSearch(val)}
              loading={brandsLoading}
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
              className="w-full dark:[&_.ant-select-selector]:!bg-slate-800/80 dark:[&_.ant-select-selector]:!border-slate-700 dark:[&_.ant-select-selection-item]:!text-white"
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
              className="w-full dark:[&_.ant-select-selector]:!bg-slate-800/80 dark:[&_.ant-select-selector]:!border-slate-700 dark:[&_.ant-select-selection-item]:!text-white"
            />
          </SWTFormItem>

          <SWTFormItem name="note" label="Ghi chú">
            <SWTInput
              placeholder="Vd: Đơn hàng nhập cuối tháng..."
              className="dark:!bg-slate-800/80 dark:!border-slate-700 dark:!text-white"
            />
          </SWTFormItem>
        </div>
      </SWTForm>

      {/* Item Selection */}
      <div className="mt-6">
        <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="bg-white dark:bg-slate-900 px-6 py-5 border-b border-slate-200 dark:border-slate-800">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex flex-col gap-1.5">
                <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2 uppercase tracking-wide">
                  <Plus size={20} className="text-brand-500" />
                  Cập Nhật Hàng Hóa Trong Phiếu
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Tick chọn vào biến thể từ danh sách để thêm trực tiếp vào phiếu đặt hàng.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <SWTButton
                  onClick={() => setShowVariantPicker((s) => !s)}
                  className="!rounded-xl !h-11 !px-5 !bg-slate-200 dark:!bg-slate-800 !border-transparent !text-slate-700 dark:!text-slate-300 font-bold hover:!bg-slate-300 dark:hover:!bg-slate-700 transition-all"
                >
                  {showVariantPicker ? 'Đóng danh sách' : 'Mở danh sách biến thể'}
                </SWTButton>
              </div>
            </div>
          </div>
          <div className="p-4">

            {/* BẢNG 1: CHỌN BIẾN THỂ */}
            {showVariantPicker && selectedBrandId && (
              <div className="mb-4">
                <SWTTable
                  rowKey={(r: any) => r.variant.id}
                  loading={variantsLoading}
                  columns={[
                    {
                      title: (
                        <div className="flex justify-center">
                          <SWTCheckbox
                            checked={isAllVisibleSelected}
                            indeterminate={isPartiallyVisibleSelected}
                            onChange={(e) => handleToggleSelectAllVisible(e.target.checked)}
                          />
                        </div>
                      ),
                      key: "checkbox",
                      width: COLUMN_WIDTH.checkbox,
                      render: (_: any, record: any) => (
                        <div className="flex justify-center">
                          <SWTCheckbox
                            checked={isAdded(record.variant.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                const newItem: SelectedPOItem = {
                                  variantId: record.variant.id,
                                  name: record.product.name,
                                  sku: record.variant.sku,
                                  color: record.variant.color,
                                  size: record.variant.size,
                                  orderedQty: 1,
                                  costPrice: record.variant.costPrice ?? record.variant.price ?? 0,
                                };
                                setSelectedItems((prev) => [...prev, newItem]);
                                setNewlyAddedIds([record.variant.id]);

                                setTimeout(() => selectedItemsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 150);
                                setTimeout(() => setNewlyAddedIds([]), 2700);
                              } else {
                                setSelectedItems((prev) => prev.filter((p) => p.variantId !== record.variant.id));
                              }
                            }}
                          />
                        </div>
                      ),
                    },
                    {
                      title: "Sản phẩm",
                      dataIndex: ["product", "name"],
                      key: "product",
                      width: COLUMN_WIDTH.product,
                      ellipsis: true,
                      render: (text: string, record: any) => (
                        <div
                          className="flex items-center min-h-[40px] font-medium text-slate-700 dark:text-slate-200"
                          title={record.product.name}
                        >
                          <span className="truncate">{record.product.name}</span>
                          {isAdded(record.variant.id) && (
                            <span className="ml-2 shrink-0 text-[10px] font-bold text-brand-500 px-2 py-0.5 rounded-full border border-brand-500/20">
                              Đã thêm
                            </span>
                          )}
                        </div>
                      ),
                    },
                    {
                      title: "Biến thể",
                      key: "variantDesc",
                      width: COLUMN_WIDTH.variant,
                      render: (_: any, record: any) => (
                        <div className="text-slate-600 dark:text-slate-400">
                          {[record.variant.color, record.variant.size].filter(Boolean).join(' - ') || 'Tiêu chuẩn'}
                        </div>
                      ),
                    },
                    {
                      title: "SKU",
                      dataIndex: ["variant", "sku"],
                      key: "sku",
                      width: COLUMN_WIDTH.sku,
                      ellipsis: true,
                      render: (text: string) => (
                        <div className="truncate text-slate-600 dark:text-slate-400" title={text}>
                          {text || "-"}
                        </div>
                      )
                    },
                    { title: "Tồn", dataIndex: ["variant", "stock"], key: "stock", width: COLUMN_WIDTH.stock, align: 'right' as const },
                    { title: "Đã bán", dataIndex: ["variant", "sold"], key: "sold", width: COLUMN_WIDTH.sold, align: 'right' as const },
                    {
                      title: "Giá bán",
                      key: "sellPrice",
                      width: COLUMN_WIDTH.price,
                      align: 'right' as const,
                      render: (_: any, record: any) => (
                        <div className="text-right font-medium text-slate-700 dark:text-slate-200">{new Intl.NumberFormat('vi-VN').format(record.variant.price ?? 0)}</div>
                      ),
                    },
                    {
                      title: "Giá nhập",
                      key: "cost",
                      width: COLUMN_WIDTH.price,
                      align: 'right' as const,
                      render: (_: any, record: any) => (
                        <div className="text-right text-slate-600 dark:text-slate-400 font-medium">{new Intl.NumberFormat('vi-VN').format(record.variant.costPrice ?? record.variant.price ?? 0)}</div>
                      ),
                    },
                  ]}
                  dataSource={sourceRows}
                  pagination={{ fetch: pageSize, page, totalCount: total || 0, onChange: (p: number) => setPage(p) }}
                  className="dark:[&_.ant-table]:!bg-slate-900/40 dark:[&_.ant-table-thead_th]:!bg-slate-800/80 dark:[&_.ant-table-tbody_tr:hover_td]:!bg-brand-500/5"
                />
              </div>
            )}

            {/* Search bar for selected items */}
            {selectedItems.length > 0 && (
              <div className="mb-3 px-1">
                <SWTInput
                  prefix={<Search size={14} className="text-slate-400" />}
                  placeholder="Tìm trong danh sách đã chọn..."
                  value={itemSearch}
                  onChange={(e) => setItemSearch(e.target.value)}
                  allowClear
                  className="!rounded-xl !h-9 !bg-slate-50 dark:!bg-slate-800/50 !border-slate-200 dark:!border-slate-700 max-w-sm text-sm"
                />
              </div>
            )}

            {/* BẢNG 2: SẢN PHẨM ĐÃ CHỌN TRONG PHIẾU */}
            {selectedItems.length === 0 ? (
              <div className="text-center py-8 text-slate-400 dark:text-slate-600 italic text-sm">
                Chưa có sản phẩm nào được thêm vào phiếu.
              </div>
            ) : (
              <div ref={selectedItemsRef}>
                <SWTTable
                  rowClassName={(record: any) => (newlyAddedIds.includes(record.variantId) ? 'bg-brand-500/10 animate-fade-in' : '')}
                  className="dark:[&_.ant-table]:!bg-slate-900/40 dark:[&_.ant-table-thead_th]:!bg-slate-800/80 dark:[&_.ant-table-tbody_tr:hover_td]:!bg-brand-500/5 mt-4"
                  columns={[
                    {
                      title: "",
                      key: "checkbox",
                      width: COLUMN_WIDTH.checkbox,
                      render: (_: any, record: any) => (
                        <div className="flex justify-center">
                          <SWTCheckbox
                            checked={true}
                            onChange={(e) => {
                              if (!e.target.checked) {
                                setSelectedItems((prev) => prev.filter((p) => p.variantId !== record.variantId));
                              }
                            }}
                          />
                        </div>
                      ),
                    },
                    {
                      title: "Sản phẩm",
                      dataIndex: "name",
                      key: "name",
                      width: COLUMN_WIDTH.product,
                      ellipsis: true,
                      render: (text: string) => (
                        <div
                          className="font-medium text-slate-700 dark:text-slate-200 truncate"
                          title={text}
                        >
                          {text}
                        </div>
                      ),
                    },
                    {
                      title: "Biến thể",
                      width: COLUMN_WIDTH.variant,
                      render: (_: any, record: any) => (
                        <div className="text-slate-600 dark:text-slate-400">
                          {[record.color, record.size].filter(Boolean).join(" - ") || "Tiêu chuẩn"}
                        </div>
                      ),
                    },
                    {
                      title: "SKU",
                      dataIndex: "sku",
                      width: COLUMN_WIDTH.sku,
                      ellipsis: true,
                      render: (text: string) => (
                        <div className="truncate text-slate-600 dark:text-slate-400" title={text}>
                          {text || "-"}
                        </div>
                      ),
                    },
                    {
                      title: "Số lượng",
                      key: "qty",
                      width: COLUMN_WIDTH.qty,
                      align: "right",
                      render: (_: any, record: any, idx: number) => (
                        <SWTInputNumber
                          min={1}
                          value={record.orderedQty}
                          onChange={(v) => updateItem(idx, "orderedQty", typeof v === "number" ? v : 1)}
                          className="w-full max-w-[120px] dark:[&_.ant-input-number-input]:!text-white dark:!bg-slate-800 dark:!border-slate-700"
                        />
                      ),
                    },
                    {
                      title: "Giá nhập",
                      key: "cost",
                      width: COLUMN_WIDTH.price,
                      align: "right",
                      render: (_: any, record: any) => (
                        <div className="text-right text-slate-700 dark:text-slate-200 font-medium">{new Intl.NumberFormat('vi-VN').format(record.costPrice)}</div>
                      ),
                    },
                    {
                      title: "Thành tiền",
                      key: "total",
                      width: COLUMN_WIDTH.price,
                      align: 'right' as const,
                      render: (_: any, record: any) => (
                        <div className="font-semibold text-brand-600 dark:text-brand-400">{new Intl.NumberFormat("vi-VN").format(record.orderedQty * record.costPrice)}</div>
                      ),
                    },
                  ]}
                  dataSource={filteredSelectedItems}
                  pagination={false}
                />
              </div>
            )}

            {selectedItems.length > 0 && (
              <div className="flex justify-end pt-4 mt-2 border-t border-slate-200 dark:border-slate-700">
                <div className="text-right">
                  <div className="text-slate-500 text-sm mb-1 uppercase font-medium">Tổng cộng hóa đơn:</div>
                  <div className="text-2xl font-black text-brand-600 dark:text-brand-400">
                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(totalAmount)}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <SWTButton
                onClick={handleCancel}
                className="!bg-slate-500/10 !border-slate-500/20 !text-slate-500 hover:!bg-slate-500/20 !rounded-xl !w-auto font-bold transition-all px-6 py-2"
              >
                Hủy
              </SWTButton>
              <SWTButton
                onClick={handleSubmit}
                loading={saving}
                className="!bg-brand-500/10 !border-brand-500/20 !text-brand-500 hover:!bg-brand-500/20 !rounded-xl !font-bold shadow-sm !w-auto transition-all px-8 py-2"
              >
                Cập Nhật Phiếu
              </SWTButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}