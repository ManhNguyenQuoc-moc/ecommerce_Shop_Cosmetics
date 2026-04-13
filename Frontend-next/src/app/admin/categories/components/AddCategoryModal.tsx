"use client";

import React, { useEffect, useState } from 'react';
import { Info, AlignLeft, Image as ImageIcon, Upload as UploadIcon, X } from "lucide-react";
import SWTModal from "@/src/@core/component/AntD/SWTModal";
import SWTForm from "@/src/@core/component/AntD/SWTForm";
import SWTFormItem from "@/src/@core/component/AntD/SWTFormItem";
import SWTInput, { SWTInputTextArea } from "@/src/@core/component/AntD/SWTInput";
import SWTUpload from "@/src/@core/component/AntD/SWTUpload";
import SWTIconButton from "@/src/@core/component/SWTIconButton";
import { useCreateCategory, useUpdateCategory, CATEGORY_API_ENDPOINT } from "@/src/hooks/admin/category.hook";
import { useCategoryGroups } from "@/src/hooks/admin/category-group.hook";
import { uploadFileToCloudinary as uploadImage } from "@/src/services/admin/upload.service";
import { Select } from "antd";
import { showNotificationError, showNotificationSuccess } from "@/src/@core/utils/message";
import { CategoryResponseDto } from "@/src/services/models/category/output.dto";
import { mutate } from "swr";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: CategoryResponseDto | null;
};

