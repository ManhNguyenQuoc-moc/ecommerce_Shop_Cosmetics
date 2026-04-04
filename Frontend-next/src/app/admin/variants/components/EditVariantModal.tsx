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
  statusName?: 'BEST_SELLING' | 'TRENDING' | 'NEW';
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
        className: "dark:!text-slate-300 dark:!bg-slate-800 dark:!border-slate-700 !rounded-xl",
      }}
      className="[&_.ant-modal-header]:!px-6 [&_.ant-modal-header]:!pt-6 [&_.ant-modal-body]:!px-6 [&_.ant-modal-footer]:!px-6 [&_.ant-modal-footer]:!pb-6 sm:[&_.ant-modal-header]:!px-8 sm:[&_.ant-modal-header]:!pt-8 sm:[&_.ant-modal-body]:!px-8 sm:[&_.ant-modal-footer]:!px-8 sm:[&_.ant-modal-footer]:!pb-8 dark:[&_.ant-modal-content]:!bg-slate-900/95 dark:[&_.ant-modal-content]:!border dark:[&_.ant-modal-content]:!border-fuchsia-500/20 dark:[&_.ant-modal-header]:!bg-transparent dark:[&_.ant-modal-title]:!bg-transparent"
    >
      <div className="mb-6 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-2">
          Sản phẩm gốc:
        </h4>
        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{variant?.productName || variant?.name}</p>
      </div>

      <SWTForm
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        loading={isSubmitting}
        className="mt-4 [&_.ant-form-item-label>label]:font-semibold [&_.ant-form-item-label>label]:text-slate-700 dark:[&_.ant-form-item-label>label]:!text-slate-300"
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
            label="Mã SKU (Tự động)"
          >
            <SWTInput disabled placeholder="Mã SKU..." className="dark:!bg-slate-800/80 dark:!border-slate-700 dark:!text-white" />
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
              ]}
              className="w-full dark:[&_.ant-select-selector]:!bg-slate-800/80 dark:[&_.ant-select-selector]:!border-slate-700 dark:[&_.ant-select-selection-item]:!text-white"
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
              className="dark:[&_.ant-input-number-input]:!text-white dark:!bg-slate-800/80 dark:!border-slate-700"
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
              beforeUpload={() => false}
              className="w-full dark:[&_.ant-upload-drag]:!bg-slate-800/50 dark:[&_.ant-upload-drag]:!border-slate-700"
            >
              <div className="flex flex-col items-center justify-center py-6">
                <Plus size={24} className="text-slate-400 mb-2" />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  Thay đổi ảnh
                </span>
              </div>
            </SWTUpload>
          </SWTFormItem>
      </SWTForm>
    </SWTModal>
  );
}
