"use client";

import { Plus, Search } from "lucide-react";
import { useState, useRef, useMemo } from "react";
import { createPurchaseOrder, PURCHASE_API_ENDPOINT } from "@/src/services/admin/purchase.service";
import { useBrands } from "@/src/hooks/admin/brand.hook";
import { useVariants } from "@/src/hooks/admin/product.hook";
import { mutate } from "swr";
import SWTButton from "@/src/@core/component/AntD/SWTButton";

import SWTForm from "@/src/@core/component/AntD/SWTForm";
import SWTFormItem from "@/src/@core/component/AntD/SWTFormItem";
import SWTTable from "@/src/@core/component/AntD/SWTTable";
import { SWTInput } from "@/src/@core/component/AntD/SWTInput";
import SWTInputNumber from "@/src/@core/component/AntD/SWTInputNumber";
import SWTSelect from "@/src/@core/component/AntD/SWTSelect";
import { showNotificationError, showNotificationSuccess, showNotificationWarning } from "@/src/@core/utils/message";
import { CreatePOInput, POItemInput } from "@/src/services/models/purchase/input.dto";
import SWTCheckbox from "@/src/@core/component/AntD/SWTCheckbox";
import { useAuth } from "@/src/context/AuthContext";



const COLUMN_WIDTH = {
  product: 220,
  checkbox: 60,
  variant: 160,
  sku: 140,
  stock: 90,
  sold: 90,
  qty: 180, // = stock + sold
  price: 130, // Dùng chung cho Giá bán, Giá nhập, Thành tiền
};

interface FormValues {
  brandId: string;
  note?: string;
  priority: 'LOW' | 'NORMAL' | 'HIGH';
}

interface SelectedPOItem extends POItemInput {
  name: string;
  sku?: string;
  color?: string;
  size?: string;
}

type Props = {
  onSuccess?: () => void;
};

