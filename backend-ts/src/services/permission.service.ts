import { PermissionRepository } from "../repositories/permission.repository";
import { IPermissionService, IPermission } from "../interfaces/rbac.interface";

export class PermissionService implements IPermissionService {
  private permissionRepository = new PermissionRepository();

  /**
   * Get all permissions
   * @returns List of all permissions
   */
  async getAllPermissions(): Promise<IPermission[]> {
    return this.permissionRepository.findAll();
  }

  /**
   * Get permissions by resource
   * @param resource Resource name
   * @returns List of permissions for the resource
   */
  async getPermissionsByResource(resource: string): Promise<IPermission[]> {
    return this.permissionRepository.findByResource(resource);
  }

  /**
   * Get permission by ID
   * @param permissionId Permission ID
   * @returns Permission or null
   */
  async getPermissionById(permissionId: string): Promise<IPermission | null> {
    return this.permissionRepository.findById(permissionId);
  }

  /**
   * Create new permission
   * Validates that permission name and resource:action combination are unique
   * @param data Permission creation data
   * @returns Created permission
   * @throws Error if permission already exists
   */
  async createPermission(data: {
    name: string;
    resource: string;
    action: string;
    description?: string;
  }): Promise<IPermission> {
    // Validate name uniqueness
    const existingByName = await this.permissionRepository.findByName(data.name);
    if (existingByName) {
      throw new Error(`Permission with name "${data.name}" already exists`);
    }

    // Validate resource:action uniqueness
    const existingByResourceAction = await this.permissionRepository.findByResourceAction(
      data.resource,
      data.action
    );
    if (existingByResourceAction) {
      throw new Error(
        `Permission for resource "${data.resource}" and action "${data.action}" already exists`
      );
    }

    return this.permissionRepository.create(data);
  }

  /**
   * Update permission
   * @param permissionId Permission ID
   * @param data Partial permission data to update
   * @returns Updated permission
   * @throws Error if permission not found or unique constraints violated
   */
  async updatePermission(
    permissionId: string,
    data: Partial<IPermission>
  ): Promise<IPermission> {
    // Verify permission exists
    const permission = await this.permissionRepository.findById(permissionId);
    if (!permission) {
      throw new Error(`Permission with ID "${permissionId}" not found`);
    }

    // If updating name, check uniqueness
    if (data.name && data.name !== permission.name) {
      const existingByName = await this.permissionRepository.findByName(data.name);
      if (existingByName) {
        throw new Error(`Permission with name "${data.name}" already exists`);
      }
    }

    // If updating resource:action, check uniqueness
    if (
      (data.resource && data.resource !== permission.resource) ||
      (data.action && data.action !== permission.action)
    ) {
      const newResource = data.resource || permission.resource;
      const newAction = data.action || permission.action;

      const existingByResourceAction =
        await this.permissionRepository.findByResourceAction(newResource, newAction);
      if (existingByResourceAction) {
        throw new Error(
          `Permission for resource "${newResource}" and action "${newAction}" already exists`
        );
      }
    }

    return this.permissionRepository.update(permissionId, data);
  }

  /**
   * Delete permission
   * @param permissionId Permission ID
   * @throws Error if permission not found
   */
  async deletePermission(permissionId: string): Promise<void> {
    // Verify permission exists
    const permission = await this.permissionRepository.findById(permissionId);
    if (!permission) {
      throw new Error(`Permission with ID "${permissionId}" not found`);
    }

    await this.permissionRepository.delete(permissionId);
  }

