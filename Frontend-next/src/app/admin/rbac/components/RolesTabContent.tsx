"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import RolesFilters from "./RolesFilters";
import RolesTable from "./RolesTable";
import AddRoleModal from "./AddRoleModal";
import EditRoleModal from "./EditRoleModal";
import PermissionAssigner from "./PermissionAssigner";
import { useRoles, useDeleteRole, RoleDto } from "@/src/services/admin/rbac";
import { showNotificationSuccess } from "@/src/@core/utils/message";

interface RolesTabContentProps {
  onRefresh?: () => void;
  refreshKey?: number;
}

export default function RolesTabContent({ onRefresh, refreshKey }: RolesTabContentProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [assigningRole, setAssigningRole] = useState<RoleDto | null>(null);
  const prevRefreshKeyRef = useRef<number | undefined>(refreshKey);

  // Fetch roles
  const {
    roles,
    loading,
    error: fetchError,
    refetch,
  } = useRoles();

  // Role actions
  const { trigger: deleteRole, isMutating: deleting, error: deleteError } = useDeleteRole();

  // Show errors
  useEffect(() => {
    if (fetchError) {
      console.error("RolesTabContent fetch error:", fetchError);
    }
  }, [fetchError]);

  useEffect(() => {
    if (deleteError) {
      console.error("Delete role error:", deleteError);
    }
  }, [deleteError]);

  // Refresh when refreshKey changes
  useEffect(() => {
    if (
      refreshKey !== undefined &&
      prevRefreshKeyRef.current !== undefined &&
      refreshKey !== prevRefreshKeyRef.current
    ) {
      refetch();
    }
    prevRefreshKeyRef.current = refreshKey;
  }, [refreshKey, refetch]);

  // Filter roles by search
  const filteredRoles = useMemo(() => {
    const roleList = Array.isArray(roles) ? roles : [];
    return roleList.filter(
      (role) =>
        role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [roles, searchTerm]);

  const handleDelete = async (roleId: string) => {
    try {
      await deleteRole(roleId);
      showNotificationSuccess("Xóa role thành công");
      if (onRefresh) {
        onRefresh();
      } else {
        await refetch();
      }
    } catch (error: unknown) {
      console.error("Delete role error:", error);
    }
  };

  return (
    <div className="bg-bg-card backdrop-blur-md rounded-2xl shadow-sm border border-border-default p-6">
      {/* Filters */}
      <RolesFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddClick={() => setIsAddModalOpen(true)}
        isLoading={loading}
        onRefresh={refetch}
      />

      {/* Roles Table */}
      <div className="mt-6">
        <RolesTable
          roles={filteredRoles}
          loading={loading}
          onEdit={setEditingRoleId}
          onDelete={handleDelete}
          onAssignPermissions={setAssigningRole}
          isDeleting={deleting}
          isAssigning={false}
        />
      </div>

      {/* Add Role Modal */}
      <AddRoleModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={async () => {
          if (onRefresh) {
            onRefresh();
          } else {
            await refetch();
          }
        }}
      />

      {editingRoleId && (
        <EditRoleModal
          roleId={editingRoleId}
          onClose={() => setEditingRoleId(null)}
          onSuccess={async () => {
            setEditingRoleId(null);
            if (onRefresh) {
              onRefresh();
            } else {
              await refetch();
            }
          }}
        />
      )}

      {/* Permission Assigner */}
      {assigningRole && (
        <PermissionAssigner
          role={assigningRole}
          onClose={() => setAssigningRole(null)}
          onSuccess={async () => {
            setAssigningRole(null);
            if (onRefresh) {
              onRefresh();
            } else {
              await refetch();
            }
          }}
        />
      )}
    </div>
  );
}
