import { prisma } from "../config/prisma";
import { IRolePermissionRepository, IPermission } from "../interfaces/rbac.interface";

export class RolePermissionRepository implements IRolePermissionRepository {
  /**
   * Get all permissions for a specific role (AVOIDS N+1 by using single query)
   * @param roleId Role ID
   * @returns List of permissions assigned to the role
   */
  async findByRoleId(roleId: string): Promise<IPermission[]> {
    const rolePermissions = await prisma.rolePermission.findMany({
      where: { roleId },
      include: {
        permission: true,
      },
    });

    return rolePermissions.map((rp: any) => rp.permission);
  }

  /**
   * Check if a role has a specific permission
   * @param roleId Role ID
   * @param permissionId Permission ID
   * @returns true if role has permission, false otherwise
   */
  async checkPermission(roleId: string, permissionId: string): Promise<boolean> {
    const rolePermission = await prisma.rolePermission.findUnique({
      where: {
        roleId_permissionId: { roleId, permissionId },
      },
    });

    return rolePermission !== null;
  }

  /**
   * Add a single permission to a role
   * @param roleId Role ID
   * @param permissionId Permission ID
   */
  async add(roleId: string, permissionId: string): Promise<void> {
    await prisma.rolePermission.create({
      data: {
        roleId,
        permissionId,
      },
    });
  }

  /**
   * Remove a specific permission from a role
   * @param roleId Role ID
   * @param permissionId Permission ID
   */
  async remove(roleId: string, permissionId: string): Promise<void> {
    await prisma.rolePermission.delete({
      where: {
        roleId_permissionId: { roleId, permissionId },
      },
    });
  }

  /**
   * Remove all permissions from a role
   * @param roleId Role ID
   * @returns Number of permissions removed
   */
  async removeByRoleId(roleId: string): Promise<number> {
    const result = await prisma.rolePermission.deleteMany({
      where: { roleId },
    });

    return result.count;
  }

  /**
   * Assign multiple permissions to a role atomically (using transaction)
   * This replaces ALL existing permissions with the new set
   * @param roleId Role ID
   * @param permissionIds Permission IDs to assign
   */
  async addMultiple(roleId: string, permissionIds: string[]): Promise<void> {
    if (permissionIds.length === 0) {
      // If empty, just clear all permissions
      await this.removeByRoleId(roleId);
      return;
    }

    // Use transaction to ensure atomicity
    await prisma.$transaction(async (tx: any) => {
      // First, remove all existing permissions
      await tx.rolePermission.deleteMany({
        where: { roleId },
      });

      // Then, add new permissions
      await tx.rolePermission.createMany({
        data: permissionIds.map((permissionId) => ({
          roleId,
          permissionId,
        })),
        skipDuplicates: true,
      });
    });
  }
}
