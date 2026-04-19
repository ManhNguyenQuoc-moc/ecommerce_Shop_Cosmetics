// ============ INPUT DTOs ============

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

export class UpdatePermissionDto {
  name?: string;
  resource?: string;
  action?: string;
  description?: string;
}

// ============ OUTPUT DTOs (Response) ============

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
  rolePermissions?: RolePermissionDto[];
}

export class PermissionDto {
  id!: string;
  name!: string;
  resource!: string;
  action!: string;
  description?: string;
  createdAt!: Date;
}

export class RoleWithPermissionsDto {
  id!: string;
  name!: string;
  description?: string;
  permissions!: PermissionDto[];
  createdAt!: Date;
  updatedAt!: Date;
}

// ============ API Response Wrappers ============

export class CreateRoleResponseDto extends RoleDto {}

export class UpdateRoleResponseDto extends RoleDto {}

export class AssignPermissionsResponseDto {
  roleId!: string;
  assignedPermissionIds!: string[];
  message!: string;
}
