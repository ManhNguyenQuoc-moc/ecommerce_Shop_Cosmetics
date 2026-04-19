/**
 * Repository Pattern - Central export point
 * Purpose: Centralize repository imports to reduce circular dependencies
 */

export { RbacRoleRepository } from "./rbac-role.repository";
export { PermissionRepository } from "./permission.repository";
export { RolePermissionRepository } from "./role-permission.repository";

export type { IRbacRoleRepository, IPermissionRepository, IRolePermissionRepository } from "../interfaces/rbac.interface";