  /**
   * Seed default system permissions
   * Creates comprehensive permissions for all real resources and their actions
   * Based on actual controllers and use cases in the system
   * Uses upsert strategy to avoid duplicates if run multiple times
   */
  async seedDefaultPermissions(): Promise<void> {
    // Real permissions based on system resources and actions
    const defaultPermissions = [
      // ===== USER PERMISSIONS =====
      { name: "user:create", resource: "user", action: "create", description: "Create new user" },
      { name: "user:read", resource: "user", action: "read", description: "View user details" },
      { name: "user:update", resource: "user", action: "update", description: "Update user information" },
      { name: "user:delete", resource: "user", action: "delete", description: "Delete user account" },
      { name: "user:list", resource: "user", action: "list", description: "List all users" },
      { name: "user:ban", resource: "user", action: "ban", description: "Ban/unban users" },
      { name: "user:updateStatus", resource: "user", action: "updateStatus", description: "Update user status" },
      { name: "user:updateRole", resource: "user", action: "updateRole", description: "Assign roles to users" },
      { name: "user:toggleWallet", resource: "user", action: "toggleWallet", description: "Lock/unlock user wallet" },

      // ===== PRODUCT PERMISSIONS =====
      { name: "product:create", resource: "product", action: "create", description: "Create new product" },
      { name: "product:read", resource: "product", action: "read", description: "View product details" },
      { name: "product:update", resource: "product", action: "update", description: "Update product information" },
      { name: "product:delete", resource: "product", action: "delete", description: "Delete product permanently" },
      { name: "product:list", resource: "product", action: "list", description: "List all products" },
      { name: "product:softDelete", resource: "product", action: "softDelete", description: "Soft delete products (archive)" },
      { name: "product:restore", resource: "product", action: "restore", description: "Restore deleted products" },

      // ===== VARIANT PERMISSIONS =====
      { name: "variant:create", resource: "variant", action: "create", description: "Create product variant" },
      { name: "variant:read", resource: "variant", action: "read", description: "View variant details" },
      { name: "variant:update", resource: "variant", action: "update", description: "Update variant information" },
      { name: "variant:delete", resource: "variant", action: "delete", description: "Delete variant permanently" },
      { name: "variant:list", resource: "variant", action: "list", description: "List all variants" },
      { name: "variant:softDelete", resource: "variant", action: "softDelete", description: "Soft delete variants" },
      { name: "variant:restore", resource: "variant", action: "restore", description: "Restore deleted variants" },

      // ===== CATEGORY PERMISSIONS =====
      { name: "category:create", resource: "category", action: "create", description: "Create new category" },
      { name: "category:read", resource: "category", action: "read", description: "View category" },
      { name: "category:update", resource: "category", action: "update", description: "Update category" },
      { name: "category:delete", resource: "category", action: "delete", description: "Delete category" },
      { name: "category:list", resource: "category", action: "list", description: "List all categories" },

      // ===== CATEGORY GROUP PERMISSIONS =====
      { name: "categoryGroup:create", resource: "categoryGroup", action: "create", description: "Create category group" },
      { name: "categoryGroup:read", resource: "categoryGroup", action: "read", description: "View category group" },
      { name: "categoryGroup:update", resource: "categoryGroup", action: "update", description: "Update category group" },
      { name: "categoryGroup:delete", resource: "categoryGroup", action: "delete", description: "Delete category group" },
      { name: "categoryGroup:list", resource: "categoryGroup", action: "list", description: "List all category groups" },

      // ===== BRAND PERMISSIONS =====
      { name: "brand:create", resource: "brand", action: "create", description: "Create new brand" },
      { name: "brand:read", resource: "brand", action: "read", description: "View brand details" },
      { name: "brand:update", resource: "brand", action: "update", description: "Update brand information" },
      { name: "brand:delete", resource: "brand", action: "delete", description: "Delete brand" },
      { name: "brand:list", resource: "brand", action: "list", description: "List all brands" },

      // ===== ORDER PERMISSIONS =====
      { name: "order:create", resource: "order", action: "create", description: "Create new order" },
      { name: "order:read", resource: "order", action: "read", description: "View order details" },
      { name: "order:update", resource: "order", action: "update", description: "Update order" },
      { name: "order:delete", resource: "order", action: "delete", description: "Delete order" },
      { name: "order:list", resource: "order", action: "list", description: "List all orders" },
      { name: "order:cancel", resource: "order", action: "cancel", description: "Cancel order" },

      // ===== REVIEW PERMISSIONS =====
      { name: "review:create", resource: "review", action: "create", description: "Create new review" },
      { name: "review:read", resource: "review", action: "read", description: "View review" },
      { name: "review:update", resource: "review", action: "update", description: "Update review" },
      { name: "review:delete", resource: "review", action: "delete", description: "Delete review" },
      { name: "review:list", resource: "review", action: "list", description: "List all reviews" },

      // ===== QUESTION PERMISSIONS =====
      { name: "question:create", resource: "question", action: "create", description: "Create new question" },
      { name: "question:read", resource: "question", action: "read", description: "View question" },
      { name: "question:update", resource: "question", action: "update", description: "Update question" },
      { name: "question:delete", resource: "question", action: "delete", description: "Delete question" },
      { name: "question:list", resource: "question", action: "list", description: "List all questions" },
      { name: "question:answer", resource: "question", action: "answer", description: "Answer question" },

      // ===== INVENTORY PERMISSIONS =====
      { name: "inventory:receiveStock", resource: "inventory", action: "receiveStock", description: "Receive stock" },
      { name: "inventory:viewBatches", resource: "inventory", action: "viewBatches", description: "View stock batches" },
      { name: "inventory:viewTransactions", resource: "inventory", action: "viewTransactions", description: "View inventory transactions" },
      { name: "inventory:importExcel", resource: "inventory", action: "importExcel", description: "Import inventory from Excel" },

      // ===== PURCHASE ORDER PERMISSIONS =====
      { name: "purchase:viewPOs", resource: "purchase", action: "viewPOs", description: "View purchase orders" },
      { name: "purchase:createPO", resource: "purchase", action: "createPO", description: "Create purchase order" },
      { name: "purchase:updatePO", resource: "purchase", action: "updatePO", description: "Update purchase order" },
      { name: "purchase:confirmPO", resource: "purchase", action: "confirmPO", description: "Confirm purchase order" },
      { name: "purchase:cancelPO", resource: "purchase", action: "cancelPO", description: "Cancel purchase order" },
      { name: "purchase:receiveStock", resource: "purchase", action: "receiveStock", description: "Receive stock from PO" },

      // ===== DASHBOARD PERMISSIONS =====
      { name: "dashboard:view", resource: "dashboard", action: "view", description: "View dashboard" },
      { name: "dashboard:statistics", resource: "dashboard", action: "statistics", description: "View statistics" },
      { name: "dashboard:reports", resource: "dashboard", action: "reports", description: "Generate reports" },

      // ===== VOUCHER PERMISSIONS =====
      { name: "voucher:create", resource: "voucher", action: "create", description: "Create voucher/discount code" },
      { name: "voucher:read", resource: "voucher", action: "read", description: "View voucher details" },
      { name: "voucher:update", resource: "voucher", action: "update", description: "Update voucher" },
      { name: "voucher:delete", resource: "voucher", action: "delete", description: "Delete voucher" },
      { name: "voucher:list", resource: "voucher", action: "list", description: "List all vouchers" },

      // ===== SETTING PERMISSIONS =====
      { name: "setting:read", resource: "setting", action: "read", description: "View system settings" },
      { name: "setting:update", resource: "setting", action: "update", description: "Update system settings" },

      // ===== ROLE PERMISSIONS =====
      { name: "role:create", resource: "role", action: "create", description: "Create new role" },
      { name: "role:read", resource: "role", action: "read", description: "View role details" },
      { name: "role:update", resource: "role", action: "update", description: "Update role" },
      { name: "role:delete", resource: "role", action: "delete", description: "Delete role" },
      { name: "role:list", resource: "role", action: "list", description: "List all roles" },
      { name: "role:manage", resource: "role", action: "manage", description: "Manage roles" },

      // ===== PERMISSION PERMISSIONS =====
      { name: "permission:create", resource: "permission", action: "create", description: "Create new permission" },
      { name: "permission:read", resource: "permission", action: "read", description: "View permission details" },
      { name: "permission:list", resource: "permission", action: "list", description: "List all permissions" },
      { name: "permission:manage", resource: "permission", action: "manage", description: "Manage permissions" },

      // ===== RBAC ADMIN PERMISSIONS =====
      { name: "rbac:manage", resource: "rbac", action: "manage", description: "Manage RBAC (roles and permissions)" },
    ];

    // Create all permissions in bulk (skips duplicates)
    await this.permissionRepository.createMany(defaultPermissions);

    console.log(
      `✅ Seeded ${defaultPermissions.length} permissions (skipped duplicates)`
    );
  }

  /**
   * Get all unique resources in the system
   * @returns List of resource names
   */
  async getAllResources(): Promise<string[]> {
    return this.permissionRepository.getAllResources();
  }
}
