import { Request, Response } from "express";
import { RbacRoleService } from "../services/rbac-role.service";
import { PermissionService } from "../services/permission.service";
import {
  CreateRoleDto,
  UpdateRoleDto,
  AssignPermissionsDto,
  CreatePermissionDto,
  UpdatePermissionDto,
} from "../DTO/rbac.dto";
import { BaseResultDto } from "../DTO/base-result.dto";

/**
 * RbacController - Thin HTTP controller for RBAC endpoints
 * Responsibility: HTTP request/response handling only (no business logic)
 * - Validate DTOs
 * - Call services
 * - Format responses
 * - Handle HTTP errors
 */
export class RbacController {
  private roleService = new RbacRoleService();
  private permissionService = new PermissionService();

  // ============ ROLE ENDPOINTS ============

  /**
   * GET /api/admin/rbac/roles
   * Retrieve all roles with their assigned permissions
   */
  async getAllRoles(req: Request, res: Response): Promise<void> {
    try {
      const roles = await this.roleService.getAllRoles();
      res.json(new BaseResultDto({ data: roles }));
    } catch (error: any) {
      console.error("[RbacController] Error fetching roles:", error.message);
      res.status(500).json(
        new BaseResultDto({
          error: error.message || "Failed to fetch roles",
        })
      );
    }
  }

  /**
   * GET /api/admin/rbac/roles/:roleId
   * Retrieve a single role by ID with permissions
   */
  async getRoleById(req: Request, res: Response): Promise<void> {
    try {
      const roleId = req.params.roleId as string;

      if (!roleId || (typeof roleId === "string" && roleId.trim() === "")) {
        res.status(400).json(
          new BaseResultDto({ error: "Role ID is required" })
        );
        return;
      }

      const role = await this.roleService.getRoleById(roleId);
      if (!role) {
        res.status(404).json(
          new BaseResultDto({ error: "Role not found" })
        );
        return;
      }

      res.json(new BaseResultDto({ data: role }));
    } catch (error: any) {
      console.error("[RbacController] Error fetching role:", error.message);
      res.status(500).json(
        new BaseResultDto({
          error: error.message || "Failed to fetch role",
        })
      );
    }
  }

  /**
   * POST /api/admin/rbac/roles
   * Create a new role
   * Body: { name: string, description?: string }
   */
  async createRole(req: Request, res: Response): Promise<void> {
    try {
      const dto = new CreateRoleDto();
      dto.name = req.body.name;
      dto.description = req.body.description;

      // Validate DTO
      if (!dto.name || dto.name.trim() === "") {
        res.status(400).json(
          new BaseResultDto({ error: "Role name is required and cannot be empty" })
        );
        return;
      }

      if (dto.name.trim().length < 2) {
        res.status(400).json(
          new BaseResultDto({ error: "Role name must be at least 2 characters" })
        );
        return;
      }

      if (dto.description && dto.description.trim().length < 3) {
        res.status(400).json(
          new BaseResultDto({ error: "Description must be at least 3 characters" })
        );
        return;
      }

      const role = await this.roleService.createRole({
        name: dto.name.trim(),
        description: dto.description?.trim(),
      });

      res.status(201).json(new BaseResultDto({ data: role }));
    } catch (error: any) {
      console.error("[RbacController] Error creating role:", error.message);

      if (error.message.includes("already exists")) {
        res.status(409).json(new BaseResultDto({ error: error.message }));
      } else {
        res.status(500).json(
          new BaseResultDto({
            error: error.message || "Failed to create role",
          })
        );
      }
    }
  }

