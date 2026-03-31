"use client";

import { useEffect, useState } from "react";
import { Tag } from "lucide-react";
import SWTForm from "@/src/@core/component/AntD/SWTForm";
import SWTFormItem from "@/src/@core/component/AntD/SWTFormItem";
import SWTInput from "@/src/@core/component/AntD/SWTInput";
import SWTInputNumber from "@/src/@core/component/AntD/SWTInputNumber";
import SWTSelect from "@/src/@core/component/AntD/SWTSelect";
import SWTModal from "@/src/@core/component/AntD/SWTModal";
import SWTUpload from "@/src/@core/component/AntD/SWTUpload";
import { updateVariant } from "@/src/services/admin/product.service";
import { showNotificationError, showNotificationSuccess } from "@/src/@core/utils/message";

interface EditVariantModalProps {
  isOpen: boolean;
  onClose: () => void;
  variant: any;
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
        statusName: variant.statusName || 'NEW',
      });
    }
  }, [variant, isOpen, form]);

  const handleFinish = async (values: any) => {
    setIsSubmitting(true);
    try {
      await updateVariant(variant.id, values);
      showNotificationSuccess("Cập nhật biến thể thành công");
      onUpdate();
      onClose();
    } catch (err: any) {
      console.error(err);
      showNotificationError("Lỗi khi cập nhật biến thể");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SWTModal
      title={
        <span className="text-xl font-black bg-gradient-to-r from-fuchsia-500 to-purple-600 bg-clip-text text-transparent inline-block drop-shadow-sm pb-1">
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
      className="[&_.ant-modal-header]:!px-6 [&_.ant-modal-body]:!px-6 sm:[&_.ant-modal-header]:!px-8 sm:[&_.ant-modal-body]:!px-8 dark:[&_.ant-modal-content]:!bg-slate-900/95 dark:[&_.ant-modal-content]:!border dark:[&_.ant-modal-content]:!border-fuchsia-500/20"
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
            label="Mã SKU (Barcode)"
          >
            <SWTInput placeholder="Vd: VAR-10293..." className="dark:!bg-slate-800/80 dark:!border-slate-700 dark:!text-white" />
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
      </SWTForm>
    </SWTModal>
  );
}
