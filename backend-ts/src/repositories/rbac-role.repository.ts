import { prisma } from "../config/prisma";
import { IRbacRoleRepository, IRbacRole } from "../interfaces/rbac.interface";

export class RbacRoleRepository implements IRbacRoleRepository {
  /**
   * Fetch all roles without permissions
   * @returns List of all roles
   */
  async findAll(): Promise<IRbacRole[]> {
    return prisma.rbacRole.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Fetch single role by ID without permissions
   * @param roleId Role ID
   * @returns Role or null
   */
  async findById(roleId: string): Promise<IRbacRole | null> {
    return prisma.rbacRole.findUnique({
      where: { id: roleId },
    });
  }

  /**
   * Fetch role by name
   * @param name Role name
   * @returns Role or null
   */
  async findByName(name: string): Promise<IRbacRole | null> {
    return prisma.rbacRole.findUnique({
      where: { name },
    });
  }

  /**
   * Fetch role with all related permissions (HEAVY QUERY - use cautiously)
   * @param roleId Role ID
   * @returns Role with permissions or null
   */
  async findWithPermissions(roleId: string): Promise<any> {
    return prisma.rbacRole.findUnique({
      where: { id: roleId },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });
  }

  /**
   * Create new role
   * @param data Role creation data
   * @returns Created role
   */
  async create(data: { name: string; description?: string }): Promise<IRbacRole> {
    return prisma.rbacRole.create({
      data: {
        name: data.name.trim(),
        description: data.description?.trim(),
      },
    });
  }

  /**
   * Update role by ID
   * @param roleId Role ID
   * @param data Partial role data to update
   * @returns Updated role
   */
  async update(roleId: string, data: Partial<IRbacRole>): Promise<IRbacRole> {
    return prisma.rbacRole.update({
      where: { id: roleId },
      data: {
        name: data.name?.trim(),
        description: data.description?.trim(),
      },
    });
  }

  /**
   * Delete role by ID (cascades to RolePermission records)
   * @param roleId Role ID
   */
  async delete(roleId: string): Promise<void> {
    await prisma.rbacRole.delete({
      where: { id: roleId },
    });
  }

  /**
   * Add multiple permissions to a role in bulk
   * @param roleId Role ID
   * @param permissionIds Permission IDs to add
   */
  async addPermissions(roleId: string, permissionIds: string[]): Promise<void> {
    if (permissionIds.length === 0) return;

    await prisma.rolePermission.createMany({
      data: permissionIds.map((permissionId) => ({
        roleId,
        permissionId,
      })),
      skipDuplicates: true,
    });
  }

  /**
   * Remove all permissions from a role
   * @param roleId Role ID
   */
  async removeAllPermissions(roleId: string): Promise<void> {
    await prisma.rolePermission.deleteMany({
      where: { roleId },
    });
  }
}
