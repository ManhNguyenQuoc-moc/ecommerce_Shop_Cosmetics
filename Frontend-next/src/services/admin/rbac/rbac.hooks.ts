/**
 * RBAC Custom Hooks
 * Provides easy-to-use hooks for role & permission management
 * Uses SWR for caching and automatic updates
 */

"use client";

import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import useSWRMutation from "swr/mutation";
import { get, post, put, del } from "@/src/@core/utils/api";
import {
  CreateRoleDto,
  UpdateRoleDto,
  CreatePermissionDto,
  RoleDto,
  PermissionDto,
} from "./dtos/rbac.dto";

export const RBAC_API_ENDPOINT = "/admin/rbac";

const normalizeListData = <T>(data: unknown, key: string): T[] => {
  if (Array.isArray(data)) return data as T[];

  const wrapped = data as Record<string, unknown> | undefined;
  const nested = wrapped?.[key];
  return Array.isArray(nested) ? (nested as T[]) : [];
};

// ============ ROLE HOOKS ============

/**
 * Hook to fetch all roles
 * Returns cached roles with mutate function for real-time updates
 */
export const useRoles = () => {
  const { data, isLoading, error, mutate } = useFetchSWR<RoleDto[]>(
    `${RBAC_API_ENDPOINT}/roles`,
    () => get<RoleDto[]>(`${RBAC_API_ENDPOINT}/roles`),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    }
  );

  const normalizedRoles = normalizeListData<RoleDto>(data, "roles");

  return {
    roles: normalizedRoles,
    loading: isLoading,
    error,
    mutate,
    refetch: mutate,
  };
};

/**
 * Hook to fetch a single role by ID
 * Returns cached role with mutate function
 */
export const useRoleById = (roleId: string | null) => {
  const shouldFetch = !!roleId;

  const { data, isLoading, error, mutate } = useFetchSWR<RoleDto>(
    shouldFetch ? `${RBAC_API_ENDPOINT}/roles/${roleId}` : null,
    () =>
      shouldFetch
        ? get<RoleDto>(`${RBAC_API_ENDPOINT}/roles/${roleId}`)
        : Promise.resolve(null as any),
    { revalidateOnFocus: false }
  );

  return {
    role: data || null,
    loading: isLoading,
    error,
    mutate,
    refetch: mutate,
  };
};

/**
 * Hook to create a new role
 * Auto-triggers mutate after creation
 */
export const useCreateRole = () => {
  return useSWRMutation(
    RBAC_API_ENDPOINT,
    (_, { arg }: { arg: CreateRoleDto }) =>
      post<RoleDto>(`${RBAC_API_ENDPOINT}/roles`, arg)
  );
};

/**
 * Hook to update an existing role
 */
export const useUpdateRole = () => {
  return useSWRMutation(
    RBAC_API_ENDPOINT,
    (_, { arg }: { arg: { id: string; data: UpdateRoleDto } }) =>
      put<RoleDto>(`${RBAC_API_ENDPOINT}/roles/${arg.id}`, arg.data)
  );
};

/**
 * Hook to delete a role
 */
export const useDeleteRole = () => {
  return useSWRMutation(
    RBAC_API_ENDPOINT,
    (_, { arg }: { arg: string }) =>
      del(`${RBAC_API_ENDPOINT}/roles/${arg}`)
  );
};

/**
 * Hook to assign permissions to a role
 */
export const useAssignPermissions = () => {
  return useSWRMutation(
    RBAC_API_ENDPOINT,
    (_, { arg }: { arg: { roleId: string; permissionIds: string[] } }) =>
      post<RoleDto>(
        `${RBAC_API_ENDPOINT}/roles/${arg.roleId}/permissions`,
        { permissionIds: arg.permissionIds }
      )
  );
};

// ============ PERMISSION HOOKS ============

/**
 * Hook to fetch all permissions
 * Returns cached permissions with mutate function for real-time updates
 */
export const usePermissions = () => {
  const { data, isLoading, error, mutate } = useFetchSWR<PermissionDto[]>(
    `${RBAC_API_ENDPOINT}/permissions`,
    () => get<PermissionDto[]>(`${RBAC_API_ENDPOINT}/permissions`),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    }
  );

  const normalizedPermissions = normalizeListData<PermissionDto>(data, "permissions");

  return {
    permissions: normalizedPermissions,
    loading: isLoading,
    error,
    mutate,
    refetch: mutate,
  };
};

/**
 * Hook to fetch permissions by resource
 */
export const usePermissionsByResource = (resource: string | null) => {
  const shouldFetch = !!resource;

  const { data, isLoading, error, mutate } = useFetchSWR<PermissionDto[]>(
    shouldFetch ? `${RBAC_API_ENDPOINT}/permissions/by-resource/${resource}` : null,
    () =>
      shouldFetch
        ? get<PermissionDto[]>(`${RBAC_API_ENDPOINT}/permissions/by-resource`, {
            resource,
          })
        : Promise.resolve([]),
    { revalidateOnFocus: false }
  );

  const normalizedPermissions = normalizeListData<PermissionDto>(data, "permissions");

  return {
    permissions: normalizedPermissions,
    loading: isLoading,
    error,
    mutate,
    refetch: mutate,
  };
};

/**
 * Hook to create a new permission
 */
export const useCreatePermission = () => {
  return useSWRMutation(
    RBAC_API_ENDPOINT,
    (_, { arg }: { arg: CreatePermissionDto }) =>
      post<PermissionDto>(`${RBAC_API_ENDPOINT}/permissions`, arg)
  );
};

/**
 * Hook to seed default permissions
 */
export const useSeedPermissions = () => {
  return useSWRMutation(
    RBAC_API_ENDPOINT,
    () => post(`${RBAC_API_ENDPOINT}/seed-permissions`)
  );
};

// ============ RESOURCES HOOK ============

/**
 * Hook to fetch all unique resources
 */
export const useResources = (shouldFetch = true) => {
  const { data, isLoading, error, mutate } = useFetchSWR<string[]>(
    shouldFetch ? `${RBAC_API_ENDPOINT}/resources` : null,
    () =>
      shouldFetch
        ? get<string[]>(`${RBAC_API_ENDPOINT}/resources`)
        : Promise.resolve([]),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
    }
  );

  const normalizedResources = normalizeListData<string>(data, "resources");

  return {
    resources: normalizedResources,
    loading: isLoading,
    error,
    mutate,
    refetch: mutate,
  };
};
