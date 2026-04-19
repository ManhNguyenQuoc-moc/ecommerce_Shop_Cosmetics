/**
 * RBAC Frontend DTOs (Data Transfer Objects)
 * Ensures type-safe API communication between frontend and backend
 */

// ============ INPUT DTOs (Request Payloads) ============

export class CreateRoleDto {
  name!: string;
  description?: string;
}

export class UpdateRoleDto {
  name?: string;
  description?: string;
}

export class AssignPermissionsDto {
  permissionIds!: string[];
}

export class CreatePermissionDto {
  name!: string;
  resource!: string;
  action!: string;
  description?: string;
}

// ============ OUTPUT DTOs (Response Models) ============

export class PermissionDto {
  id!: string;
  name!: string;
  resource!: string;
  action!: string;
  description?: string;
  createdAt!: Date;
}

export class RolePermissionDto {
  id!: string;
  permissionId!: string;
  permission!: PermissionDto;
}

export class RoleDto {
  id!: string;
  name!: string;
  description?: string;
  createdAt!: Date;
  updatedAt!: Date;
  permissions?: PermissionDto[];
  rolePermissions?: RolePermissionDto[];
}

export class RoleListResponseDto {
  roles!: RoleDto[];
  totalCount!: number;
}

export class PermissionListResponseDto {
  permissions!: PermissionDto[];
  totalCount!: number;
}

// ============ API Response Wrappers ============

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  statusCode?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

// ============ Types for Form State ============

export type RoleFormData = {
  name: string;
  description?: string;
};

export type PermissionFilterParams = {
  resource?: string;
  search?: string;
};
