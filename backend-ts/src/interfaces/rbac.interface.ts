// ============ ENTITY INTERFACES ============

export interface IRbacRole {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPermission {
  id: string;
  name: string;
  resource: string;
  action: string;
  description: string | null;
  createdAt: Date;
}

export interface IRolePermission {
  id: string;
  roleId: string;
  permissionId: string;
  createdAt: Date;
}

// ============ REPOSITORY INTERFACES ============

export interface IRbacRoleRepository {
  // Read operations
  findAll(): Promise<IRbacRole[]>;
  findById(roleId: string): Promise<IRbacRole | null>;
  findByName(name: string): Promise<IRbacRole | null>;
  findWithPermissions(roleId: string): Promise<any>;
  
  // Write operations
  create(data: { name: string; description?: string }): Promise<IRbacRole>;
  update(roleId: string, data: Partial<IRbacRole>): Promise<IRbacRole>;
  delete(roleId: string): Promise<void>;
  
  // Permission related
  addPermissions(roleId: string, permissionIds: string[]): Promise<void>;
  removeAllPermissions(roleId: string): Promise<void>;
}

export interface IPermissionRepository {
  // Read operations
  findAll(): Promise<IPermission[]>;
  findById(permissionId: string): Promise<IPermission | null>;
  findByName(name: string): Promise<IPermission | null>;
  findByResourceAction(resource: string, action: string): Promise<IPermission | null>;
  findByResource(resource: string): Promise<IPermission[]>;
  getAllResources(): Promise<string[]>;
  
  // Write operations
  create(data: {
    name: string;
    resource: string;
    action: string;
    description?: string;
  }): Promise<IPermission>;
  update(permissionId: string, data: Partial<IPermission>): Promise<IPermission>;
  delete(permissionId: string): Promise<void>;
  
  // Bulk operations
  createMany(permissions: Array<{
    name: string;
    resource: string;
    action: string;
    description?: string;
  }>): Promise<void>;
}

export interface IRolePermissionRepository {
  // Query operations
  findByRoleId(roleId: string): Promise<IPermission[]>;
  checkPermission(roleId: string, permissionId: string): Promise<boolean>;
  
  // Write operations
  add(roleId: string, permissionId: string): Promise<void>;
  remove(roleId: string, permissionId: string): Promise<void>;
  removeByRoleId(roleId: string): Promise<number>;
  
  // Bulk operations
  addMultiple(roleId: string, permissionIds: string[]): Promise<void>;
}

// ============ SERVICE INTERFACES ============

export interface IRbacRoleService {
  getAllRoles(): Promise<any[]>;
  getRoleById(roleId: string): Promise<any>;
  getRoleByName(name: string): Promise<any>;
  createRole(data: { name: string; description?: string }): Promise<any>;
  updateRole(roleId: string, data: Partial<{ name: string; description: string }>): Promise<any>;
  deleteRole(roleId: string): Promise<void>;
  assignPermissionsToRole(roleId: string, permissionIds: string[]): Promise<any>;
  roleHasPermission(roleId: string, resource: string, action: string): Promise<boolean>;
}

export interface IPermissionService {
  getAllPermissions(): Promise<IPermission[]>;
  getPermissionsByResource(resource: string): Promise<IPermission[]>;
  getPermissionById(permissionId: string): Promise<IPermission | null>;
  createPermission(data: {
    name: string;
    resource: string;
    action: string;
    description?: string;
  }): Promise<IPermission>;
  updatePermission(permissionId: string, data: Partial<IPermission>): Promise<IPermission>;
  deletePermission(permissionId: string): Promise<void>;
  seedDefaultPermissions(): Promise<void>;
  getAllResources(): Promise<string[]>;
}
