"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useCreatePurchaseOrder } from "@/src/services/admin/purchase.service";
import { useBrands } from "@/src/services/admin/brand.service";
import { useProducts } from "@/src/services/admin/product.service";
import { mutate } from "swr";

import SWTModal from "@/src/@core/component/AntD/SWTModal";
import SWTForm from "@/src/@core/component/AntD/SWTForm";
import SWTFormItem from "@/src/@core/component/AntD/SWTFormItem";
import SWTInput, { SWTInputTextArea } from "@/src/@core/component/AntD/SWTInput";
import SWTInputNumber from "@/src/@core/component/AntD/SWTInputNumber";
import SWTSelect from "@/src/@core/component/AntD/SWTSelect";
import { showNotificationError, showNotificationSuccess, showNotificationWarning } from "@/src/@core/utils/message";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CreatePOModal({ isOpen, onClose }: Props) {
  const [form] = SWTForm.useForm();
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);

  const { trigger: submitCreatePO, isMutating: saving } = useCreatePurchaseOrder();

  // Load products so user can select variants - specifically for the chosen brand
  const { products } = useProducts(1, 1000, selectedBrandId || undefined);

  const { brands } = useBrands(1, 100);

  const filteredProducts = products; // Already filtered by hook if brandId is passed

  const variantOptions = filteredProducts.flatMap((p: any) => 
    (p.variants || []).map((v: any) => ({
      label: `[${v.sku || 'N/A'}] ${p.name} - ${[v.color, v.size].filter(Boolean).join(" / ") || "Tiêu chuẩn"}`,
      value: v.id,
      costPrice: v.costPrice || 0,
      productName: p.name
    }))
  );

  const handleAddVariant = (variantId: string) => {
    if (selectedItems.find((i) => i.variantId === variantId)) {
      showNotificationWarning("Biến thể này đã được thêm!");
      return;
    }
    const optionRaw = variantOptions.find((o: any) => o.value === variantId);
    if (!optionRaw) return;

    setSelectedItems([ ...selectedItems, {
      variantId,
      name: optionRaw.label,
      orderedQty: 1,
      costPrice: optionRaw.costPrice
    }]);
  };

  const updateItem = (index: number, field: string, value: number) => {
    const fresh = [...selectedItems];
    fresh[index][field] = value;
    setSelectedItems(fresh);
  };

  const removeItem = (idx: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== idx));
  };

  const totalAmount = selectedItems.reduce((acc, curr) => acc + (curr.orderedQty * curr.costPrice), 0);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (selectedItems.length === 0) {
        showNotificationWarning("Vui lòng thêm ít nhất 1 mặt hàng vào phiếu nhập!");
        return;
      }
      
      const payload = {
        brandId: values.brandId,
        note: values.note,
        totalAmount,
        items: selectedItems.map(i => ({ variantId: i.variantId, orderedQty: i.orderedQty, costPrice: i.costPrice }))
      };

      const res = await submitCreatePO(payload);
      if (res) {
        showNotificationSuccess("Tạo phiếu nhập DRAFT thành công!");
        mutate((key: any) => typeof key === 'string' && key.startsWith('/purchases'));
        onClose();
        form.resetFields();
        setSelectedItems([]);
        setSelectedBrandId(null);
      }
    } catch (e: any) {
      if (e.message) showNotificationError(e.message);
    }
  };

  return (
    <SWTModal
      title={<div className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">TẠO PHIẾU NHẬP HÀNG TỪ NCC</div>}
      open={isOpen}
      onCancel={onClose}
      width={900}
      okText="Lưu Phiếu (DRAFT)"
      cancelText="Hủy"
      onOk={handleSubmit}
      confirmLoading={saving}
      okButtonProps={{
        className: "!bg-gradient-to-r !from-amber-600 !to-orange-500 !border-none !text-white hover:!from-amber-500 hover:!to-orange-400 !font-semibold !h-10 px-6 !rounded-xl"
      }}
      cancelButtonProps={{
        className: "!rounded-xl !h-10"
      }}
      destroyOnClose
    >
      <div className="py-4 space-y-6">
        <SWTForm form={form} layout="vertical">
          <div className="grid grid-cols-2 gap-4">
            <SWTFormItem name="brandId" label={<span className="font-semibold text-slate-700">Thương hiệu (Nhà cung cấp)</span>} rules={[{ required: true, message: "Chọn thương hiệu xuất xứ" }]}>
              <SWTSelect
                placeholder="Chọn hoặc tìm kiếm thương hiệu..."
                showSearch
                optionFilterProp="label"
                options={brands.map((b: any) => ({ label: b.name, value: b.id }))}
                className="h-10"
                onChange={(val) => {
                  setSelectedBrandId(val as string);
                  setSelectedItems([]); // Clear items if brand changes to avoid mismatch
                }}
              />
            </SWTFormItem>
            <SWTFormItem name="note" label={<span className="font-semibold text-slate-700">Ghi chú (Optional)</span>} className="col-span-2">
              <SWTInputTextArea 
                placeholder="Vd: Đơn hàng nhập cuối tháng" 
                className="!h-24 !bg-slate-50 dark:!bg-slate-900/50 !border-slate-200 dark:!border-slate-700 rounded-xl focus:!border-amber-500 transition-all" 
              />
            </SWTFormItem>
          </div>
        </SWTForm>

        {/* Item Selection */}
        <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900/50">
          <div className="bg-white dark:bg-slate-800 p-4 border-b border-slate-200 dark:border-slate-700">
            <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
              <Plus size={18} className="text-amber-500"/>
              Thêm Hàng Hóa Vào Phiếu
            </h4>
            <SWTSelect
              showSearch
              disabled={!selectedBrandId}
              placeholder={selectedBrandId ? "Gõ tên hoặc SKU sản phẩm để thêm vào phiếu..." : "Vui lòng chọn Nhà cung cấp trước"}
              className="w-full h-10 shadow-sm"
              filterOption={(input, option) =>
                String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={variantOptions}
              onChange={(val) => handleAddVariant(val as string)}
              value={null}
            />
          </div>
          
          <div className="p-4">
            {selectedItems.length === 0 ? (
              <div className="text-center py-6 text-slate-400 italic">Chưa có sản phẩm nào được đưa vào PO.</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 border-b border-slate-200 dark:border-slate-700">
                    <th className="pb-2">Sản phẩm</th>
                    <th className="pb-2 w-28">Giá Nhập (Cost)</th>
                    <th className="pb-2 w-24">Số lượng</th>
                    <th className="pb-2 w-28 text-right">Tổng (VND)</th>
                    <th className="pb-2 w-12 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {selectedItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-white dark:hover:bg-slate-800 transition-colors">
                      <td className="py-3 pr-2 font-medium text-slate-800 dark:text-slate-200">
                        {item.name}
                      </td>
                      <td className="py-3">
                        <SWTInputNumber
                          min={0}
                          value={item.costPrice}
                          onChange={(v) => updateItem(idx, 'costPrice', typeof v === 'number' ? v : 0)}
                          className="w-full"
                          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        />
                      </td>
                      <td className="py-3">
                        <SWTInputNumber
                          min={1}
                          value={item.orderedQty}
                          onChange={(v) => updateItem(idx, 'orderedQty', typeof v === 'number' ? v : 1)}
                          className="w-full"
                        />
                      </td>
                      <td className="py-3 text-right font-semibold text-amber-600">
                        {new Intl.NumberFormat('vi-VN').format(item.orderedQty * item.costPrice)}
                      </td>
                      <td className="py-3 text-center">
                        <button onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-600 transition-colors bg-red-50 p-1.5 rounded-lg">
                          <Trash2 size={16} />
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
                  <div className="text-slate-500 mb-1">Tổng cộng hóa đơn:</div>
                  <div className="text-2xl font-bold text-amber-600">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}
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
