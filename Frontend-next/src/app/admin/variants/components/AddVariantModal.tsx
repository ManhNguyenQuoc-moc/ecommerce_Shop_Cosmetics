"use client";

import { useState } from "react";
import { Plus, Tag } from "lucide-react";
import SWTForm from "@/src/@core/component/AntD/SWTForm";
import SWTFormItem from "@/src/@core/component/AntD/SWTFormItem";
import SWTInput from "@/src/@core/component/AntD/SWTInput";
import SWTInputNumber from "@/src/@core/component/AntD/SWTInputNumber";
import SWTSelect from "@/src/@core/component/AntD/SWTSelect";
import SWTModal from "@/src/@core/component/AntD/SWTModal";
import SWTUpload from "@/src/@core/component/AntD/SWTUpload";
import { useProducts, createVariant } from "@/src/services/admin/product.service";
import { showNotificationError, showNotificationSuccess } from "@/src/@core/utils/message";
import { uploadFileToCloudinary } from "@/src/services/admin/upload.service";
import { CreateVariantInput } from "@/src/services/models/product/input.dto";
import { ProductListItemDto } from "@/src/services/models/product/output.dto";

interface AddVariantFormValues {
  color: string;
  size?: string;
  sku?: string;
  costPrice?: number; 
  price: number;
  salePrice?: number;
  statusName?: 'BEST_SELLING' | 'TRENDING' | 'NEW';
  imageFile?: any[];
}

interface AddVariantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: CreateVariantInput & { productId: string }) => void;
}

export default function AddVariantModal({ isOpen, onClose, onAdd }: AddVariantModalProps) {
  const [form] = SWTForm.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const { products, isLoading: isProductsLoading } = useProducts(1, 100);

  const handleFinish = async (values: AddVariantFormValues) => {
    if (!selectedProductId) return;
    setIsSubmitting(true);
    let imageUrl: string | null = null;

    try {
      if (values.imageFile && values.imageFile.length > 0) {
        const fileItem = values.imageFile[0];
        const rawFile = fileItem.originFileObj || fileItem;
        if (rawFile instanceof File || rawFile instanceof Blob) {
          imageUrl = await uploadFileToCloudinary(rawFile, "variants");
        }
      }
      const submissionData: CreateVariantInput & { productId: string } = {
        productId: selectedProductId,
        color: values.color,
        size: values.size,
        sku: values.sku,
        costPrice: values.costPrice || null,
        price: values.price,
        salePrice: values.salePrice || null,
        statusName: values.statusName,
        imageUrl: imageUrl,
      };
      console.log(">>> [Create Variant] Submission Data:", submissionData);
      await createVariant(submissionData);
      showNotificationSuccess("Tạo biến thể thành công");

      onAdd(submissionData);
      form.resetFields();
      setSelectedProductId(null);
      onClose();
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  const selectedProduct = products.find((p: ProductListItemDto) => p.id === selectedProductId);
  const selectedProductVariants = (selectedProduct as any)?.variants || []; // Assuming nested variants if available
  return (
    <SWTModal
      title={
         <span className="text-xl font-black text-brand-500">
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
      className="[&_.ant-modal-header]:!px-6 [&_.ant-modal-header]:!pt-6 [&_.ant-modal-body]:!px-6 [&_.ant-modal-footer]:!px-6 [&_.ant-modal-footer]:!pb-6 sm:[&_.ant-modal-header]:!px-8 sm:[&_.ant-modal-header]:!pt-8 sm:[&_.ant-modal-body]:!px-8 sm:[&_.ant-modal-footer]:!px-8 sm:[&_.ant-modal-footer]:!pb-8 dark:[&_.ant-modal-content]:!bg-slate-900/95 dark:[&_.ant-modal-content]:!border dark:[&_.ant-modal-content]:!border-fuchsia-500/20 dark:[&_.ant-modal-header]:!bg-transparent dark:[&_.ant-modal-title]:!bg-transparent"
    >
      <div className="mt-4 mb-6">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Chọn Sản Phẩm Gốc <span className="text-red-500">*</span>
        </label>
        <SWTSelect
          placeholder="Tìm kiếm và chọn sản phẩm..."
          loading={isProductsLoading}
          options={products
            ?.filter((p: any) => p.status !== 'HIDDEN')
            .map((p: any) => ({ label: p.name, value: p.id })) || []}
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
          }
          className="w-full h-11 dark:[&_.ant-select-selector]:!bg-slate-800/80 dark:[&_.ant-select-selector]:!border-slate-700 dark:[&_.ant-select-selection-item]:!text-white"
          value={selectedProductId}
          onChange={(val) => setSelectedProductId(val)}
        />
        <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 animate-fade-in rounded-xl">
           <p className="text-xs text-amber-700 dark:text-amber-400 font-medium mb-0 leading-relaxed">
            * Lưu ý: Chỉ được phép thêm biến thể cho các sản phẩm đã tồn tại trên hệ thống. 
            Nếu muốn thêm biến thể cho các sản phẩm đang bị ẩn, vui lòng khôi phục sản phẩm đó trước.
          </p>
        </div>
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
          loading={isSubmitting}
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

          {/* Đã gộp 3 ô Giá vào cùng 1 hàng */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6">
            <SWTFormItem
              name="costPrice"
              label="Giá nhập (VNĐ)"
              rules={[{ required: true, message: 'Nhập giá nhập' }]}
            >
              <SWTInputNumber
                min={0}
                placeholder="0"
                style={{ width: "100%" }}
                className="dark:[&_.ant-input-number-input]:!text-white dark:!bg-slate-800/80 dark:!border-slate-700"
              />
            </SWTFormItem>

            <SWTFormItem
              name="price"
              label="Giá bán (VNĐ)"
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
              label="Giá khuyến mãi"
              dependencies={['price']}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const originalPrice = getFieldValue('price');
                    if (!value || !originalPrice || value <= originalPrice) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Giá khuyến mãi không được lớn hơn giá gốc'));
                  },
                }),
              ]}
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
              beforeUpload={() => false}
              className="dark:[&_.ant-upload-drag]:!bg-slate-800/50 dark:[&_.ant-upload-drag]:!border-slate-700 mt-4"
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