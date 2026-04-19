"use client";

import { useState, useEffect, useMemo } from "react";
import SWTModal from "@/src/@core/component/AntD/SWTModal";
import SWTSpin from "@/src/@core/component/AntD/SWTSpin";
import SWTCheckbox from "@/src/@core/component/AntD/SWTCheckbox";
import SWTDivider from "@/src/@core/component/AntD/SWTDivider";
import {
  usePermissions,
  useAssignPermissions,
  RoleDto,
  PermissionDto,
} from "@/src/services/admin/rbac";
import { showNotificationError, showNotificationSuccess } from "@/src/@core/utils/message";
import {
  PERMISSION_ACTION_LABELS,
  PERMISSION_RESOURCE_LABELS,
} from "@/src/enums";

interface PermissionAssignerProps {
  role: RoleDto;
  onClose: () => void;
  onSuccess: () => void;
  isLoading?: boolean;
}

export default function PermissionAssigner({
  role,
  onClose,
  onSuccess,
  isLoading,
}: PermissionAssignerProps) {
  // Hooks for fetching and managing permissions
  const { permissions, loading, error: fetchError } = usePermissions();
  const { trigger: assignPermissions, isMutating: assigning, error: assignError } = useAssignPermissions();

  // Local state
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>(
    role?.permissions?.map((p) => p.id) || []
  );

  // Show errors
  useEffect(() => {
    if (fetchError) {
      showNotificationError(
        typeof fetchError === "string" ? fetchError : "Không tải được danh sách permissions."
      );
    }
    if (assignError) {
      showNotificationError(
        typeof assignError === "string" ? assignError : "Không cập nhật được permissions cho role."
      );
    }
  }, [fetchError, assignError]);

  // Group permissions by resource
  const groupedPermissions = useMemo(() => {
    return permissions.reduce((acc, perm) => {
      if (!acc[perm.resource]) {
        acc[perm.resource] = [];
      }
      acc[perm.resource].push(perm);
      return acc;
    }, {} as Record<string, PermissionDto[]>);
  }, [permissions]);

  const resourceKeys = useMemo(() => Object.keys(groupedPermissions), [groupedPermissions]);

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissionIds([...selectedPermissionIds, permissionId]);
    } else {
      setSelectedPermissionIds(
        selectedPermissionIds.filter((id) => id !== permissionId)
      );
    }
  };

  const handleSelectAll = (resource: string, checked: boolean) => {
    const resourcePermIds = groupedPermissions[resource].map((p) => p.id);
    if (checked) {
      setSelectedPermissionIds([
        ...new Set([...selectedPermissionIds, ...resourcePermIds]),
      ]);
    } else {
      setSelectedPermissionIds(
        selectedPermissionIds.filter((id) => !resourcePermIds.includes(id))
      );
    }
  };

  const handleSave = async () => {
    try {
      await assignPermissions({ roleId: role.id, permissionIds: selectedPermissionIds });
      showNotificationSuccess("Cập nhật quyền hạn thành công");
      onSuccess();
    } catch (error: unknown) {
      const message =
        error && typeof error === "object" && "message" in error
          ? String((error as { message?: string }).message || "Không cập nhật được permissions cho role.")
          : "Không cập nhật được permissions cho role.";
      showNotificationError(message);
    }
  };

  return (
    <SWTModal
      title={
        <div className="text-xl font-bold bg-linear-to-r from-brand-600 to-brand-500 bg-clip-text text-transparent uppercase">
          GÁN QUYỀN CHO ROLE: {role?.name}
        </div>
      }
      open={true}
      onCancel={onClose}
      onOk={handleSave}
      confirmLoading={isLoading ?? assigning}
      width={800}
      centered
      okText="Lưu thay đổi"
      cancelText="Hủy"
      okButtonProps={{
        loading: isLoading ?? assigning,
        className: "bg-brand-500! border-none! hover:bg-brand-700! rounded-xl! h-10! px-8 font-bold",
      }}
      cancelButtonProps={{
        className: "dark:text-slate-300! dark:bg-slate-800! dark:border-slate-700! rounded-xl! h-10!",
      }}
      className="[&_.ant-modal-header]:px-6! [&_.ant-modal-header]:pt-6! [&_.ant-modal-body]:px-6! [&_.ant-modal-footer]:px-6! [&_.ant-modal-footer]:pb-6! sm:[&_.ant-modal-header]:px-8! sm:[&_.ant-modal-header]:pt-8! sm:[&_.ant-modal-body]:px-8! sm:[&_.ant-modal-footer]:px-8! sm:[&_.ant-modal-footer]:pb-8! dark:[&_.ant-modal-content]:bg-slate-900/90! dark:[&_.ant-modal-content]:border! dark:[&_.ant-modal-content]:border-brand-500/20 dark:[&_.ant-modal-header]:bg-transparent! dark:[&_.ant-modal-title]:bg-transparent!"
    >
      <SWTSpin spinning={loading} tip="Đang tải permissions...">
        <div className="max-h-[60vh] overflow-y-auto pt-4 pr-1 flex flex-col gap-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="p-3 rounded-xl border border-status-info-border bg-status-info-bg/10 text-status-info-text text-sm font-bold">
            Đã chọn: <span className="text-base">{selectedPermissionIds.length}</span> quyền hạn
          </div>

          {resourceKeys.map((resource) => (
            <div key={resource} className="rounded-xl border border-border-default bg-bg-card/40 p-4 flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <SWTCheckbox
                  classNames="[&_.ant-checkbox+span]:!p-0"
                  checked={
                    groupedPermissions[resource].every((p) =>
                      selectedPermissionIds.includes(p.id)
                    ) && groupedPermissions[resource].length > 0
                  }
                  indeterminate={
                    groupedPermissions[resource].some((p) =>
                      selectedPermissionIds.includes(p.id)
                    ) &&
                    !groupedPermissions[resource].every((p) =>
                      selectedPermissionIds.includes(p.id)
                    )
                  }
                  onChange={(e) =>
                    handleSelectAll(resource, e.target.checked)
                  }
                >
                  <strong className="text-sm font-black uppercase tracking-wider text-text-main">
                    {PERMISSION_RESOURCE_LABELS[resource] ?? resource}
                  </strong>
                </SWTCheckbox>

                <div className="text-[10px] font-black uppercase tracking-wider text-text-muted px-2 py-1 rounded border border-border-default bg-bg-muted">
                  {groupedPermissions[resource].length} quyền
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-6">
                {groupedPermissions[resource].map((perm) => (
                  <SWTCheckbox
                    key={perm.id}
                    classNames="!m-0"
                    checked={selectedPermissionIds.includes(perm.id)}
                    onChange={(e) =>
                      handlePermissionChange(perm.id, e.target.checked)
                    }
                  >
                    <span className="flex flex-col gap-0.5">
                      <span className="font-bold text-text-main text-sm">
                        {PERMISSION_ACTION_LABELS[perm.action] ?? perm.action}
                      </span>
                      <span className="text-xs text-text-sub">
                        {perm.description || perm.name}
                      </span>
                    </span>
                  </SWTCheckbox>
                ))}
              </div>

              <SWTDivider className="my-0!" />
            </div>
          ))}
        </div>
      </SWTSpin>
    </SWTModal>
  );
}
