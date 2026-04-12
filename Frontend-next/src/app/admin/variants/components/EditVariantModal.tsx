"use client";

import { useEffect, useState } from "react";
import { Tag, Plus } from "lucide-react";
import SWTForm from "@/src/@core/component/AntD/SWTForm";
import SWTFormItem from "@/src/@core/component/AntD/SWTFormItem";
import SWTInput from "@/src/@core/component/AntD/SWTInput";
import SWTInputNumber from "@/src/@core/component/AntD/SWTInputNumber";
import SWTSelect from "@/src/@core/component/AntD/SWTSelect";
import SWTModal from "@/src/@core/component/AntD/SWTModal";
import SWTUpload from "@/src/@core/component/AntD/SWTUpload";
import { updateVariant } from "@/src/services/admin/product.service";
import { showNotificationError, showNotificationSuccess } from "@/src/@core/utils/message";
import { uploadFileToCloudinary } from "@/src/services/admin/upload.service";
import { UpdateVariantInput } from "@/src/services/models/product/input.dto";
import { ProductVariantDto } from "@/src/services/models/product/output.dto";
import Image from "next/image";
interface EditVariantFormValues {
  color: string;
  size?: string;
  sku?: string;
  price: number;
  salePrice?: number;
  costPrice?: number;
  statusName?: 'BEST_SELLING' | 'TRENDING' | 'NEW' | 'SALE';
  imageFile?: any[]; // AntD Upload file list
  
}

interface EditVariantModalProps {
  isOpen: boolean;
  onClose: () => void;
  variant: ProductVariantDto | null;
  onUpdate: () => void;
}

export default function EditVariantModal({ isOpen, onClose, variant, onUpdate }: EditVariantModalProps) {
  const [form] = SWTForm.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (variant && isOpen) {
      form.setFieldsValue({
        color: variant.color,
        size: variant.size,
        sku: variant.sku,
        price: variant.price,
        salePrice: variant.salePrice,
        costPrice : variant.costPrice,
        statusName: variant.statusName || 'NEW',
        imageFile: variant.image ? [{
          uid: `-v-img-${variant.id}`,
          name: 'variant-image',
          status: 'done',
          url: variant.image,
        }] : [],
      });
    }
  }, [variant, isOpen, form]);

  const handleFinish = async (values: EditVariantFormValues) => {
    if (!variant) return;
    setIsSubmitting(true);

    try {
      let imageUrl: string | null = variant.image || null;
      let imageId: string | null = (variant as any).imageId || null;

      // 1. Upload new image if presents
      if (values.imageFile && values.imageFile.length > 0) {
        const fileItem = values.imageFile[0];
        const rawFile = fileItem.originFileObj || fileItem;
        
        if (rawFile instanceof File || rawFile instanceof Blob) {
          imageUrl = await uploadFileToCloudinary(rawFile, "variants");
          imageId = null; // Backend will create new record
        } else if (fileItem.url) {
          imageUrl = fileItem.url;
        }
      } else {
        imageUrl = null;
        imageId = null;
      }

      // 2. Prepare clean DTO
      const submissionData: UpdateVariantInput = {
        id: variant.id,
        color: values.color,
        size: values.size,
        sku: values.sku,
        price: values.price,
        salePrice: values.salePrice || 0,
        costPrice: values.costPrice || 0,
        statusName: values.statusName,
        imageUrl,
        imageId
      };

      console.log(">>> [Update Variant] Submission Data:", submissionData);

      await updateVariant(variant.id, submissionData);
      showNotificationSuccess("Cập nhật biến thể thành công");
      onUpdate();
      onClose();
    } catch (err: any) {
      console.error(err);
      // Hiển thị ở http interceptor rồi
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SWTModal
      title={
         <span className="text-xl font-black text-brand-500">
          Chỉnh Sửa Biến Thể
        </span>
      }
      open={isOpen}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Cập nhật"
      cancelText="Hủy"
      width={700}
      okButtonProps={{
        loading: isSubmitting,
        className: "!bg-fuchsia-600 hover:!bg-fuchsia-700 !border-none !shadow-md shadow-fuchsia-500/30 !rounded-xl",
      }}
      cancelButtonProps={{
        className: "bg-bg-muted text-text-muted border-border-default !rounded-xl",
      }}
      className="[&_.ant-modal-header]:!px-6 [&_.ant-modal-header]:!pt-6 [&_.ant-modal-body]:!px-6 [&_.ant-modal-footer]:!px-6 [&_.ant-modal-footer]:!pb-6 sm:[&_.ant-modal-header]:!px-8 sm:[&_.ant-modal-header]:!pt-8 sm:[&_.ant-modal-body]:!px-8 sm:[&_.ant-modal-footer]:!px-8 sm:[&_.ant-modal-footer]:!pb-8 [&_.ant-modal-content]:!bg-bg-card/95 [&_.ant-modal-content]:!backdrop-blur-xl [&_.ant-modal-content]:!border [&_.ant-modal-content]:!border-border-default [&_.ant-modal-header]:!bg-transparent [&_.ant-modal-title]:!bg-transparent"
    >
      <div className="mb-6 bg-bg-muted p-4 rounded-xl border border-border-default">
        <h4 className="text-sm font-bold text-text-main mb-1 flex items-center gap-2 uppercase tracking-tight">
          Sản phẩm gốc:
        </h4>
        <p className="text-sm text-text-sub font-bold">{variant?.productName || variant?.name}</p>
      </div>

      <SWTForm
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        loading={isSubmitting}
        className="mt-4 [&_.ant-form-item-label>label]:font-bold [&_.ant-form-item-label>label]:text-text-sub uppercase text-xs tracking-tight"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <SWTFormItem
            name="color"
            label="Màu sắc / Tên"
            rules={[{ required: true, message: 'Vui lòng nhập màu sắc hoặc tên' }]}
          >
            <SWTInput placeholder="Vd: Đỏ Ruby..." className="!bg-bg-muted !border-border-default text-text-main" />
          </SWTFormItem>
 
          <SWTFormItem
            name="size"
            label="Kích cỡ / Dung tích"
          >
            <SWTInput placeholder="Vd: 30ml..." className="!bg-bg-muted !border-border-default text-text-main" />
          </SWTFormItem>
        </div>
 
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <SWTFormItem
            name="sku"
            label="Mã SKU (Tự động)"
          >
            <SWTInput disabled placeholder="Mã SKU..." className="!bg-bg-muted !border-border-default text-text-main opacity-60" />
          </SWTFormItem>
 
          <SWTFormItem
            name="statusName"
            label="Nhãn sự kiện"
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
 
       <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
         <SWTFormItem
            name="costPrice"
            label="Giá nhập (VNĐ)"
            rules={[{required:true, message:'Nhập giá nhập kho'}]}
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
            label="Giá Bán (VNĐ)"
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
            label="Giá khuyến mãi (VNĐ)"
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
              className="w-full [&_.ant-upload-drag]:!bg-bg-muted/50 [&_.ant-upload-drag]:!border-border-default mt-4"
            >
              <div className="flex flex-col items-center justify-center py-6">
                <Plus size={24} className="text-text-muted mb-2" />
                <span className="text-sm font-bold text-text-sub uppercase tracking-tight">
                  Thay đổi ảnh
                </span>
              </div>
            </SWTUpload>
          </SWTFormItem>
      </SWTForm>
    </SWTModal>
  );
}
