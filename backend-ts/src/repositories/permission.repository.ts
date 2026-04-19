import { prisma } from "../config/prisma";
import { IPermissionRepository, IPermission } from "../interfaces/rbac.interface";

export class PermissionRepository implements IPermissionRepository {
  /**
   * Fetch all permissions
   * @returns List of all permissions
   */
  async findAll(): Promise<IPermission[]> {
    return prisma.permission.findMany({
      orderBy: [{ resource: "asc" }, { action: "asc" }],
    });
  }

  /**
   * Fetch permission by ID
   * @param permissionId Permission ID
   * @returns Permission or null
   */
  async findById(permissionId: string): Promise<IPermission | null> {
    return prisma.permission.findUnique({
      where: { id: permissionId },
    });
  }

  /**
   * Fetch permission by name
   * @param name Permission name
   * @returns Permission or null
   */
  async findByName(name: string): Promise<IPermission | null> {
    return prisma.permission.findUnique({
      where: { name },
    });
  }

  /**
   * Fetch permission by resource + action combination
   * @param resource Resource name
   * @param action Action name
   * @returns Permission or null
   */
  async findByResourceAction(
    resource: string,
    action: string
  ): Promise<IPermission | null> {
    return prisma.permission.findUnique({
      where: {
        resource_action: { resource, action },
      },
    });
  }

  /**
   * Fetch all permissions for a specific resource
   * @param resource Resource name
   * @returns List of permissions for the resource
   */
  async findByResource(resource: string): Promise<IPermission[]> {
    return prisma.permission.findMany({
      where: { resource },
      orderBy: { action: "asc" },
    });
  }

  /**
   * Get all unique resources in the system
   * @returns List of resource names
   */
  async getAllResources(): Promise<string[]> {
    const permissions = await prisma.permission.findMany({
      select: { resource: true },
      distinct: ["resource"],
    });
    return permissions.map((p: { resource: string }) => p.resource);
  }

  /**
   * Create new permission
   * @param data Permission creation data
   * @returns Created permission
   */
  async create(data: {
    name: string;
    resource: string;
    action: string;
    description?: string;
  }): Promise<IPermission> {
    return prisma.permission.create({
      data: {
        name: data.name.trim(),
        resource: data.resource.trim().toLowerCase(),
        action: data.action.trim().toLowerCase(),
        description: data.description?.trim(),
      },
    });
  }

  /**
   * Update permission by ID
   * @param permissionId Permission ID
   * @param data Partial permission data
   * @returns Updated permission
   */
  async update(
    permissionId: string,
    data: Partial<IPermission>
  ): Promise<IPermission> {
    return prisma.permission.update({
      where: { id: permissionId },
      data: {
        name: data.name?.trim(),
        resource: data.resource?.trim().toLowerCase(),
        action: data.action?.trim().toLowerCase(),
        description: data.description?.trim(),
      },
    });
  }

  /**
   * Delete permission by ID
   * @param permissionId Permission ID
   */
  async delete(permissionId: string): Promise<void> {
    await prisma.permission.delete({
      where: { id: permissionId },
    });
  }

  /**
   * Create multiple permissions in bulk
   * @param permissions Array of permission data
   */
  async createMany(
    permissions: Array<{
      name: string;
      resource: string;
      action: string;
      description?: string;
    }>
  ): Promise<void> {
    if (permissions.length === 0) return;

    await prisma.permission.createMany({
      data: permissions.map((perm) => ({
        name: perm.name.trim(),
        resource: perm.resource.trim().toLowerCase(),
        action: perm.action.trim().toLowerCase(),
        description: perm.description?.trim(),
      })),
      skipDuplicates: true,
    });
  }
}
