import { Router } from "express";
import { RbacController } from "../controllers/rbac.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { permissionGuard } from "../middlewares/rbac-guard.middleware";

const rbacRouter = Router();
const rbacController = new RbacController();

// ============ ROLE ENDPOINTS ============

// GET all roles with permissions
rbacRouter.get("/roles", authenticate, permissionGuard("role", "read"), (req, res) =>
  rbacController.getAllRoles(req, res)
);

// GET single role by ID
rbacRouter.get("/roles/:roleId", authenticate, permissionGuard("role", "read"), (req, res) =>
  rbacController.getRoleById(req, res)
);

// POST create new role
rbacRouter.post("/roles", authenticate, permissionGuard("role", "manage"), (req, res) =>
  rbacController.createRole(req, res)
);

// PUT update role
rbacRouter.put("/roles/:roleId", authenticate, permissionGuard("role", "manage"), (req, res) =>
  rbacController.updateRole(req, res)
);

// DELETE role
rbacRouter.delete("/roles/:roleId", authenticate, permissionGuard("role", "manage"), (req, res) =>
  rbacController.deleteRole(req, res)
);

// POST assign permissions to role
rbacRouter.post("/roles/:roleId/permissions", authenticate, permissionGuard("role", "manage"), (req, res) =>
  rbacController.assignPermissions(req, res)
);

// ============ PERMISSION ENDPOINTS ============

// GET all permissions
rbacRouter.get("/permissions", authenticate, permissionGuard("permission", "read"), (req, res) =>
  rbacController.getAllPermissions(req, res)
);

// GET permissions by resource (query param: ?resource=user)
rbacRouter.get("/permissions/by-resource", authenticate, permissionGuard("permission", "read"), (req, res) =>
  rbacController.getPermissionsByResource(req, res)
);

// POST create new permission
rbacRouter.post("/permissions", authenticate, permissionGuard("permission", "manage"), (req, res) =>
  rbacController.createPermission(req, res)
);

// GET all unique resources
rbacRouter.get("/resources", authenticate, permissionGuard("permission", "read"), (req, res) =>
  rbacController.getAllResources(req, res)
);

// POST seed default permissions
rbacRouter.post("/seed-permissions", authenticate, permissionGuard("permission", "manage"), (req, res) =>
  rbacController.seedPermissions(req, res)
);

export default rbacRouter;
