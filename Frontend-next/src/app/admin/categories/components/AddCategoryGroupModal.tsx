"use client";

import React, { useEffect, useState } from 'react';
import { Info, AlignLeft } from "lucide-react";
import SWTModal from "@/src/@core/component/AntD/SWTModal";
import SWTForm from "@/src/@core/component/AntD/SWTForm";
import SWTFormItem from "@/src/@core/component/AntD/SWTFormItem";
import SWTInput, { SWTInputTextArea } from "@/src/@core/component/AntD/SWTInput";
import { useCreateCategoryGroup, useUpdateCategoryGroup } from "@/src/hooks/admin/category-group.hook";
import { CATEGORY_GROUP_API_ENDPOINT } from "@/src/services/admin/category-group.service";
import { showNotificationError, showNotificationSuccess } from "@/src/@core/utils/message";
import { CategoryGroupResponseDto } from "@/src/services/models/category-group/output.dto";
import { mutate } from "swr";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  initialData?: CategoryGroupResponseDto | null;
};

export default function AddCategoryGroupModal({ isOpen, onClose, initialData }: Props) {
  const [form] = SWTForm.useForm();
  const { trigger: createGroup, isMutating: creating } = useCreateCategoryGroup();
  const { trigger: updateGroup, isMutating: updating } = useUpdateCategoryGroup();

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        name: initialData.name,
        description: initialData.description,
      });
    } else {
      form.resetFields();
    }
  }, [initialData, form, isOpen]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        name: values.name,
        description: values.description,
      };

      if (initialData) {
        await updateGroup({ id: initialData.id, data: payload });
        showNotificationSuccess("Cập nhật nhóm danh mục thành công!");
      } else {
        await createGroup(payload);
        showNotificationSuccess("Thêm nhóm danh mục mới thành công!");
      }

      mutate(
        (key: any) => typeof key === 'string' && key.startsWith(CATEGORY_GROUP_API_ENDPOINT),
        undefined,
        { revalidate: true }
      );

      onClose();
    } catch (e: any) {
      if (e.name !== 'ValidationError') {
        showNotificationError(e.message || "Lỗi thao tác");
      }
    }
  };

  return (
    <SWTModal
      title={
        <div className="text-xl font-bold bg-gradient-to-r from-brand-600 to-brand-500 bg-clip-text text-transparent uppercase">
          {initialData ? "CHỈNH SỬA NHÓM DANH MỤC" : "THÊM NHÓM DANH MỤC MỚI"}
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={creating || updating}
      width={600}
      okText={initialData ? "Cập nhật" : "Thêm mới"}
      cancelText="Hủy"
      okButtonProps={{
        loading: creating || updating,
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
        loading={creating || updating}
        className="pt-4 [&_.ant-form-item-label>label]:font-semibold [&_.ant-form-item-label>label]:text-slate-700 dark:[&_.ant-form-item-label>label]:!text-slate-300"
      >
        <SWTFormItem
          name="name"
          label="Tên nhóm danh mục"
          rules={[{ required: true, message: "Vui lòng nhập tên nhóm danh mục" }]}
        >
          <SWTInput
            placeholder="Vd: Trang điểm, Chăm sóc da..."
            prefix={<Info size={16} className="text-slate-400" />}
            className="!h-10 !rounded-xl dark:!bg-slate-800/80 dark:!border-slate-700 dark:!text-white dark:[&_input]:!bg-transparent dark:[&_input]:!text-white"
          />
        </SWTFormItem>

        <SWTFormItem
          name="description"
          label="Mô tả chi tiết"
        >
          <SWTInputTextArea
            rows={4}
            placeholder="Mô tả chung cho nhóm danh mục này..."
            className="!rounded-xl dark:!bg-slate-800/80 dark:!border-slate-700 dark:!text-white"
          />
        </SWTFormItem>
      </SWTForm>
    </SWTModal>
  );
}
