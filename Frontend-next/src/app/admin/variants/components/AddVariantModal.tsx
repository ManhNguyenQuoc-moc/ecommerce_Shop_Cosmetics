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
import { useProducts } from "@/src/services/admin/product/product.hook";
import { createVariant } from "@/src/services/admin/product/product.service";
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
  statusName?: 'BEST_SELLING' | 'TRENDING' | 'NEW' | 'SALE';
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
  const [productSearch, setProductSearch] = useState("");
  const { products, isLoading: isProductsLoading } = useProducts(1, 20, { minimal: true, searchTerm: productSearch });

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
        costPrice: values.costPrice || 0,
        price: values.price,
        salePrice: values.salePrice || 0,
        statusName: values.statusName,
        imageUrl: imageUrl,
      };
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
  
  const selectedProductVariants = (selectedProduct as any)?.variants || []; 
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
        className: "!bg-brand-600 hover:!bg-brand-700 !border-none !shadow-md shadow-brand-500/30 !rounded-xl",
      }}
      cancelButtonProps={{
        className: "bg-bg-muted text-text-muted border-border-default !rounded-xl",
      }}
      className="[&_.ant-modal-header]:!px-6 [&_.ant-modal-header]:!pt-6 [&_.ant-modal-body]:!px-6 [&_.ant-modal-footer]:!px-6 [&_.ant-modal-footer]:!pb-6 sm:[&_.ant-modal-header]:!px-8 sm:[&_.ant-modal-header]:!pt-8 sm:[&_.ant-modal-body]:!px-8 sm:[&_.ant-modal-footer]:!px-8 sm:[&_.ant-modal-footer]:!pb-8 [&_.ant-modal-content]:!bg-bg-card/95 [&_.ant-modal-content]:!backdrop-blur-xl [&_.ant-modal-content]:!border [&_.ant-modal-content]:!border-border-default [&_.ant-modal-header]:!bg-transparent [&_.ant-modal-title]:!bg-transparent"
    >
      <div className="mt-4 mb-6">
        <label className="block text-sm font-bold text-text-sub uppercase tracking-tight mb-2">
          Chọn Sản Phẩm Gốc <span className="text-status-error-text">*</span>
        </label>
        <SWTSelect
          placeholder="Tìm kiếm và chọn sản phẩm..."
          loading={isProductsLoading}
          options={products
            ?.filter((p: any) => p.status !== 'HIDDEN')
            .map((p: any) => ({ label: p.name, value: p.id })) || []}
          showSearch
          filterOption={false}
          onSearch={(val) => setProductSearch(val)}
          className="w-full h-11 [&_.ant-select-selector]:!bg-bg-muted/80 [&_.ant-select-selector]:!border-border-default [&_.ant-select-selection-item]:!text-text-main"
          value={selectedProductId}
          onChange={(val) => setSelectedProductId(val)}
        />
        <div className="mt-3 p-3 bg-status-warning-bg/10 border border-status-warning-border animate-fade-in rounded-xl">
          <p className="text-xs text-status-warning-text font-bold mb-0 leading-relaxed ">
            * Lưu ý: Chỉ được phép thêm biến thể cho các sản phẩm đã tồn tại trên hệ thống.
            Nếu muốn thêm biến thể cho các sản phẩm đang bị ẩn, vui lòng khôi phục sản phẩm đó trước.
          </p>
        </div>
      </div>

      {selectedProduct && selectedProductVariants.length > 0 && (
        <div className="mb-6 bg-bg-muted p-4 rounded-xl border border-border-default">
          <h4 className="text-sm font-bold text-text-main mb-3 flex items-center gap-2 uppercase tracking-tight">
            <Tag size={16} className="text-brand-500" />
            Các phiên bản hiện tại của sản phẩm này:
          </h4>
          <div className="flex flex-wrap gap-2">
            {/* If actual variants exist in product object, map them. For now we render a mock placeholder if empty, or map if they exist */}
            {selectedProductVariants.map((v: any, i: number) => (
              <span key={i} className="px-3 py-1 bg-bg-card text-text-main border border-border-default rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm">
                {v.color || v.name} {v.size ? `(${v.size})` : ''} - {v.sku}
              </span>
            ))}
            {selectedProductVariants.length === 0 && (
              <span className="px-3 py-1 bg-bg-card text-text-muted border border-border-default rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm italic opacity-50">
                Chưa có biến thể nào được tạo
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
          className="animate-fade-in mt-4 border-t border-border-default pt-6 [&_.ant-form-item-label>label]:font-bold [&_.ant-form-item-label>label]:text-text-sub uppercase text-xs tracking-tight"
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
                  { label: "Giảm giá (SALE)", value: "SALE" },
                ]}
                className="w-full [&_.ant-select-selector]:!bg-bg-muted !border-border-default [&_.ant-select-selection-item]:!text-text-main"
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
                className="[&_.ant-input-number-input]:!text-text-main !bg-bg-muted !border-border-default"
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
                className="[&_.ant-input-number-input]:!text-text-main !bg-bg-muted !border-border-default"
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
                className="[&_.ant-input-number-input]:!text-text-main !bg-bg-muted !border-border-default"
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
              className="[&_.ant-upload-drag]:!bg-bg-muted/50 [&_.ant-upload-drag]:!border-border-default mt-4"
            >
              <div className="flex flex-col items-center justify-center py-4">
                <Plus size={24} className="text-text-muted mb-2" />
                <span className="text-sm font-bold text-text-sub uppercase tracking-tight">Tải 1 ảnh đại diện</span>
              </div>
            </SWTUpload>
          </SWTFormItem>
        </SWTForm>
      )}
    </SWTModal>
  );
}