export default function CreatePOForm({ onSuccess }: Props) {
  const { currentUser } = useAuth();

  const [form] = SWTForm.useForm<FormValues>();
  const [selectedItems, setSelectedItems] = useState<SelectedPOItem[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);

  const [savedByBrand, setSavedByBrand] = useState<Record<string, { selectedItems: SelectedPOItem[] }>>({});

  const [saving, setSaving] = useState(false);
  const submitCreatePO = createPurchaseOrder;
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const [itemSearch, setItemSearch] = useState("");
  const [sourceVariantSearch, setSourceVariantSearch] = useState("");

  const { variants, total, isLoading: variantsLoading } = useVariants(
    page,
    pageSize,
    {
      brandId: selectedBrandId || undefined,
      search: sourceVariantSearch || undefined
    }
  );
  const [brandSearch, setBrandSearch] = useState("");
  const { brands, isLoading: brandsLoading } = useBrands(1, 10, { searchTerm: brandSearch, minimal: true });

  const brandList: Array<{ id: string; name: string }> = Array.isArray(brands) ? brands : [];

  const selectedItemsRef = useRef<HTMLDivElement | null>(null);
  const [newlyAddedIds, setNewlyAddedIds] = useState<string[]>([]);

  const isAdded = (vid: string) => selectedItems.some((i) => i.variantId === vid);

  const updateItem = (index: number, field: keyof Pick<SelectedPOItem, "orderedQty" | "costPrice">, value: number) => {
    setSelectedItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const totalAmount = selectedItems.reduce((acc, curr) => acc + curr.orderedQty * curr.costPrice, 0);

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

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (selectedItems.length === 0) {
        showNotificationWarning("Vui lòng thêm ít nhất 1 mặt hàng!");
        return;
      }

      const payload: CreatePOInput = {
        username: currentUser?.username || "admin",
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
        await submitCreatePO(payload);
        showNotificationSuccess("Tạo phiếu nhập thành công!");
        mutate((key: unknown) => typeof key === "string" && key.startsWith(PURCHASE_API_ENDPOINT));
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
    <div className="py-4 space-y-6">
      <SWTForm
        form={form}
        layout="vertical"
        className="[&_.ant-form-item-label>label]:font-semibold [&_.ant-form-item-label>label]:text-slate-700 dark:[&_.ant-form-item-label>label]:!text-slate-300"
        initialValues={{ priority: 'NORMAL' }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6">
          <SWTFormItem
            name="brandId"
            label="Thương hiệu (Nhà cung cấp)"
            rules={[{ required: true, message: "Vui lòng chọn thương hiệu" }]}
          >
            <SWTSelect
              placeholder="Chọn thương hiệu / Nhà cung cấp..."
              className="w-full h-11 dark:[&_.ant-select-selector]:!bg-slate-800/50"
              options={brandList.map(b => ({ label: b.name, value: b.id }))}
              showSearch
              filterOption={false}
              onSearch={(val) => setBrandSearch(val)}
              loading={brandsLoading}
              value={selectedBrandId}
              onChange={(val) => {
                const nextBrand = val as string;
                if (selectedBrandId) {
                  setSavedByBrand((prev) => ({ ...prev, [selectedBrandId]: { selectedItems } }));
                }

                const restored = savedByBrand[nextBrand];
                setSelectedBrandId(nextBrand);
                form.setFieldValue('brandId', nextBrand);
                if (restored) {
                  setSelectedItems(restored.selectedItems || []);
                } else {
                  setSelectedItems([]);
                }
                setPage(1);
              }}
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

          <SWTFormItem name="note" label="Ghi chú" className="md:col-span-1">
            <SWTInput
              placeholder="Vd: Đơn hàng nhập cuối tháng..."
              className="dark:!bg-slate-800/80 dark:!border-slate-700 dark:!text-white"
            />
          </SWTFormItem>
        </div>
      </SWTForm>

      {/* Item Selection */}
      <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="bg-white dark:bg-slate-900 px-6 py-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-col gap-1.5">
              <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2 uppercase tracking-wide">
                <Plus size={20} className="text-brand-500" />
                Thêm Hàng Hóa Vào Phiếu
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Tick chọn vào biến thể từ danh sách để thêm trực tiếp vào phiếu đặt hàng.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto">
              <SWTInput
                prefix={<Search size={16} className="text-slate-400" />}
                placeholder="Tìm sản phẩm / SKU..."
                value={sourceVariantSearch}
                onChange={(e) => {
                  setSourceVariantSearch(e.target.value);
                  setPage(1); // Reset page on search
                }}
                allowClear
                className="!max-w-xs !h-10 !rounded-xl dark:!bg-slate-800 dark:!border-slate-700"
              />
            </div>
          </div>
        </div>

        <div className="p-4">
          {/* BẢNG 1: Danh sách sản phẩm */}
          {selectedBrandId && (
            <div className="mb-4">
              <SWTTable
                rowKey={(r: any) => r.variant.id}
                loading={variantsLoading}
                columns={[
                  {
                    title: "",
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
                    ellipsis: true, // Cắt chữ nếu quá dài
                    render: (text: string, record: any) => (
                      <div
                        className="flex items-center min-h-[40px] font-medium text-slate-700 dark:text-slate-200"
                        title={record.product.name} // Hover để xem full tên
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
                        {[record.variant.color, record.variant.size].join(" ") || "Tiêu chuẩn"}
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
                      <div
                        className="truncate text-slate-600 dark:text-slate-400"
                        title={text} // Hover vào sẽ hiện full text
                      >
                        {text || "-"}
                      </div>
                    ),
                  },
                  {
                    title: "Tồn",
                    dataIndex: ["variant", "stock"],
                    width: COLUMN_WIDTH.stock,
                    align: "right",
                  },
                  {
                    title: "Đã bán",
                    dataIndex: ["variant", "sold"],
                    width: COLUMN_WIDTH.sold,
                    align: "right",
                  },
                  {
                    title: "Giá bán",
                    width: COLUMN_WIDTH.price,
                    align: "right",
                    render: (_: any, r: any) =>
                      new Intl.NumberFormat("vi-VN").format(r.variant.price ?? 0),
                  },
                  {
                    title: "Giá nhập",
                    width: COLUMN_WIDTH.price,
                    align: "right",
                    render: (_: any, r: any) =>
                      new Intl.NumberFormat("vi-VN").format(r.variant.costPrice ?? r.variant.price ?? 0),
                  },
                ]}
                dataSource={(variants ?? []).map((v: any) => ({ product: { name: v.productName, id: v.productId }, variant: { ...v, id: v.id } }))}
                pagination={{
                  fetch: pageSize,
                  page: page,
                  totalCount: total || 0,
                  onChange: (p: number) => setPage(p),
                }}
                className="dark:[&_.ant-table]:!bg-slate-900/40 dark:[&_.ant-table-thead_th]:!bg-slate-800/80 dark:[&_.ant-table-tbody_tr:hover_td]:!bg-brand-500/10"
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

          {selectedItems.length === 0 ? (
            <div className="text-center py-8 text-slate-400 dark:text-slate-600 italic text-sm">
              Chưa có sản phẩm nào được thêm vào phiếu.
            </div>
          ) : (
            <div ref={selectedItemsRef}>
              {/* BẢNG 2: Sản phẩm đã chọn */}
              <SWTTable
                rowClassName={(record: any) => (newlyAddedIds.includes(record.variantId) ? 'bg-brand-500/10 animate-fade-in' : '')}
                className="dark:[&_.ant-table]:!bg-slate-900/40 dark:[&_.ant-table-thead_th]:!bg-slate-800/80 dark:[&_.ant-table-tbody_tr:hover_td]:!bg-brand-500/10 mt-4"
                columns={[
                  {
                    title: "",
                    key: "checkbox",
                    width: COLUMN_WIDTH.checkbox,
                    render: (_: any, record: any) => (
                      <div className="flex justify-center">
                        <SWTCheckbox
                          checked
                          onChange={(e) => {
                            if (!e.target.checked) {
                              setSelectedItems((prev) =>
                                prev.filter((p) => p.variantId !== record.variantId)
                              );
                            }
                          }}
                        />
                      </div>
                    ),
                  },
                  {
                    title: "Sản phẩm",
                    dataIndex: "name",
                    width: COLUMN_WIDTH.product,
                    ellipsis: true, // Cắt chữ nếu quá dài
                    render: (text: string) => (
                      <div
                        className="font-medium text-slate-700 dark:text-slate-200 truncate"
                        title={text} // Hover để xem full tên
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
                        {[record.color, record.size].join(" ") || "Tiêu chuẩn"}
                      </div>
                    ),
                  },
                  {
                    title: "SKU",
                    dataIndex: "sku",
                    width: COLUMN_WIDTH.sku,
                    ellipsis: true, // Ép AntD xử lý cắt chữ cho cột này
                    render: (text: string) => (
                      <div
                        className="truncate text-slate-600 dark:text-slate-400"
                        title={text} // Hover vào sẽ hiện full text
                      >
                        {text || "-"}
                      </div>
                    ),
                  },
                  {
                    title: "Số lượng",
                    width: COLUMN_WIDTH.qty, // Bằng tổng width của Tồn + Đã bán ở bảng 1
                    align: "right",
                    render: (_: any, record: any, idx: number) => (
                      <SWTInputNumber
                        min={1}
                        value={record.orderedQty}
                        onChange={(v) =>
                          updateItem(idx, "orderedQty", typeof v === "number" ? v : 1)
                        }
                        className="w-full max-w-[120px]"
                      />
                    ),
                  },
                  {
                    title: "Giá nhập",
                    width: COLUMN_WIDTH.price,
                    align: "right",
                    render: (_: any, r: any) =>
                      new Intl.NumberFormat("vi-VN").format(r.costPrice),
                  },
                  {
                    title: "Thành tiền",
                    width: COLUMN_WIDTH.price,
                    align: "right",
                    render: (_: any, r: any) =>
                      new Intl.NumberFormat("vi-VN").format(r.costPrice * r.orderedQty),
                  },
                ]}
                dataSource={filteredSelectedItems}
                pagination={false}
              />
            </div>
          )}

          {selectedItems.length > 0 && (
            <div className="p-5 bg-blue-50/30 dark:bg-brand-500/5 border-t border-slate-200 dark:border-slate-800 flex justify-end rounded-b-xl">
              <div className="flex items-center gap-4">
                <span className="text-slate-500 font-medium uppercase tracking-widest text-[10px]">Tổng thanh toán:</span>
                <span className="text-2xl font-black text-brand-600 dark:text-brand-400">
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(totalAmount)}
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <SWTButton
              size="md"
              onClick={() => { form.resetFields(); setSelectedItems([]); setSelectedBrandId(null); }}
              className="!rounded-xl !w-auto px-4 py-2 !bg-white border !text-black"
            >
              Hủy
            </SWTButton>

            <SWTButton
              size="md"
              loading={saving}
              onClick={handleSubmit}
              className="!rounded-xl !w-auto px-4 py-2 !bg-brand-500/10 !border-brand-500/20 !text-brand-500 hover:!bg-brand-500/20 shadow-sm font-bold"
            >
              Lưu Phiếu (DRAFT)
            </SWTButton>
          </div>
        </div>
      </div>
    </div>
  );
}