  /**
   * PUT /api/admin/rbac/roles/:roleId
   * Update a role
   * Body: { name?: string, description?: string }
   */
  async updateRole(req: Request, res: Response): Promise<void> {
    try {
      const roleId = req.params.roleId as string;

      if (!roleId || (typeof roleId === "string" && roleId.trim() === "")) {
        res.status(400).json(
          new BaseResultDto({ error: "Role ID is required" })
        );
        return;
      }

      const dto = new UpdateRoleDto();
      dto.name = req.body.name;
      dto.description = req.body.description;

      // Validate DTO
      if (dto.name && dto.name.trim().length < 2) {
        res.status(400).json(
          new BaseResultDto({ error: "Role name must be at least 2 characters" })
        );
        return;
      }

      if (dto.description && dto.description.trim().length < 3) {
        res.status(400).json(
          new BaseResultDto({ error: "Description must be at least 3 characters" })
        );
        return;
      }

      const role = await this.roleService.updateRole(roleId, {
        name: dto.name?.trim(),
        description: dto.description?.trim(),
      });

      res.json(new BaseResultDto({ data: role }));
    } catch (error: any) {
      console.error("[RbacController] Error updating role:", error.message);

      if (error.message.includes("not found")) {
        res.status(404).json(new BaseResultDto({ error: error.message }));
      } else if (error.message.includes("already exists")) {
        res.status(409).json(new BaseResultDto({ error: error.message }));
      } else {
        res.status(500).json(
          new BaseResultDto({
            error: error.message || "Failed to update role",
          })
        );
      }
    }
  }

  /**
   * DELETE /api/admin/rbac/roles/:roleId
   * Delete a role
   */
  async deleteRole(req: Request, res: Response): Promise<void> {
    try {
      const roleId = req.params.roleId as string;

      if (!roleId || (typeof roleId === "string" && roleId.trim() === "")) {
        res.status(400).json(
          new BaseResultDto({ error: "Role ID is required" })
        );
        return;
      }

      await this.roleService.deleteRole(roleId);

      res.json(
        new BaseResultDto({
          data: { message: "Role deleted successfully", roleId },
        })
      );
    } catch (error: any) {
      console.error("[RbacController] Error deleting role:", error.message);

      if (error.message.includes("not found")) {
        res.status(404).json(new BaseResultDto({ error: error.message }));
      } else if (error.message.includes("đang được gán") || error.message.includes("assigned")) {
        res.status(400).json(new BaseResultDto({ error: error.message }));
      } else {
        res.status(500).json(
          new BaseResultDto({
            error: error.message || "Failed to delete role",
          })
        );
      }
    }
  }

  /**
   * POST /api/admin/rbac/roles/:roleId/permissions
   * Assign permissions to a role (replaces existing permissions)
   * Body: { permissionIds: string[] }
   */
  async assignPermissions(req: Request, res: Response): Promise<void> {
    try {
      const roleId = req.params.roleId as string;

      if (!roleId || (typeof roleId === "string" && roleId.trim() === "")) {
        res.status(400).json(
          new BaseResultDto({ error: "Role ID is required" })
        );
        return;
      }

      const dto = new AssignPermissionsDto();
      dto.permissionIds = req.body.permissionIds || [];

      // Validate DTO
      if (!Array.isArray(dto.permissionIds)) {
        res.status(400).json(
          new BaseResultDto({
            error: "permissionIds must be an array",
          })
        );
        return;
      }

      if (
        !dto.permissionIds.every(
          (id: any) => typeof id === "string" && id.trim() !== ""
        )
      ) {
        res.status(400).json(
          new BaseResultDto({
            error: "All permission IDs must be non-empty strings",
          })
        );
        return;
      }

      const role = await this.roleService.assignPermissionsToRole(
        roleId,
        dto.permissionIds
      );

      res.json(
        new BaseResultDto({
          data: role,
          message: `Assigned ${dto.permissionIds.length} permissions to role`,
        })
      );
    } catch (error: any) {
      console.error("[RbacController] Error assigning permissions:", error.message);

      if (error.message.includes("not found")) {
        res.status(404).json(new BaseResultDto({ error: error.message }));
      } else {
        res.status(500).json(
          new BaseResultDto({
            error: error.message || "Failed to assign permissions",
          })
        );
      }
    }
  }

  // ============ PERMISSION ENDPOINTS ============

