"use client";

import { useState, useEffect } from "react";
import { Plus, Ticket, Calendar, DollarSign, Info } from "lucide-react";
import SWTForm from "@/src/@core/component/AntD/SWTForm";
import SWTFormItem from "@/src/@core/component/AntD/SWTFormItem";
import SWTInput, { SWTInputTextArea } from "@/src/@core/component/AntD/SWTInput";
import SWTInputNumber from "@/src/@core/component/AntD/SWTInputNumber";
import SWTSelect from "@/src/@core/component/AntD/SWTSelect";
import SWTModal from "@/src/@core/component/AntD/SWTModal";
import { showNotificationError, showNotificationSuccess } from "@/src/@core/utils/message";
import { VoucherResponseDto, VoucherType } from "@/src/services/models/voucher/output.dto";
import { useCreateVoucher, useUpdateVoucher, VOUCHER_API_ENDPOINT } from "@/src/services/admin/user/voucher.hook";
import { useSWRConfig } from "swr";
import dayjs from "dayjs";
import SWTDatePicker from "@/src/@core/component/AntD/SWTDatePicker";

interface AddVoucherFormValues {
  code: string;
  program_name: string;
  description: string;
  type: VoucherType | "";
  discount: number;
  min_order_value?: number;
  max_discount?: number;
  point_cost?: number;
  usage_limit?: number;
  valid_from: string;
  valid_until: string;
}

interface AddVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: VoucherResponseDto | null;
}

