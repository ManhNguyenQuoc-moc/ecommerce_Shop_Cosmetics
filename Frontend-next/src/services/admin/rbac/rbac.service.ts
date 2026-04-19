/**
 * RBAC Service Layer
 * Centralized API communication for RBAC operations
 * Responsibility: Handle API calls, error handling, data transformation
 */

import { get, post, put, del } from "@/src/@core/utils/api";
import {
  CreateRoleDto,
  UpdateRoleDto,
  AssignPermissionsDto,
  CreatePermissionDto,
  RoleDto,
  PermissionDto,
  ApiResponse,
} from "./dtos/rbac.dto";

/**
 * RbacService - API communication layer
 * All API calls go through this service
 * No direct axios/fetch calls in components/hooks
 */
export class RbacService {
  private static readonly BASE_URL = "/admin/rbac";

  // ============ ROLE ENDPOINTS ============

  /**
   * Fetch all roles with their permissions
   */
  static async getAllRoles(): Promise<RoleDto[]> {
    try {
      const data = await get<RoleDto[]>(
        `${this.BASE_URL}/roles`
      );
      return data || [];
    } catch (error: any) {
      console.error("[RbacService] Error fetching roles:", error);
      throw new Error(
        error.response?.data?.error || "Failed to fetch roles"
      );
    }
  }

  /**
   * Fetch single role by ID with permissions
   */
  static async getRoleById(roleId: string): Promise<RoleDto> {
    try {
      const data = await get<RoleDto>(
        `${this.BASE_URL}/roles/${roleId}`
      );

      if (!data) {
        throw new Error("Role not found");
      }

      return data;
    } catch (error: any) {
      console.error("[RbacService] Error fetching role:", error);
      throw new Error(
        error.response?.data?.error || "Failed to fetch role"
      );
    }
  }

  /**
   * Create new role
   * @param data Role creation data
   * @throws Error if validation fails or name already exists
   */
  static async createRole(data: CreateRoleDto): Promise<RoleDto> {
    try {
      // Frontend validation
      if (!data.name || data.name.trim() === "") {
        throw new Error("Role name is required");
      }
      if (data.name.trim().length < 2) {
        throw new Error("Role name must be at least 2 characters");
      }

      const result = await post<RoleDto>(
        `${this.BASE_URL}/roles`,
        {
          name: data.name.trim(),
          description: data.description?.trim(),
        }
      );

      if (!result) {
        throw new Error("Failed to create role");
      }

      return result;
    } catch (error: any) {
      console.error("[RbacService] Error creating role:", error);
      throw new Error(
        error.response?.data?.error || error.message || "Failed to create role"
      );
    }
  }

  /**
   * Update role
   * @param roleId Role ID to update
   * @param data Partial role data
   * @throws Error if role not found or validation fails
   */
  static async updateRole(roleId: string, data: UpdateRoleDto): Promise<RoleDto> {
    try {
      // Frontend validation
      if (data.name && data.name.trim().length < 2) {
        throw new Error("Role name must be at least 2 characters");
      }

      const result = await put<RoleDto>(
        `${this.BASE_URL}/roles/${roleId}`,
        {
          name: data.name?.trim(),
          description: data.description?.trim(),
        }
      );

      if (!result) {
        throw new Error("Failed to update role");
      }

      return result;
    } catch (error: any) {
      console.error("[RbacService] Error updating role:", error);
      throw new Error(
        error.response?.data?.error || error.message || "Failed to update role"
      );
    }
  }

  /**
   * Delete role
   * @param roleId Role ID to delete
   * @throws Error if role not found
   */
  static async deleteRole(roleId: string): Promise<void> {
    try {
      await del(`${this.BASE_URL}/roles/${roleId}`);
    } catch (error: any) {
      console.error("[RbacService] Error deleting role:", error);
      throw new Error(
        error.response?.data?.error || "Failed to delete role"
      );
    }
  }

