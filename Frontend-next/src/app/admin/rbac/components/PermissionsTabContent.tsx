"use client";

import { useState, useMemo, useEffect, useTransition, useRef } from "react";
import PermissionsFilters from "./PermissionsFilters";
import PermissionsTable from "./PermissionsTable";
import AddPermissionModal from "./AddPermissionModal";
import { usePermissions, useSeedPermissions } from "@/src/services/admin/rbac";
import { showNotificationSuccess } from "@/src/@core/utils/message";
import SWTConfirmModal from "@/src/@core/component/AntD/SWTConfirmModal";
import SWTEmpty from "@/src/@core/component/AntD/SWTEmpty";
import { PERMISSION_RESOURCE_LABELS } from "@/src/enums";
import { useSearchParams } from "next/navigation";

interface PermissionsTabContentProps {
  onRefresh?: () => void;
  refreshKey?: number;
}

export default function PermissionsTabContent({ onRefresh, refreshKey }: PermissionsTabContentProps) {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSeedConfirmOpen, setIsSeedConfirmOpen] = useState(false);
  const prevRefreshKeyRef = useRef<number | undefined>(refreshKey);

  const searchTerm = searchParams.get("search") || "";
  const resourceFilter = searchParams.get("resource") || "all";

  // Fetch permissions
  const { permissions = [], loading, error: fetchError, refetch } = usePermissions();
  const permissionList = useMemo(
    () => (Array.isArray(permissions) ? permissions : []),
    [permissions]
  );

  // Permission actions
  const { trigger: seedPermissions, isMutating: seedingPermissions, error: seedError } = useSeedPermissions();

  // Show errors
  useEffect(() => {
    if (fetchError) {
      console.error("PermissionsTabContent error:", fetchError);
    }
  }, [fetchError]);

  useEffect(() => {
    if (seedError) {
      console.error("Seed permissions error:", seedError);
    }
  }, [seedError]);

  // Refresh when refreshKey changes
  useEffect(() => {
    // Skip first render to avoid duplicate fetch on initial mount.
    if (
      refreshKey !== undefined &&
      prevRefreshKeyRef.current !== undefined &&
      refreshKey !== prevRefreshKeyRef.current
    ) {
      refetch();
    }
    prevRefreshKeyRef.current = refreshKey;
  }, [refreshKey, refetch]);

  // Filter permissions
  const filteredPermissions = useMemo(() => {
    return permissionList.filter((perm) => {
      const matchesSearch =
        perm.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        perm.resource?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        perm.action?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesResource =
        !resourceFilter ||
        resourceFilter === "all" ||
        perm.resource?.toLowerCase() === resourceFilter.toLowerCase();

      return matchesSearch && matchesResource;
    });
  }, [permissionList, searchTerm, resourceFilter]);

  // Get unique resources for filter
  const resources = useMemo(() => {
    const uniqueResources = [...new Set(permissionList.map((p) => p.resource))];
    return uniqueResources.sort();
  }, [permissionList]);

  // Group by resource
  const groupedByResource = useMemo(() => {
    return filteredPermissions.reduce((acc, perm) => {
      if (!acc[perm.resource]) {
        acc[perm.resource] = [];
      }
      acc[perm.resource].push(perm);
      return acc;
    }, {} as Record<string, typeof filteredPermissions>);
  }, [filteredPermissions]);

  const openSeedConfirm = () => {
    setIsSeedConfirmOpen(true);
  };

  const handleSeedPermissions = async () => {
    try {
      await seedPermissions();
      showNotificationSuccess("Tạo permissions mặc định thành công");
      if (onRefresh) {
        onRefresh();
      } else {
        await refetch();
      }
    } catch (error: unknown) {
      console.error("Seed permissions error:", error);
    }
    setIsSeedConfirmOpen(false);
  };

  return (
    <div className="bg-bg-card backdrop-blur-md rounded-2xl shadow-sm border border-border-default p-6">
      {/* Filters */}
      <PermissionsFilters
        startTransition={startTransition}
        availableResources={resources}
        onAddClick={() => setIsAddModalOpen(true)}
        onSeedClick={openSeedConfirm}
        isLoading={loading || isPending}
        onRefresh={refetch}
      />

      {/* Permissions Table */}
      <div className="mt-6">
        {permissionList.length === 0 ? (
          <div className="py-12">
            <SWTEmpty />
          </div>
        ) : Object.keys(groupedByResource).length === 0 ? (
          <div className="py-8">
            <SWTEmpty />
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedByResource).map(([resource, perms]) => (
              <div key={resource}>
                <h3 className="text-xs font-black uppercase tracking-wider text-text-muted mb-3">
                  {PERMISSION_RESOURCE_LABELS[resource] ?? resource}
                </h3>
                <PermissionsTable permissions={perms} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Permission Modal */}
      <AddPermissionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={async () => {
          if (onRefresh) {
            onRefresh();
          } else {
            await refetch();
          }
        }}
        availableResources={resources}
      />

      <SWTConfirmModal
        open={isSeedConfirmOpen}
        title="Tạo permissions mặc định"
        description="Bạn có chắc chắn muốn tạo các permissions mặc định? Nếu permissions đã tồn tại, chúng sẽ được bỏ qua."
        onConfirm={handleSeedPermissions}
        onCancel={() => setIsSeedConfirmOpen(false)}
        loading={seedingPermissions}
        variant="warning"
      />
    </div>
  );
}
