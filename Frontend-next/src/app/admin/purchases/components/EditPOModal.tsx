"use client";

import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { updatePurchaseOrder, PURCHASE_API_ENDPOINT } from "@/src/services/admin/purchase.service";
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
import { UpdatePOInput, POItemInput } from "@/src/services/models/purchase/input.dto";
import { PODetailDto } from "@/src/services/models/purchase/output.dto";

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
    receivedQty?: number;
}

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    po: PODetailDto | null;
};

export default function EditPOModal({ isOpen, onClose, onSuccess, po }: Props) {
    const [form] = SWTForm.useForm<FormValues>();
    const [selectedItems, setSelectedItems] = useState<SelectedPOItem[]>([]);
    const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [showVariantPicker, setShowVariantPicker] = useState(false);
    const [selectedVariantState, setSelectedVariantState] = useState<Record<string, { qty: number; costPrice: number; name: string }>>({});
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

    const { variants } = useVariants(1, 1000, selectedBrandId ? { brandId: selectedBrandId } : undefined);
    const { brands } = useBrands();

    const brandList: Array<{ id: string; name: string }> = brands?.data || brands || [];

    const variantOptions: VariantOption[] = (variants ?? []).map((v: any) => ({
        label: `[${v.sku ?? "N/A"}] ${v.productName || v.product?.name || ""} — ${[v.color, v.size].filter(Boolean).join(" / ") || "Tiêu chuẩn"}`,
        value: v.id,
        costPrice: v.costPrice ?? v.price ?? 0,
    }));

    const skipBrandClearRef = useRef(false);

    // Initialize form with PO data
    useEffect(() => {
        if (po && isOpen) {
            console.log('[EditPOModal] initializing form with po:', po?.id, 'isOpen:', isOpen);
            form.setFieldsValue({
                brandId: po.brandId,
                note: po.note || "",
            });
            // prevent programmatic brand set from clearing selected items
            skipBrandClearRef.current = true;
            setSelectedBrandId(po.brandId);

            // Map existing items to selected items
            const items: SelectedPOItem[] = po.items.map((item) => {
                const variantName = [item.variant?.color, item.variant?.size].filter(Boolean).join(" / ") || "Tiêu chuẩn";
                const productName = item.variant?.product?.name ?? "Không xác định";
                const sku = item.variant?.sku ?? "N/A";
                return {
                    variantId: item.variantId,
                    orderedQty: item.orderedQty,
                    costPrice: item.costPrice,
                    receivedQty: item.receivedQty,
                    name: `[${sku}] ${productName} — ${variantName}`,
                };
            });
            setSelectedItems(items);
            console.log('[EditPOModal] setSelectedItems:', items.map(i=>i.variantId));
        }
    }, [po, isOpen, form]);

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
                onClose();
                onSuccess?.();
            } finally {
                setSaving(false);
            }
        } catch (e: unknown) {
            if (e instanceof Error) showNotificationError(e.message);
        }
    };

    const handleClose = () => {
        form.resetFields();
        setSelectedItems([]);
        setSelectedBrandId(null);
        onClose();
    };

    return (
        <SWTModal
            title={
                <span className="text-xl font-black text-blue-600 dark:text-blue-400">
                    Chỉnh Sửa Phiếu Nhập Hàng
                </span>
            }
            open={isOpen}
            onCancel={handleClose}
            width={900}
            okText="Lưu Thay Đổi"
            cancelText="Hủy"
            onOk={handleSubmit}
            confirmLoading={saving}
            destroyOnClose
            okButtonProps={{
                className: "!bg-blue-600 hover:!bg-blue-700 !border-none !text-white !font-semibold !h-10 !px-6 !rounded-xl",
            }}
            cancelButtonProps={{
                className: "dark:!text-slate-300 dark:!bg-slate-800 dark:!border-slate-700 !rounded-xl !h-10",
            }}
            className="[&_.ant-modal-header]:!px-6 [&_.ant-modal-header]:!pt-6 [&_.ant-modal-body]:!px-6 [&_.ant-modal-footer]:!px-6 [&_.ant-modal-footer]:!pb-6 dark:[&_.ant-modal-content]:!bg-slate-900/90 dark:[&_.ant-modal-content]:!border dark:[&_.ant-modal-content]:!border-blue-500/20"
        >
            <div className="py-4 space-y-6">
                <SWTForm form={form} layout="vertical" className="[&_.ant-form-item-label>label]:font-semibold [&_.ant-form-item-label>label]:text-slate-700 dark:[&_.ant-form-item-label>label]:!text-slate-300">
                    {po && (
                        <div className="mb-2 flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{po.code}</div>
                                <div className="text-sm text-slate-500">Ngày tạo: {new Date(po.createdAt).toLocaleDateString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</div>
                            </div>
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                        <SWTFormItem
                            name="brandId"
                            label="Thương hiệu (Nhà cung cấp)"
                            rules={[{ required: true, message: "Vui lòng chọn thương hiệu" }]}
                        >
                            <SWTSelect
                                placeholder="Chọn hoặc tìm kiếm thương hiệu..."
                                showSearch
                                options={brandList.map((b) => ({ label: b.name, value: b.id }))}
                                className="w-full dark:[&_.ant-select-selector]:!bg-slate-800/80 dark:[&_.ant-select-selector]:!border-slate-700 dark:[&_.ant-select-selection-item]:!text-white"
                                onChange={(val) => {
                                    console.log('[EditPOModal] brand select changed to', val);
                                    // if this change was caused by initialization, skip clearing selected items
                                    if (skipBrandClearRef.current) {
                                        skipBrandClearRef.current = false;
                                        setSelectedBrandId(val as string);
                                        return;
                                    }
                                    setSelectedBrandId(val as string);
                                    setSelectedItems([]);
                                }}
                                disabled={!!po}
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
                        <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                                <Plus size={16} className="text-blue-500" />
                                Thêm Hàng Hóa Vào Phiếu
                            </h4>
                            <div className="flex items-center gap-2">
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
                                    className="px-3 py-1 rounded-xl bg-blue-600 text-white text-sm hover:opacity-90"
                                >
                                    Thêm biến thể đã chọn
                                </button>
                                <button
                                    onClick={() => setShowVariantPicker((s) => !s)}
                                    className="px-3 py-1 rounded-xl bg-blue-600 text-white text-sm hover:opacity-90"
                                >
                                    {showVariantPicker ? 'Đóng danh sách' : 'Mở danh sách biến thể'}
                                </button>
                            </div>
                        </div>
                        { !showVariantPicker && (
                            <SWTSelect
                                showSearch
                                disabled={!selectedBrandId}
                                placeholder={selectedBrandId ? "Gõ tên hoặc SKU để thêm vào phiếu..." : "Vui lòng chọn thương hiệu trước"}
                                className="w-full"
                                options={variantOptions}
                                onChange={(val) => handleAddVariant(val as string)}
                                value={null}
                            />
                        )}
                    </div>

                    <div className="p-4">
                        {/* Variant picker table when toggled open */}
                        {showVariantPicker && selectedBrandId && (variants ?? []).length > 0 && (
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
                                            const added = newKeys.filter((k) => !selectedRowKeys.includes(k));
                                            const removed = selectedRowKeys.filter((k) => !newKeys.includes(k));
                                            setSelectedRowKeys(newKeys);
                                            setSelectedVariantState((s) => {
                                                const next = { ...s };
                                                removed.forEach((k) => { delete next[k]; });
                                                added.forEach((k) => {
                                                    const row = (variants ?? []).find((v: any) => v.id === k);
                                                    if (row) {
                                                        const name = `[${row.sku ?? 'N/A'}] ${row.productName} — ${[row.color, row.size].filter(Boolean).join(' / ') || 'Tiêu chuẩn'}`;
                                                        next[k] = { qty: 1, costPrice: row.costPrice ?? row.price ?? 0, name };
                                                    }
                                                });
                                                return next;
                                            });
                                        }
                                    }}
                                />
                            </div>
                        )}
                        {selectedItems.length === 0 ? (
                            <div className="text-center py-8 text-slate-400 dark:text-slate-600 italic text-sm">
                                Chưa có sản phẩm nào được thêm vào phiếu.
                            </div>
                        ) : (
                                <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-slate-500 border-b border-slate-200 dark:border-slate-700">
                                        <th className="pb-2 font-medium">Sản phẩm</th>
                                            <th className="pb-2 font-medium">Đã nhận</th>
                                        <th className="pb-2 w-32 font-medium">Giá nhập (Cost)</th>
                                        <th className="pb-2 w-24 font-medium">Số lượng</th>
                                        <th className="pb-2 w-32 text-right font-medium">Thành tiền</th>
                                        <th className="pb-2 w-10" />
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {selectedItems.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-white dark:hover:bg-slate-800/40 transition-colors">
                                            <td className="py-3 pr-2 font-medium text-slate-800 dark:text-slate-200 text-xs leading-snug">
                                                {item.name}
                                            </td>
                                                <td className="py-3 pr-2 text-slate-600 dark:text-slate-400 text-sm">
                                                    {typeof item.receivedQty === 'number' ? item.receivedQty : 0}
                                                </td>
                                            <td className="py-3">
                                                <SWTInputNumber
                                                    min={0}
                                                    value={item.costPrice}
                                                    onChange={(v) => updateItem(idx, "costPrice", typeof v === "number" ? v : 0)}
                                                    className="w-full dark:[&_.ant-input-number-input]:!text-white dark:!bg-slate-800 dark:!border-slate-700"
                                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                                />
                                            </td>
                                            <td className="py-3">
                                                <SWTInputNumber
                                                    min={1}
                                                    value={item.orderedQty}
                                                    onChange={(v) => updateItem(idx, "orderedQty", typeof v === "number" ? v : 1)}
                                                    className="w-full dark:[&_.ant-input-number-input]:!text-white dark:!bg-slate-800 dark:!border-slate-700"
                                                />
                                            </td>
                                            <td className="py-3 text-right font-semibold text-blue-600 dark:text-blue-400">
                                                {new Intl.NumberFormat("vi-VN").format(item.orderedQty * item.costPrice)}
                                            </td>
                                            <td className="py-3 text-center">
                                                <button
                                                    onClick={() => removeItem(idx)}
                                                    className="text-red-400 hover:text-red-600 transition-colors bg-red-50 dark:bg-red-500/10 p-1.5 rounded-lg"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
                    </div>
                </div>
            </div>
        </SWTModal>
    );
}
