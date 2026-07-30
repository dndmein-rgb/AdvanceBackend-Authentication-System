import express from "express";
import {
  assignPermissionsController,
  assignRoleToUserController,
  createRoleController,
  deleteRoleController,
  getAllRolesController,
  getAllUsersController,
  getRoleByIdController,
  getUserByIdController,
  removeRoleFromUserController,
  replaceRolePermissionsController,
  updateRoleController,
} from "./admin.controller";
import { authorizePermissions } from "@/common/middleware/authorization.middleware";
import { PERMISSIONS } from "@/common/constants/permissions";
import { authenticate } from "@/common/middleware/auth.middleware";
import { validate } from "@/common/middleware/validate.middleware";
import {
  assignPermissionsSchema,
  assignRoleSchema,
  createRoleSchema,
  removeRoleSchema,
  roleIdSchema,
  updateRoleSchema,
  userIdSchema,
} from "./admin.schema";
import { paginationSchema } from "@/common/schema/pagination.schema";

const router = express.Router();

router
  .route("/users")
  .get(
    authenticate,
    authorizePermissions(PERMISSIONS.MANAGE_USERS),
     validate(paginationSchema, "query"),
    getAllUsersController,
  );
router.route("/users/:userId").get(
  authenticate,
  authorizePermissions(PERMISSIONS.MANAGE_USERS),
  validate(userIdSchema, "params"),

  getUserByIdController,
);
router.get(
  "/roles",
  authenticate,
  authorizePermissions(PERMISSIONS.MANAGE_ROLES),
  getAllRolesController,
);
router.get(
  "/roles/:roleId",
  authenticate,
  authorizePermissions(PERMISSIONS.MANAGE_ROLES),
  validate(roleIdSchema, "params"),
  getRoleByIdController,
);

router.post(
  "/roles",
  authenticate,
  authorizePermissions(PERMISSIONS.MANAGE_ROLES),
  validate(createRoleSchema),
  createRoleController,
);

router.put(
  "/roles/:roleId",
  authenticate,
  authorizePermissions(PERMISSIONS.MANAGE_ROLES),
  validate(roleIdSchema, "params"),
  validate(updateRoleSchema),
  updateRoleController,
);

router.delete(
  "/roles/:roleId",
  authenticate,
  authorizePermissions(PERMISSIONS.MANAGE_ROLES),
  validate(roleIdSchema, "params"),
  deleteRoleController,
);

router.post(
  "/roles/:roleId/permissions",
  authenticate,
  authorizePermissions(PERMISSIONS.MANAGE_ROLES),
  validate(assignPermissionsSchema),
  validate(roleIdSchema, "params"),
  assignPermissionsController,
);

router.post(
  "/users/:userId/roles",
  authenticate,
  authorizePermissions(PERMISSIONS.MANAGE_ROLES),
  validate(assignRoleSchema),
  validate(userIdSchema, "params"),
  assignRoleToUserController,
);

router.delete(
  "/users/:userId/roles",
  authenticate,
  authorizePermissions(PERMISSIONS.MANAGE_ROLES),
  validate(removeRoleSchema),
  validate(userIdSchema, "params"),

  removeRoleFromUserController,
);

router.put(
  "/roles/:roleId/permissions",
  authenticate,
  authorizePermissions(PERMISSIONS.MANAGE_ROLES),
  validate(roleIdSchema, "params"),
  validate(assignPermissionsSchema),
  replaceRolePermissionsController,
);
export default router;
