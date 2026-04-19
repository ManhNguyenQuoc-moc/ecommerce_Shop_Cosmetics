/**
 * RBAC Permission Parser & Validator
 * Utility functions for permission handling
 * Status: PREPARED - Not yet in use
 */

import { prisma } from "../config/prisma";

/**
 * Permission structure
 */
export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description?: string;
}

/**
 * Check if user has permission
 * 
 * @param userId User ID
 * @param resource Resource name (e.g., "user", "product")
 * @param action Action name (e.g., "create", "delete")
 * @returns true if user has permission
 */
export async function hasPermission(
  userId: string,
  resource: string,
  action: string
): Promise<boolean> {
  try {
    const permission = await prisma.permission.findFirst({
      where: {
        resource,
        action,
      },
    });

    if (!permission) {
      console.warn(
        `[RBAC] Permission not found: ${resource}:${action}`
      );
      return false;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { roleId: true },
    });

    if (!user?.roleId) return false;

    const userPermission = await prisma.rolePermission.findUnique({
      where: {
        roleId_permissionId: {
          roleId: user.roleId,
          permissionId: permission.id,
        },
      },
    });

    return !!userPermission;
  } catch (error) {
    console.error("[RBAC] Has permission check error:", error);
    return false;
  }
}

/**
 * Check if user has any of multiple permissions
 * 
 * @param userId User ID
 * @param permissions Array of {resource, action} pairs
 * @returns true if user has at least one permission
 */
export async function hasAnyPermission(
  userId: string,
  permissions: Array<{ resource: string; action: string }>
): Promise<boolean> {
  try {
    for (const perm of permissions) {
      if (await hasPermission(userId, perm.resource, perm.action)) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error("[RBAC] Has any permission check error:", error);
    return false;
  }
}

/**
 * Check if user has all permissions
 * 
 * @param userId User ID
 * @param permissions Array of {resource, action} pairs
 * @returns true if user has all permissions
 */
export async function hasAllPermissions(
  userId: string,
  permissions: Array<{ resource: string; action: string }>
): Promise<boolean> {
  try {
    for (const perm of permissions) {
      if (!(await hasPermission(userId, perm.resource, perm.action))) {
        return false;
      }
    }
    return true;
  } catch (error) {
    console.error("[RBAC] Has all permissions check error:", error);
    return false;
  }
}

/**
 * Get all user permissions
 * 
 * @param userId User ID
 * @returns Array of permission objects
 */
export async function getUserPermissions(
  userId: string
): Promise<Permission[]> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { roleId: true },
    });

    if (!user?.roleId) {
      return [];
    }

    const permissions = new Map<string, Permission>();

    const rolePermissions = await prisma.rolePermission.findMany({
      where: { roleId: user.roleId },
      include: { permission: true },
    });

    rolePermissions.forEach((rp) => {
      permissions.set(rp.permission.id, {
        id: rp.permission.id,
        name: rp.permission.name,
        resource: rp.permission.resource,
        action: rp.permission.action,
        description: rp.permission.description || undefined,
      });
    });

    return Array.from(permissions.values());
  } catch (error) {
    console.error("[RBAC] Get user permissions error:", error);
    return [];
  }
}

/**
 * Get user roles
 * 
 * @param userId User ID
 * @returns Array of role IDs
 */
export async function getUserRoles(userId: string): Promise<string[]> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { roleId: true },
    });

    return user?.roleId ? [user.roleId] : [];
  } catch (error) {
    console.error("[RBAC] Get user roles error:", error);
    return [];
  }
}

/**
 * Verify permission by name (direct permission check)
 * 
 * @param userId User ID
 * @param permissionName Permission name (e.g., "user.create")
 * @returns true if user has permission
 */
export async function verifyPermissionByName(
  userId: string,
  permissionName: string
): Promise<boolean> {
  try {
    const permission = await prisma.permission.findFirst({
      where: {
        name: permissionName,
      },
    });

    if (!permission) {
      console.warn(`[RBAC] Permission not found: ${permissionName}`);
      return false;
    }

    const hasAccess = await prisma.user.findFirst({
      where: {
        id: userId,
        roleId: { not: null },
      },
      select: { roleId: true },
    });

    if (!hasAccess?.roleId) return false;

    const rolePermission = await prisma.rolePermission.findUnique({
      where: {
        roleId_permissionId: {
          roleId: hasAccess.roleId,
          permissionId: permission.id,
        },
      },
    });

    return !!rolePermission;
  } catch (error) {
    console.error("[RBAC] Verify permission by name error:", error);
    return false;
  }
}

/**
 * Format permission for logging/debugging
 * 
 * @param permission Permission object
 * @returns Formatted string
 */
export function formatPermission(permission: Permission): string {
  return `${permission.resource}:${permission.action}`;
}

/**
 * Get permission by resource and action
 * 
 * @param resource Resource name
 * @param action Action name
 * @returns Permission object or null
 */
export async function getPermission(
  resource: string,
  action: string
): Promise<Permission | null> {
  try {
    const permission = await prisma.permission.findFirst({
      where: {
        resource,
        action,
      },
    });

    return permission
      ? {
          id: permission.id,
          name: permission.name,
          resource: permission.resource,
          action: permission.action,
          description: permission.description || undefined,
        }
      : null;
  } catch (error) {
    console.error("[RBAC] Get permission error:", error);
    return null;
  }
}