export default function AddCategoryModal({ isOpen, onClose, initialData }: Props) {
  const [form] = SWTForm.useForm();
  const { trigger: createCategory, isMutating: creating } = useCreateCategory();
  const { trigger: updateCategory, isMutating: updating } = useUpdateCategory();

  const [fileList, setFileList] = useState<any[]>([]);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { categoryGroups } = useCategoryGroups(1, 100);

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        name: initialData.name,
        description: initialData.description,
        categoryGroupId: initialData.categoryGroupId,
      });
      const oldUrl = (initialData as any).image?.url || "";
      setImageUrl(oldUrl);
      setSelectedFile(null);

      if (oldUrl) {
        setFileList([{
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: oldUrl,
        }]);
      } else {
        setFileList([]);
      }
    } else {
      form.resetFields();
      setImageUrl("");
      setSelectedFile(null);
      setFileList([]);
    }
  }, [initialData, form, isOpen]);

  const uploadProps = {
    onRemove: (file: any) => {
      setFileList([]);
      setSelectedFile(null);
      setImageUrl("");
    },
    beforeUpload: (file: any) => {
      setFileList([file]);
      setSelectedFile(file);
      return false; // Chặn antd tự upload
    },
    fileList,
  };

  const handleSubmit = async () => {
    try {
      setIsUploading(true);
      const values = await form.validateFields();
      let finalImageUrl = imageUrl;
      if (selectedFile) {
        const uploadedUrl = await uploadImage(selectedFile, "categories");
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
        }
      }

      const payload = {
        name: values.name,
        description: values.description,
        categoryGroupId: values.categoryGroupId,
        image: finalImageUrl && !finalImageUrl.startsWith("blob:") ? { url: finalImageUrl } : null,
      };

      if (initialData) {
        await updateCategory({ id: initialData.id, data: payload });
        showNotificationSuccess("Cập nhật danh mục thành công!");
      } else {
        await createCategory(payload);
        showNotificationSuccess("Thêm danh mục mới thành công!");
      }
      mutate(
        (key: any) => typeof key === 'string' && key.startsWith(CATEGORY_API_ENDPOINT),
        undefined,
        { revalidate: true }
      );

      onClose();
    } catch (e: any) {
      if (e.name !== 'ValidationError') {
        showNotificationError(e.message || "Lỗi thao tác");
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SWTModal
      title={
        <div className="text-xl font-bold bg-gradient-to-r from-brand-600 to-brand-500 bg-clip-text text-transparent">
          {initialData ? "CHỈNH SỬA DANH MỤC" : "THÊM DANH MỤC MỚI"}
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={creating || updating || isUploading}
      width={600}
      okText={initialData ? "Cập nhật" : "Thêm mới"}
      cancelText="Hủy"
      okButtonProps={{
        loading: creating || updating || isUploading,
        className: "!bg-brand-500 !border-none hover:!bg-brand-700 !rounded-xl !h-10 px-8 font-bold"
      }}
      cancelButtonProps={{
        className: "dark:!text-slate-300 dark:!bg-slate-800 dark:!border-slate-700 !rounded-xl !h-10",
      }}
      className="[&_.ant-modal-header]:!px-6 [&_.ant-modal-header]:!pt-6 [&_.ant-modal-body]:!px-6 [&_.ant-modal-footer]:!px-6 [&_.ant-modal-footer]:!pb-6 sm:[&_.ant-modal-header]:!px-8 sm:[&_.ant-modal-header]:!pt-8 sm:[&_.ant-modal-body]:!px-8 sm:[&_.ant-modal-footer]:!px-8 sm:[&_.ant-modal-footer]:!pb-8 dark:[&_.ant-modal-content]:!bg-slate-900/90 dark:[&_.ant-modal-content]:!border dark:[&_.ant-modal-content]:!border-brand-500/20 dark:[&_.ant-modal-header]:!bg-transparent dark:[&_.ant-modal-title]:!bg-transparent"
    >
      <SWTForm
        form={form}
        layout="vertical"
        loading={creating || updating || isUploading}
        className="pt-4 [&_.ant-form-item-label>label]:font-semibold [&_.ant-form-item-label>label]:text-slate-700 dark:[&_.ant-form-item-label>label]:!text-slate-300"
      >
        <SWTFormItem
          name="name"
          label="Tên danh mục"
          rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}
        >
          <SWTInput
            placeholder="Vd: Chăm sóc da, Tẩy trang..."
            prefix={<Info size={16} className="text-slate-400" />}
            className="!h-10 !rounded-xl dark:!bg-slate-800/80 dark:!border-slate-700 dark:!text-white dark:[&_input]:!bg-transparent dark:[&_input]:!text-white"
          />
        </SWTFormItem>

        <SWTFormItem
          name="categoryGroupId"
          label="Nhóm danh mục"
        >
          <Select
            placeholder="Chọn nhóm danh mục (không bắt buộc)"
            allowClear
            className="w-full !h-10 [&_.ant-select-selector]:!rounded-xl dark:[&_.ant-select-selector]:!bg-slate-800/80 dark:[&_.ant-select-selector]:!border-slate-700 dark:[&_.ant-select-selection-item]:!text-white dark:[&_.ant-select-selection-placeholder]:!text-slate-500"
            options={categoryGroups.map(g => ({ label: g.name, value: g.id }))}
          />
        </SWTFormItem>

        <div className="grid grid-cols-2 gap-4">
          <SWTFormItem
            name="description"
            label="Mô tả chi tiết"
            className="col-span-2"
          >
            <SWTInputTextArea
              rows={4}
              placeholder="Ví dụ: Các sản phẩm dành riêng cho da nhạy cảm..."
              className="!rounded-xl dark:!bg-slate-800/80 dark:!border-slate-700 dark:!text-white"
            />
          </SWTFormItem>
        </div>

        <div className="mt-2 space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block">Ảnh Danh Mục</label>
          <div className="w-full">
            <SWTUpload
              {...uploadProps}
              type="drag"
              limitFile={1}
              uploadType="image"
              listType="picture"
              multiple={false}
              className="w-full dark:[&_.ant-upload-drag]:!bg-slate-800/50 dark:[&_.ant-upload-drag]:!border-slate-700 hover:dark:[&_.ant-upload-drag]:!border-brand-500/60 dark:[&_.ant-upload-text]:!text-slate-300 dark:[&_.ant-upload-hint]:!text-slate-500"
            >
              <div className="py-4 flex flex-col items-center justify-center gap-2 cursor-pointer text-slate-400 hover:text-emerald-500">
                <UploadIcon size={28} className="text-brand-500 dark:text-brand-400 mb-2" />
                <span className="font-medium text-slate-600 dark:text-slate-300">Nhấp hoặc kéo thả hình ảnh vào đây</span>
                <span className="text-xs text-slate-500">Hỗ trợ định dạng JPG, PNG</span>
              </div>
            </SWTUpload>
          </div>
        </div>

      </SWTForm>
    </SWTModal>
  );
}
