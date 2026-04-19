"use client";

import { Edit2, Trash2, Link2, MoreVertical } from "lucide-react";
import SWTTable from "@/src/@core/component/AntD/SWTTable";
import SWTIconButton from "@/src/@core/component/SWTIconButton";
import SWTConfirmModal from "@/src/@core/component/AntD/SWTConfirmModal";
import SWTEmpty from "@/src/@core/component/AntD/SWTEmpty";
import { RoleDto } from "@/src/services/admin/rbac";
import { useState, useMemo } from "react";
import { Dropdown } from "antd";
import type { MenuProps } from "antd";

interface RolesTableProps {
  roles: RoleDto[];
  loading: boolean;
  onEdit: (roleId: string) => void;
  onDelete: (roleId: string) => void;
  onAssignPermissions: (role: RoleDto) => void;
  isDeleting: boolean;
  isAssigning: boolean;
}

export default function RolesTable({
  roles,
  loading,
  onEdit,
  onDelete,
  onAssignPermissions,
  isDeleting,
  isAssigning,
}: RolesTableProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; roleId: string | null }>({
    open: false,
    roleId: null,
  });

  const columns = useMemo(() => [
    {
      title: "Tên Role",
      dataIndex: "name",
      key: "name",
      width: 150,
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (text: string) => text || "-",
    },
    {
      title: "Permissions",
      dataIndex: "permissions",
      key: "permCount",
      width: 120,
      render: (perms: any[]) => {
        const count = perms?.length || 0;

        return (
          <div className="flex flex-col items-center gap-1">
            <div
              className={`text-sm font-black ${count === 0 ? "text-text-muted line-through" : "text-text-main"}`}
            >
              {count}
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
              quyền
            </div>
          </div>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 130,
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Thao tác",
      key: "actions",
      align: "center" as const,
      width: 80,
      render: (_: any, record: RoleDto) => {
        const actionItems: MenuProps['items'] = [
          {
            key: 'edit',
            label: (
              <div className="flex items-center gap-2 font-medium px-1 py-1 text-amber-600">
                <Edit2 size={16} />
                <span>Chỉnh sửa</span>
              </div>
            ),
            onClick: () => onEdit(record.id),
          },
          {
            key: 'assign',
            label: (
              <div className="flex items-center gap-2 font-medium px-1 py-1 text-blue-600">
                <Link2 size={16} />
                <span>Gán quyền</span>
              </div>
            ),
            onClick: () => onAssignPermissions(record),
          },
          { type: 'divider' },
          {
            key: 'delete',
            label: (
              <div className="flex items-center gap-2 font-medium px-1 py-1 text-red-600">
                <Trash2 size={16} />
                <span>Xóa</span>
              </div>
            ),
            onClick: () => setDeleteConfirm({ open: true, roleId: record.id }),
          },
        ];

        return (
          <Dropdown menu={{ items: actionItems }} trigger={['click']} placement="bottomRight">
            <SWTIconButton
              variant="custom"
              icon={<MoreVertical size={18} />}
              className="text-text-muted hover:text-brand-500 border-transparent hover:border-brand-500/30"
            />
          </Dropdown>
        );
      },
    },
  ], [onEdit, onAssignPermissions]);

  return (
    <>
      {roles.length === 0 && !loading ? (
        <SWTEmpty />
      ) : (
        <SWTTable
          columns={columns}
          dataSource={roles}
          rowKey="id"
          loading={loading}
          pagination={false}
          className="w-full"
        />
      )}

      {/* Delete Confirm Modal */}
      <SWTConfirmModal
        title="Xóa Role"
        open={deleteConfirm.open}
        description="Bạn có chắc chắn muốn xóa role này? Hành động này không thể hoàn tác."
        onConfirm={() => {
          if (deleteConfirm.roleId) {
            onDelete(deleteConfirm.roleId);
            setDeleteConfirm({ open: false, roleId: null });
          }
        }}
        onCancel={() => setDeleteConfirm({ open: false, roleId: null })}
        loading={isDeleting}
        variant="danger"
      />
    </>
  );
}