export default function AddVoucherModal({ isOpen, onClose, initialData }: AddVoucherModalProps) {
  const [form] = SWTForm.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { trigger: createVoucher } = useCreateVoucher();
  const { trigger: updateVoucher } = useUpdateVoucher();
  const { mutate } = useSWRConfig();

  const isEdit = !!initialData;

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.setFieldsValue({
          ...initialData,
          valid_from: initialData.valid_from ? dayjs(initialData.valid_from) : undefined,
          valid_until: initialData.valid_until ? dayjs(initialData.valid_until) : undefined,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({ type: "PERCENTAGE" });
      }
    }
  }, [isOpen, initialData, form]);

  const handleFinish = async (values: AddVoucherFormValues) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...values,
        discount: Number(values.discount),
        min_order_value: Number(values.min_order_value || 0),
        max_discount: values.max_discount ? Number(values.max_discount) : undefined,
        point_cost: Number(values.point_cost || 0),
        usage_limit: Number(values.usage_limit || 100),
        valid_from: values.valid_from ? dayjs(values.valid_from).toISOString() : "",
        valid_until: values.valid_until ? dayjs(values.valid_until).toISOString() : "",
      };

      if (isEdit) {
        await updateVoucher({ id: initialData!.id, data: payload });
      } else {
        await createVoucher(payload);
      }
      
      showNotificationSuccess(isEdit ? "Cập nhật Voucher thành công" : "Tạo Voucher thành công");
      form.resetFields();
      mutate(`${VOUCHER_API_ENDPOINT}?all=true`);
      onClose();
    } catch (err: any) {
      if (err.errors && Array.isArray(err.errors)) {
        err.errors.forEach((e: any) => showNotificationError(`${e.path || 'Lỗi'}: ${e.message}`));
      } else {
        showNotificationError(err.message || "Có lỗi xảy ra");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SWTModal
      title={
        <span className="text-xl font-black text-brand-500 flex items-center gap-2">
          <Ticket className="text-brand-500" />
          {isEdit ? "Chỉnh Sửa Voucher" : "Tạo Voucher Mới"}
        </span>
      }
      open={isOpen}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText={isEdit ? "Cập nhật" : "Lưu Voucher"}
      cancelText="Hủy"
      width={700}
      okButtonProps={{
        loading: isSubmitting,
        className: "!bg-brand-500 hover:!bg-brand-600 !border-none !shadow-md shadow-brand-500/30 !rounded-xl",
      }}
      cancelButtonProps={{
        className: "dark:!text-slate-300 dark:!bg-slate-800 dark:!border-slate-700 !rounded-xl",
      }}
      className="[&_.ant-modal-header]:!px-6 [&_.ant-modal-header]:!pt-6 [&_.ant-modal-body]:!px-6 [&_.ant-modal-footer]:!px-6 [&_.ant-modal-footer]:!pb-6 sm:[&_.ant-modal-header]:!px-8 sm:[&_.ant-modal-header]:!pt-8 sm:[&_.ant-modal-body]:!px-8 sm:[&_.ant-modal-footer]:!px-8 sm:[&_.ant-modal-footer]:!pb-8 dark:[&_.ant-modal-content]:!bg-slate-900/95 dark:[&_.ant-modal-content]:!border dark:[&_.ant-modal-content]:!border-brand-500/20 dark:[&_.ant-modal-header]:!bg-transparent"
    >
      <SWTForm
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={initialData ? {
          ...initialData,
          valid_from: initialData.valid_from ? dayjs(initialData.valid_from) : undefined,
          valid_until: initialData.valid_until ? dayjs(initialData.valid_until) : undefined,
        } : { type: "PERCENTAGE" }}
        className="animate-fade-in mt-4 [&_.ant-form-item-label>label]:font-semibold [&_.ant-form-item-label>label]:text-slate-700 dark:[&_.ant-form-item-label>label]:!text-slate-300"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <SWTFormItem
            name="code"
            label="Mã Voucher"
            rules={[{ required: true, message: 'Vui lòng nhập mã voucher' }]}
          >
            <SWTInput 
              placeholder="Vd: SUMMER2024..." 
              disabled={isEdit}
              className="uppercase dark:!bg-slate-800/80 dark:!border-slate-700 dark:!text-white" 
            />
          </SWTFormItem>

          <SWTFormItem
            name="program_name"
            label="Tên Chương trình"
            rules={[{ required: true, message: 'Vui lòng nhập tên chương trình' }]}
          >
            <SWTInput placeholder="Vd: Ưu đãi mùa hè..." className="dark:!bg-slate-800/80 dark:!border-slate-700 dark:!text-white" />
          </SWTFormItem>
        </div>

        <SWTFormItem
          name="description"
          label="Mô tả ưu đãi"
        >
          <SWTInputTextArea 
            placeholder="Nhập chi tiết điều kiện áp dụng..." 
            rows={3}
            className="dark:!bg-slate-800/80 dark:!border-slate-700 dark:!text-white !rounded-xl" 
          />
        </SWTFormItem>

        <div className="p-4 bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-800/50 rounded-2xl mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <SWTFormItem
              name="type"
              label="Loại Voucher"
              rules={[{ required: true }]}
            >
              <SWTSelect
                options={[
                  { label: "Giảm theo phần trăm (%)", value: "PERCENTAGE" },
                  { label: "Giảm số tiền cố định (đ)", value: "FLAT_AMOUNT" },
                ]}
                className="w-full dark:[&_.ant-select-selector]:!bg-slate-800/80 dark:[&_.ant-select-selector]:!border-slate-700 dark:[&_.ant-select-selection-item]:!text-white"
              />
            </SWTFormItem>

            <SWTFormItem
              name="discount"
              label="Giá trị giảm"
              rules={[{ required: true, message: 'Nhập giá trị giảm' }]}
            >
              <SWTInputNumber
                min={0}
                placeholder="0"
                style={{ width: "100%" }}
                className="dark:[&_.ant-input-number-input]:!text-white dark:!bg-slate-800/80 dark:!border-slate-700"
              />
            </SWTFormItem>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <SWTFormItem
              name="min_order_value"
              label="Giá trị đơn tối thiểu (đ)"
            >
              <SWTInputNumber
                min={0}
                placeholder="0"
                style={{ width: "100%" }}
                className="dark:[&_.ant-input-number-input]:!text-white dark:!bg-slate-800/80 dark:!border-slate-700"
              />
            </SWTFormItem>

            <SWTFormItem
              name="max_discount"
              label="Giảm tối đa (đ)"
              tooltip="Chỉ áp dụng cho loại giảm theo %"
            >
              <SWTInputNumber
                min={0}
                placeholder="0"
                style={{ width: "100%" }}
                className="dark:[&_.ant-input-number-input]:!text-white dark:!bg-slate-800/80 dark:!border-slate-700"
              />
            </SWTFormItem>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <SWTFormItem
              name="usage_limit"
              label="Giới hạn số lượt dùng"
            >
              <SWTInputNumber
                min={1}
                placeholder="100"
                style={{ width: "100%" }}
                className="dark:[&_.ant-input-number-input]:!text-white dark:!bg-slate-800/80 dark:!border-slate-700"
              />
            </SWTFormItem>

            <SWTFormItem
              name="point_cost"
              label="Điểm yêu cầu đổi (tùy chọn)"
              tooltip="Khách hàng phải có đủ số điểm này mới dùng được voucher"
            >
              <SWTInputNumber
                min={0}
                placeholder="0"
                style={{ width: "100%" }}
                className="dark:[&_.ant-input-number-input]:!text-white dark:!bg-slate-800/80 dark:!border-slate-700"
              />
            </SWTFormItem>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <SWTFormItem
            name="valid_from"
            label="Ngày bắt đầu"
            rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
          >
            <SWTDatePicker className="w-full !h-10 dark:!bg-slate-800/80 dark:!border-slate-700 dark:!text-white" format="DD/MM/YYYY" placeholder="Chọn ngày" />
          </SWTFormItem>

          <SWTFormItem
            name="valid_until"
            label="Ngày kết thúc"
            rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}
          >
             <SWTDatePicker className="w-full !h-10 dark:!bg-slate-800/80 dark:!border-slate-700 dark:!text-white" format="DD/MM/YYYY" placeholder="Chọn ngày" />
          </SWTFormItem>
        </div>

        <div className="mt-2 flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50 rounded-xl">
          <Info size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-700 dark:text-amber-400 font-medium mb-0 flex-1 leading-relaxed">
            Hệ thống sẽ tự động kích hoạt voucher dựa trên ngày bắt đầu. Hãy đảm bảo các điều kiện áp dụng được mô tả rõ ràng để tránh tranh khiếu nại từ khách hàng.
          </p>
        </div>
      </SWTForm>
    </SWTModal>
  );
}
