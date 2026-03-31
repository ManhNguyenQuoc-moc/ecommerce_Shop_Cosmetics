"use client";

import { useEffect, useState } from "react";
import { Plus, Tag, Search } from "lucide-react";
import SWTForm from "@/src/@core/component/AntD/SWTForm";
import SWTFormItem from "@/src/@core/component/AntD/SWTFormItem";
import SWTInput from "@/src/@core/component/AntD/SWTInput";
import SWTInputNumber from "@/src/@core/component/AntD/SWTInputNumber";
import SWTSelect from "@/src/@core/component/AntD/SWTSelect";
import SWTModal from "@/src/@core/component/AntD/SWTModal";
import SWTUpload from "@/src/@core/component/AntD/SWTUpload";
import { useProducts, createVariant } from "@/src/services/admin/product.service";
import { showNotificationError, showNotificationSuccess } from "@/src/@core/utils/message";

interface AddVariantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: any) => void;
}

export default function AddVariantModal({ isOpen, onClose, onAdd }: AddVariantModalProps) {
  const [form] = SWTForm.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const { products, isLoading: isProductsLoading } = useProducts(1, 100);

  const selectedProduct = products.find((p: any) => p.id === selectedProductId);

  const handleFinish = async (values: any) => {
    setIsSubmitting(true);
    try {
      await createVariant({ ...values, productId: selectedProductId });
      showNotificationSuccess("Tạo biến thể thành công");
      onAdd({ ...values, productId: selectedProductId });
      form.resetFields();
      setSelectedProductId(null);
      onClose();
    } catch (err: any) {
      console.error(err);
      showNotificationError("Lỗi khi tạo biến thể");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedProductVariants = selectedProduct?.variants || []; // Assuming the API returns nested variants, or mock it

  return (
    <SWTModal
      title={
        <span className="text-xl font-black bg-gradient-to-r from-fuchsia-500 to-purple-600 bg-clip-text text-transparent inline-block drop-shadow-sm pb-1">
          Tạo Phiên Bản (Variant) Mới
        </span>
      }
      open={isOpen}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Lưu Biến thể"
      cancelText="Hủy"
      width={700}
      okButtonProps={{
        loading: isSubmitting,
        className: "!bg-fuchsia-600 hover:!bg-fuchsia-700 !border-none !shadow-md shadow-fuchsia-500/30 !rounded-xl",
      }}
      cancelButtonProps={{
        className: "dark:!text-slate-300 dark:!bg-slate-800 dark:!border-slate-700 !rounded-xl",
      }}
      className="[&_.ant-modal-header]:!px-6 [&_.ant-modal-body]:!px-6 sm:[&_.ant-modal-header]:!px-8 sm:[&_.ant-modal-body]:!px-8 dark:[&_.ant-modal-content]:!bg-slate-900/95 dark:[&_.ant-modal-content]:!border dark:[&_.ant-modal-content]:!border-fuchsia-500/20"
    >
      <div className="mt-4 mb-6">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Chọn Sản Phẩm Gốc <span className="text-red-500">*</span>
        </label>
        <SWTSelect
          placeholder="Tìm kiếm và chọn sản phẩm..."
          loading={isProductsLoading}
          options={products?.map((p: any) => ({ label: p.name, value: p.id })) || []}
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
          }
          className="w-full h-11 dark:[&_.ant-select-selector]:!bg-slate-800/80 dark:[&_.ant-select-selector]:!border-slate-700 dark:[&_.ant-select-selection-item]:!text-white"
          value={selectedProductId}
          onChange={(val) => setSelectedProductId(val)}
        />
        <p className="text-xs text-slate-500 mt-1.5">
          *Lưu ý: Chỉ được phép thêm biến thể cho các sản phẩm đã tồn tại trên hệ thống.
        </p>
      </div>

      {selectedProduct && selectedProductVariants.length > 0 && (
        <div className="mb-6 bg-fuchsia-50 dark:bg-fuchsia-900/20 p-4 rounded-xl border border-fuchsia-100 dark:border-fuchsia-500/20">
          <h4 className="text-sm font-bold text-fuchsia-800 dark:text-fuchsia-400 mb-3 flex items-center gap-2">
            <Tag size={16} />
            Các phiên bản hiện tại của sản phẩm này:
          </h4>
          <div className="flex flex-wrap gap-2">
            {/* If actual variants exist in product object, map them. For now we render a mock placeholder if empty, or map if they exist */}
            {selectedProductVariants.map((v: any, i: number) => (
              <span key={i} className="px-3 py-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold shadow-sm">
                {v.color || v.name} {v.size ? `(${v.size})` : ''} - {v.sku}
              </span>
            ))}
            {selectedProductVariants.length === 0 && (
              <span className="px-3 py-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold shadow-sm">
                Đã có: Đỏ (10ml), Hồng (20ml) (Hiển thị mẫu ngẫu nhiên)
              </span>
            )}
          </div>
        </div>
      )}

      {selectedProductId && (
        <SWTForm
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          className="animate-fade-in mt-4 border-t border-slate-100 dark:border-slate-800 pt-6 [&_.ant-form-item-label>label]:font-semibold [&_.ant-form-item-label>label]:text-slate-700 dark:[&_.ant-form-item-label>label]:!text-slate-300"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <SWTFormItem
              name="color"
              label="Màu sắc / Tên"
              rules={[{ required: true, message: 'Vui lòng nhập màu sắc hoặc tên' }]}
            >
              <SWTInput placeholder="Vd: Đỏ Ruby..." className="dark:!bg-slate-800/80 dark:!border-slate-700 dark:!text-white" />
            </SWTFormItem>

            <SWTFormItem
              name="size"
              label="Kích cỡ / Dung tích"
            >
               <SWTInput placeholder="Vd: 30ml..." className="dark:!bg-slate-800/80 dark:!border-slate-700 dark:!text-white" />
            </SWTFormItem>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <SWTFormItem
              name="sku"
              label="Mã SKU (Barcode)"
            >
               <SWTInput placeholder="Vd: VAR-10293..." className="dark:!bg-slate-800/80 dark:!border-slate-700 dark:!text-white" />
            </SWTFormItem>

            <SWTFormItem
              name="statusName"
              label="Nhãn sự kiện"
              initialValue="NEW"
            >
              <SWTSelect
                options={[
                  { label: "Mới ra mắt (NEW)", value: "NEW" },
                  { label: "Bán chạy (BEST)", value: "BEST_SELLING" },
                  { label: "Xu hướng (HOTS)", value: "TRENDING" },
                ]}
                className="w-full dark:[&_.ant-select-selector]:!bg-slate-800/80 dark:[&_.ant-select-selector]:!border-slate-700 dark:[&_.ant-select-selection-item]:!text-white"
              />
            </SWTFormItem>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <SWTFormItem
              name="price"
              label="Giá Bán (VNĐ)"
              rules={[{ required: true, message: 'Nhập giá bán' }]}
            >
              <SWTInputNumber
                min={0}
                placeholder="0"
                style={{ width: "100%" }}
                className="dark:[&_.ant-input-number-input]:!text-white dark:!bg-slate-800/80 dark:!border-slate-700"
              />
            </SWTFormItem>

            <SWTFormItem
              name="salePrice"
              label="Giá khuyến mãi (VNĐ)"
            >
              <SWTInputNumber
                min={0}
                placeholder="0"
                style={{ width: "100%" }}
                className="dark:[&_.ant-input-number-input]:!text-white dark:!bg-slate-800/80 dark:!border-slate-700"
              />
            </SWTFormItem>
          </div>

          <SWTFormItem
            name="imageFile"
            label="Ảnh minh họa riêng cho biến thể"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) return e;
              return e?.fileList;
            }}
          >
            <SWTUpload
              type="drag"
              limitFile={1}
              uploadType="image"
              listType="picture-card"
              beforeUpload={() => false}
              className="dark:[&_.ant-upload-drag]:!bg-slate-800/50 dark:[&_.ant-upload-drag]:!border-slate-700"
            >
               <div className="flex flex-col items-center justify-center py-4">
                  <Plus size={24} className="text-slate-400 mb-2" />
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Tải 1 ảnh đại diện</span>
               </div>
            </SWTUpload>
          </SWTFormItem>
        </SWTForm>
      )}
    </SWTModal>
  );
}
