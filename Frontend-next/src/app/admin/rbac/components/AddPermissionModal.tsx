"use client";

import { useMemo } from "react";
import { Info } from "lucide-react";
import SWTModal from "@/src/@core/component/AntD/SWTModal";
import SWTForm from "@/src/@core/component/AntD/SWTForm";
import SWTFormItem from "@/src/@core/component/AntD/SWTFormItem";
import SWTInput from "@/src/@core/component/AntD/SWTInput";
import SWTSelect from "@/src/@core/component/AntD/SWTSelect";
import { CreatePermissionDto, RBAC_API_ENDPOINT, useCreatePermission, useResources } from "@/src/services/admin/rbac";
import { showNotificationError, showNotificationSuccess } from "@/src/@core/utils/message";
import { mutate } from "swr";
import { PERMISSION_RESOURCE_LABELS } from "@/src/enums";

interface AddPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  availableResources?: string[];
}

export default function AddPermissionModal({
  isOpen,
  onClose,
  onSuccess,
  availableResources,
}: AddPermissionModalProps) {
  const [form] = SWTForm.useForm();
  const { trigger: createPermission, isMutating: creating } = useCreatePermission();
  const { resources } = useResources(isOpen);

  const commonActions = ["create", "read", "update", "delete", "list", "manage"];

  const resourceOptions = useMemo(() => {
    const knownResources = Object.keys(PERMISSION_RESOURCE_LABELS);
    const merged = new Set<string>([
      ...knownResources,
      ...(Array.isArray(resources) ? resources : []),
      ...(Array.isArray(availableResources) ? availableResources : []),
    ]);
    return Array.from(merged)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
  }, [resources, availableResources]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const resource = Array.isArray(values.resource) 
        ? values.resource[0] 
        : values.resource;
      const action = Array.isArray(values.action) 
        ? values.action[0] 
        : values.action;

      const payload: CreatePermissionDto = {
        name: values.name?.trim() || `${resource}:${action}`,
        resource: resource?.trim().toLowerCase(),
        action: action?.trim().toLowerCase(),
        description: values.description?.trim(),
      };

      await createPermission(payload);
      mutate(
        (key: unknown) =>
          typeof key === "string" && key.startsWith(`${RBAC_API_ENDPOINT}/permissions`),
        undefined,
        { revalidate: true }
      );

      showNotificationSuccess("Tạo permission thành công!");
      form.resetFields();
      onClose();
      onSuccess?.();
    } catch (error) {
      if (!(error instanceof Error && error.name === "ValidationError")) {
        console.error("Error submitting permission:", error);
        showNotificationError("Đã có lỗi xảy ra khi tạo permission. Vui lòng thử lại.");
      }
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <SWTModal
      title={
        <div className="text-xl font-bold bg-linear-to-r from-brand-600 to-brand-500 bg-clip-text text-transparent uppercase">
          THÊM PERMISSION MỚI
        </div>
      }
      open={isOpen}
      onCancel={handleCancel}
      onOk={handleSubmit}
      confirmLoading={creating}
      width={600}
      okText="Thêm mới"
      cancelText="Hủy"
      okButtonProps={{
        loading: creating,
        className: "bg-brand-500! border-none! hover:bg-brand-700! rounded-xl! h-10! px-8 font-bold",
      }}
      cancelButtonProps={{
        className: "dark:text-slate-300! dark:bg-slate-800! dark:border-slate-700! rounded-xl! h-10!",
      }}
      className="[&_.ant-modal-header]:px-6! [&_.ant-modal-header]:pt-6! [&_.ant-modal-body]:px-6! [&_.ant-modal-footer]:px-6! [&_.ant-modal-footer]:pb-6! sm:[&_.ant-modal-header]:px-8! sm:[&_.ant-modal-header]:pt-8! sm:[&_.ant-modal-body]:px-8! sm:[&_.ant-modal-footer]:px-8! sm:[&_.ant-modal-footer]:pb-8! dark:[&_.ant-modal-content]:bg-slate-900/90! dark:[&_.ant-modal-content]:border! dark:[&_.ant-modal-content]:border-brand-500/20! dark:[&_.ant-modal-header]:bg-transparent! dark:[&_.ant-modal-title]:bg-transparent!"
    >
      <SWTForm
        form={form}
        layout="vertical"
        loading={creating}
        autoComplete="off"
        className="pt-4 [&_.ant-form-item-label>label]:font-semibold [&_.ant-form-item-label>label]:text-slate-700 dark:[&_.ant-form-item-label>label]:text-slate-300!"
      >
        <div className="grid grid-cols-2 gap-4">
          <SWTFormItem
            label="Resource"
            name="resource"
            rules={[
              { required: true, message: "Vui lòng chọn resource" },
            ]}
          >
            <SWTSelect
              placeholder="Chọn resource..."
              options={[
                ...resourceOptions.map((r) => ({ label: r, value: r })),
              ]}
              allowClear
              className="w-full h-10!"
            />
          </SWTFormItem>

          <SWTFormItem
            label="Action"
            name="action"
            rules={[
              { required: true, message: "Vui lòng chọn action" },
            ]}
          >
            <SWTSelect
              placeholder="Chọn action..."
              options={commonActions.map((a) => ({ label: a, value: a }))}
              allowClear
              className="w-full h-10!"
            />
          </SWTFormItem>
        </div>

        <SWTFormItem
          label="Permission Name"
          name="name"
          rules={[
            { min: 3, message: "Tên phải có ít nhất 3 ký tự" },
          ]}
          help="Bỏ trống sẽ tự động tạo: resource:action"
        >
          <SWTInput
            placeholder="VD: product:create"
            prefix={<Info size={16} className="text-slate-400" />}
            className="h-10! rounded-xl! dark:bg-slate-800/80! dark:border-slate-700! dark:text-white! dark:[&_input]:bg-transparent! dark:[&_input]:text-white!"
          />
        </SWTFormItem>

        <SWTFormItem
          label="Mô tả"
          name="description"
          rules={[
            { min: 5, message: "Mô tả phải có ít nhất 5 ký tự" },
          ]}
        >
          <SWTInput.TextArea
            placeholder="Mô tả chi tiết quyền này là gì..."
            rows={3}
            className="rounded-xl! dark:bg-slate-800/80! dark:border-slate-700! dark:text-white!"
          />
        </SWTFormItem>
      </SWTForm>
    </SWTModal>
  );
}
