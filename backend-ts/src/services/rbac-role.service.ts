import { RbacRoleRepository } from "../repositories/rbac-role.repository";
import { RolePermissionRepository } from "../repositories/role-permission.repository";
import { IRbacRoleService, IPermission } from "../interfaces/rbac.interface";
import { prisma } from "../config/prisma";

export class RbacRoleService implements IRbacRoleService {
  private roleRepository = new RbacRoleRepository();
  private rolePermissionRepository = new RolePermissionRepository();

  /**
   * Get all roles with their assigned permissions
   * @returns List of roles with permissions
   */
  async getAllRoles(): Promise<any[]> {
    const roles = await this.roleRepository.findAll();

    // Load permissions for each role (could be optimized with batch query if needed)
    return Promise.all(
      roles.map(async (role: any) => {
        const permissions = await this.rolePermissionRepository.findByRoleId(
          role.id
        );
        return {
          ...role,
          permissions,
        };
      })
    );
  }

  /**
   * Get a single role with its permissions
   * @param roleId Role ID
   * @returns Role with permissions or null
   */
  async getRoleById(roleId: string): Promise<any> {
    const role = await this.roleRepository.findById(roleId);
    if (!role) return null;

    const permissions = await this.rolePermissionRepository.findByRoleId(roleId);

    return {
      ...role,
      permissions,
    };
  }

  /**
   * Get role by name
   * @param name Role name
   * @returns Role or null
   */
  async getRoleByName(name: string): Promise<any> {
    const role = await this.roleRepository.findByName(name);
    if (!role) return null;

    const permissions = await this.rolePermissionRepository.findByRoleId(role.id);

    return {
      ...role,
      permissions,
    };
  }

  /**
   * Create new role
   * Validates that role name is unique
   * @param data Role creation data
   * @returns Created role
   * @throws Error if role name already exists
   */
  async createRole(data: {
    name: string;
    description?: string;
  }): Promise<any> {
    // Validate role name uniqueness
    const existingRole = await this.roleRepository.findByName(data.name);
    if (existingRole) {
      throw new Error(`Role with name "${data.name}" already exists`);
    }

    const role = await this.roleRepository.create(data);

    return {
      ...role,
      permissions: [],
    };
  }

  /**
   * Update role
   * @param roleId Role ID
   * @param data Partial role data to update
   * @returns Updated role with permissions
   * @throws Error if role not found or name already exists
   */
  async updateRole(
    roleId: string,
    data: Partial<{ name: string; description: string }>
  ): Promise<any> {
    // Verify role exists
    const role = await this.roleRepository.findById(roleId);
    if (!role) {
      throw new Error(`Role with ID "${roleId}" not found`);
    }

    // If updating name, check uniqueness
    if (data.name && data.name !== role.name) {
      const existingRole = await this.roleRepository.findByName(data.name);
      if (existingRole) {
        throw new Error(`Role with name "${data.name}" already exists`);
      }
    }

    const updatedRole = await this.roleRepository.update(roleId, data);
    const permissions = await this.rolePermissionRepository.findByRoleId(roleId);

    return {
      ...updatedRole,
      permissions,
    };
  }

  /**
   * Delete role
   * Note: Cascade delete of RolePermission is handled by database constraints
   * @param roleId Role ID
   * @throws Error if role not found
   */
  async deleteRole(roleId: string): Promise<void> {
    // Verify role exists
    const role = await this.roleRepository.findById(roleId);
    if (!role) {
      throw new Error(`Role with ID "${roleId}" not found`);
    }

    const assignedUserCount = await prisma.user.count({
      where: { roleId },
    });

    if (assignedUserCount > 0) {
      throw new Error(
        `Role đang được gán cho ${assignedUserCount} người dùng. Hãy chuyển người dùng sang role khác trước khi xóa.`
      );
    }

    await this.roleRepository.delete(roleId);
  }

  /**
   * Assign permissions to a role (atomically replaces existing permissions)
   * Uses transaction to ensure atomicity
   * @param roleId Role ID
   * @param permissionIds Permission IDs to assign
   * @returns Updated role with new permissions
   * @throws Error if role or any permission not found
   */
  async assignPermissionsToRole(
    roleId: string,
    permissionIds: string[]
  ): Promise<any> {
    // Verify role exists
    const role = await this.roleRepository.findById(roleId);
    if (!role) {
      throw new Error(`Role with ID "${roleId}" not found`);
    }

    // Verify all permissions exist (batch query to avoid N+1)
    if (permissionIds.length > 0) {
      const permissions = await prisma.permission.findMany({
        where: {
          id: {
            in: permissionIds,
          },
        },
        select: { id: true },
      });

      if (permissions.length !== permissionIds.length) {
        throw new Error("One or more permissions do not exist");
      }
    }

    // Assign permissions atomically
    await this.rolePermissionRepository.addMultiple(roleId, permissionIds);

    // Fetch updated permissions
    const permissions = await this.rolePermissionRepository.findByRoleId(roleId);

    return {
      ...role,
      permissions,
    };
  }

  /**
   * Check if a role has a specific permission
   * @param roleId Role ID
   * @param resource Permission resource
   * @param action Permission action
   * @returns true if role has permission, false otherwise
   */
  async roleHasPermission(
    roleId: string,
    resource: string,
    action: string
  ): Promise<boolean> {
    // Get all permissions for the role
    const permissions = await this.rolePermissionRepository.findByRoleId(roleId);

    // Check if any permission matches the resource:action
    return permissions.some(
      (p: IPermission) =>
        p.resource.toLowerCase() === resource.toLowerCase() &&
        p.action.toLowerCase() === action.toLowerCase()
    );
  }
}
