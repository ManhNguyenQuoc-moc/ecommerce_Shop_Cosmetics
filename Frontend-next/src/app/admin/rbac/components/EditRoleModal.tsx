"use client";

import { useEffect } from "react";
import { Info } from "lucide-react";
import SWTModal from "@/src/@core/component/AntD/SWTModal";
import SWTForm from "@/src/@core/component/AntD/SWTForm";
import SWTFormItem from "@/src/@core/component/AntD/SWTFormItem";
import SWTInput from "@/src/@core/component/AntD/SWTInput";
import SWTSpin from "@/src/@core/component/AntD/SWTSpin";
import { useRoleById, useUpdateRole, UpdateRoleDto, RBAC_API_ENDPOINT } from "@/src/services/admin/rbac";
import { showNotificationError, showNotificationSuccess } from "@/src/@core/utils/message";
import { mutate } from "swr";

interface EditRoleModalProps {
  roleId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function EditRoleModal({
  roleId,
  onClose,
  onSuccess,
}: EditRoleModalProps) {
  const [form] = SWTForm.useForm();
  const { role, loading: roleLoading } = useRoleById(roleId);
  const { trigger: updateRole, isMutating: updating } = useUpdateRole();

  useEffect(() => {
    if (role) {
      form.setFieldsValue({
        name: role.name,
        description: role.description,
      });
    }
  }, [role, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload: UpdateRoleDto = {
        name: values.name?.trim(),
        description: values.description?.trim(),
      };

      await updateRole({ id: roleId, data: payload });
      mutate(
        (key: unknown) =>
          typeof key === "string" && key.startsWith(`${RBAC_API_ENDPOINT}/roles`),
        undefined,
        { revalidate: true }
      );

      showNotificationSuccess("Cập nhật role thành công!");
      form.resetFields();
      onClose();
      onSuccess?.();
    } catch (error) {
      if (!(error instanceof Error && error.name === "ValidationError")) {
        console.error("Error updating role:", error);
        showNotificationError("Đã có lỗi xảy ra khi cập nhật role. Vui lòng thử lại.");
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
          CHỈNH SỬA ROLE
        </div>
      }
      open={true}
      onCancel={handleCancel}
      onOk={handleSubmit}
      confirmLoading={updating}
      width={500}
      okText="Cập nhật"
      cancelText="Hủy"
      okButtonProps={{
        loading: updating,
        className: "bg-brand-500! border-none! hover:bg-brand-700! rounded-xl! h-10! px-8 font-bold",
      }}
      cancelButtonProps={{
        className: "dark:text-slate-300! dark:bg-slate-800! dark:border-slate-700! rounded-xl! h-10!",
      }}
      className="[&_.ant-modal-header]:px-6! [&_.ant-modal-header]:pt-6! [&_.ant-modal-body]:px-6! [&_.ant-modal-footer]:px-6! [&_.ant-modal-footer]:pb-6! sm:[&_.ant-modal-header]:px-8! sm:[&_.ant-modal-header]:pt-8! sm:[&_.ant-modal-body]:px-8! sm:[&_.ant-modal-footer]:px-8! sm:[&_.ant-modal-footer]:pb-8! dark:[&_.ant-modal-content]:bg-slate-900/90! dark:[&_.ant-modal-content]:border! dark:[&_.ant-modal-content]:border-brand-500/20! dark:[&_.ant-modal-header]:bg-transparent! dark:[&_.ant-modal-title]:bg-transparent!"
    >
      <SWTSpin spinning={roleLoading} tip="Đang tải...">
        <SWTForm
          form={form}
          layout="vertical"
          loading={updating}
          autoComplete="off"
          className="pt-4 [&_.ant-form-item-label>label]:font-semibold [&_.ant-form-item-label>label]:text-slate-700 dark:[&_.ant-form-item-label>label]:text-slate-300!"
        >
          <SWTFormItem
            label="Tên Role"
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập tên role" },
              { min: 2, message: "Tên role phải có ít nhất 2 ký tự" },
            ]}
          >
            <SWTInput
              placeholder="VD: Admin, Manager, Staff..."
              prefix={<Info size={16} className="text-slate-400" />}
              className="h-10! rounded-xl! dark:bg-slate-800/80! dark:border-slate-700! dark:text-white! dark:[&_input]:bg-transparent! dark:[&_input]:text-white!"
            />
          </SWTFormItem>

          <SWTFormItem
            label="Mô tả"
            name="description"
            rules={[
              { min: 3, message: "Mô tả phải có ít nhất 3 ký tự" },
            ]}
          >
            <SWTInput.TextArea
              placeholder="Mô tả chi tiết về role này..."
              rows={4}
              className="rounded-xl! dark:bg-slate-800/80! dark:border-slate-700! dark:text-white!"
            />
          </SWTFormItem>
        </SWTForm>
      </SWTSpin>
    </SWTModal>
  );
}
