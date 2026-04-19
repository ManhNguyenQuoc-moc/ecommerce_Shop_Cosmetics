"use client";

import { useState, useEffect } from "react";
import { Form, Input, Modal } from "antd";
import { useCreateRole, useUpdateRole, RoleDto, UpdateRoleDto, CreateRoleDto } from "@/src/services/admin/rbac";
import { showNotificationError, showNotificationSuccess } from "@/src/@core/utils/message";

interface RoleFormProps {
  role?: RoleDto;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RoleForm({ role, onClose, onSuccess }: RoleFormProps) {
  const [form] = Form.useForm();
  const { trigger: createRole, isMutating: creating, error: createError } = useCreateRole();
  const { trigger: updateRole, isMutating: updating, error: updateError } = useUpdateRole();
  const loading = creating || updating;

  // Show error if any
  useEffect(() => {
    if (createError) {
      showNotificationError(createError);
    }
  }, [createError]);

  useEffect(() => {
    if (updateError) {
      showNotificationError(updateError);
    }
  }, [updateError]);

  const handleSubmit = async (values: any) => {
    try {
      if (role?.id) {
        // Update existing role
        const updateData: UpdateRoleDto = {
          name: values.name?.trim(),
          description: values.description?.trim(),
        };
        await updateRole({ id: role.id, data: updateData });
        showNotificationSuccess("Cập nhật role thành công");
      } else {
        // Create new role
        const createData: CreateRoleDto = {
          name: values.name.trim(),
          description: values.description?.trim(),
        };
        await createRole(createData);
        showNotificationSuccess("Tạo role thành công");
      }
      onSuccess();
    } catch (error: any) {
      // Error is already shown by the useRoleActions hook
      console.error("Form submission error:", error);
    }
  };

  return (
    <Modal
      title={role ? "Chỉnh sửa Role" : "Tạo Role Mới"}
      open={true}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={loading}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          name: role?.name || "",
          description: role?.description || ""
        }}
      >
        <Form.Item
          name="name"
          label="Tên Role"
          rules={[
            { required: true, message: "Vui lòng nhập tên role" },
            { min: 2, message: "Tên role phải ít nhất 2 ký tự" }
          ]}
        >
          <Input placeholder="VD: ADMIN, MANAGER, STAFF" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả"
          rules={[{ min: 5, message: "Mô tả phải ít nhất 5 ký tự" }]}
        >
          <Input.TextArea
            placeholder="Mô tả chức năng của role này"
            rows={3}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