  /**
   * GET /api/admin/rbac/permissions
   * Retrieve all permissions
   */
  async getAllPermissions(req: Request, res: Response): Promise<void> {
    try {
      const permissions = await this.permissionService.getAllPermissions();
      res.json(new BaseResultDto({ data: permissions }));
    } catch (error: any) {
      console.error("[RbacController] Error fetching permissions:", error.message);
      res.status(500).json(
        new BaseResultDto({
          error: error.message || "Failed to fetch permissions",
        })
      );
    }
  }

  /**
   * GET /api/admin/rbac/permissions?resource=user
   * Retrieve permissions by resource
   * Query param: resource (required)
   */
  async getPermissionsByResource(req: Request, res: Response): Promise<void> {
    try {
      const resource = req.query.resource as string;

      if (!resource || resource.trim() === "") {
        res.status(400).json(
          new BaseResultDto({ error: "Resource query parameter is required" })
        );
        return;
      }

      const permissions = await this.permissionService.getPermissionsByResource(
        resource
      );
      res.json(new BaseResultDto({ data: permissions }));
    } catch (error: any) {
      console.error("[RbacController] Error fetching permissions:", error.message);
      res.status(500).json(
        new BaseResultDto({
          error: error.message || "Failed to fetch permissions",
        })
      );
    }
  }

  /**
   * POST /api/admin/rbac/permissions
   * Create a new permission
   * Body: { name: string, resource: string, action: string, description?: string }
   */
  async createPermission(req: Request, res: Response): Promise<void> {
    try {
      const dto = new CreatePermissionDto();
      dto.name = req.body.name;
      dto.resource = req.body.resource;
      dto.action = req.body.action;
      dto.description = req.body.description;

      // Validate DTO
      if (!dto.name || dto.name.trim() === "") {
        res.status(400).json(
          new BaseResultDto({ error: "Permission name is required" })
        );
        return;
      }

      if (!dto.resource || dto.resource.trim() === "") {
        res.status(400).json(
          new BaseResultDto({ error: "Resource is required" })
        );
        return;
      }

      if (!dto.action || dto.action.trim() === "") {
        res.status(400).json(
          new BaseResultDto({ error: "Action is required" })
        );
        return;
      }

      const permission = await this.permissionService.createPermission({
        name: dto.name.trim(),
        resource: dto.resource.trim().toLowerCase(),
        action: dto.action.trim().toLowerCase(),
        description: dto.description?.trim(),
      });

      res.status(201).json(new BaseResultDto({ data: permission }));
    } catch (error: any) {
      console.error("[RbacController] Error creating permission:", error.message);

      if (error.message.includes("already exists")) {
        res.status(409).json(new BaseResultDto({ error: error.message }));
      } else {
        res.status(500).json(
          new BaseResultDto({
            error: error.message || "Failed to create permission",
          })
        );
      }
    }
  }

  /**
   * GET /api/admin/rbac/resources
   * Retrieve all unique resources in the system
   */
  async getAllResources(req: Request, res: Response): Promise<void> {
    try {
      const resources = await this.permissionService.getAllResources();
      res.json(new BaseResultDto({ data: resources }));
    } catch (error: any) {
      console.error("[RbacController] Error fetching resources:", error.message);
      res.status(500).json(
        new BaseResultDto({
          error: error.message || "Failed to fetch resources",
        })
      );
    }
  }

  /**
   * POST /api/admin/rbac/seed-permissions
   * Seed default permissions into the system
   * Use this endpoint only once to initialize permissions
   */
  async seedPermissions(req: Request, res: Response): Promise<void> {
    try {
      await this.permissionService.seedDefaultPermissions();
      res.json(
        new BaseResultDto({
          data: { message: "Default permissions seeded successfully" },
        })
      );
    } catch (error: any) {
      console.error("[RbacController] Error seeding permissions:", error.message);
      res.status(500).json(
        new BaseResultDto({
          error: error.message || "Failed to seed permissions",
        })
      );
    }
  }
}