  /**
   * Assign permissions to role (replaces existing)
   * @param roleId Role ID
   * @param permissionIds Permission IDs to assign
   * @throws Error if role or permissions not found
   */
  static async assignPermissionsToRole(
    roleId: string,
    permissionIds: string[]
  ): Promise<RoleDto> {
    try {
      // Frontend validation
      if (!Array.isArray(permissionIds)) {
        throw new Error("Permission IDs must be an array");
      }

      const result = await post<RoleDto>(
        `${this.BASE_URL}/roles/${roleId}/permissions`,
        {
          permissionIds,
        }
      );

      if (!result) {
        throw new Error("Failed to assign permissions");
      }

      return result;
    } catch (error: any) {
      console.error("[RbacService] Error assigning permissions:", error);
      throw new Error(
        error.response?.data?.error || error.message || "Failed to assign permissions"
      );
    }
  }

  // ============ PERMISSION ENDPOINTS ============

  /**
   * Fetch all permissions
   */
  static async getAllPermissions(): Promise<PermissionDto[]> {
    try {
      const data = await get<PermissionDto[]>(
        `${this.BASE_URL}/permissions`
      );
      return data || [];
    } catch (error: any) {
      console.error("[RbacService] Error fetching permissions:", error);
      throw new Error(
        error.response?.data?.error || "Failed to fetch permissions"
      );
    }
  }

  /**
   * Fetch permissions by resource
   * @param resource Resource name (e.g., "user", "product")
   */
  static async getPermissionsByResource(
    resource: string
  ): Promise<PermissionDto[]> {
    try {
      if (!resource || resource.trim() === "") {
        throw new Error("Resource parameter is required");
      }

      const data = await get<PermissionDto[]>(
        `${this.BASE_URL}/permissions/by-resource`,
        { resource }
      );

      return data || [];
    } catch (error: any) {
      console.error(
        "[RbacService] Error fetching permissions by resource:",
        error
      );
      throw new Error(
        error.response?.data?.error || "Failed to fetch permissions"
      );
    }
  }

  /**
   * Create new permission
   * @param data Permission creation data
   */
  static async createPermission(
    data: CreatePermissionDto
  ): Promise<PermissionDto> {
    try {
      // Frontend validation
      if (!data.name || data.name.trim() === "") {
        throw new Error("Permission name is required");
      }
      if (!data.resource || data.resource.trim() === "") {
        throw new Error("Resource is required");
      }
      if (!data.action || data.action.trim() === "") {
        throw new Error("Action is required");
      }

      const result = await post<PermissionDto>(
        `${this.BASE_URL}/permissions`,
        {
          name: data.name.trim(),
          resource: data.resource.trim().toLowerCase(),
          action: data.action.trim().toLowerCase(),
          description: data.description?.trim(),
        }
      );

      if (!result) {
        throw new Error("Failed to create permission");
      }

      return result;
    } catch (error: any) {
      console.error("[RbacService] Error creating permission:", error);
      throw new Error(
        error.response?.data?.error || error.message || "Failed to create permission"
      );
    }
  }

  /**
   * Get all unique resources
   */
  static async getAllResources(): Promise<string[]> {
    try {
      const data = await get<string[]>(
        `${this.BASE_URL}/resources`
      );
      return data || [];
    } catch (error: any) {
      console.error("[RbacService] Error fetching resources:", error);
      throw new Error(
        error.response?.data?.error || "Failed to fetch resources"
      );
    }
  }

  /**
   * Seed default permissions
   * Call this once to initialize system permissions
   */
  static async seedDefaultPermissions(): Promise<void> {
    try {
      await post(`${this.BASE_URL}/seed-permissions`);
    } catch (error: any) {
      console.error("[RbacService] Error seeding permissions:", error);
      throw new Error(
        error.response?.data?.error || "Failed to seed permissions"
      );
    }
  }
}
