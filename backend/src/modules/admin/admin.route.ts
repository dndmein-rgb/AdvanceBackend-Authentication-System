import express from "express";
import {
  createRoleController,
  deleteRoleController,
  getAllRolesController,
  getAllUsersController,
  getRoleByIdController,
  getUserByIdController,
  updateRoleController,
} from "./admin.controller";
import { authorizePermissions } from "@/common/middleware/authorization.middleware";
import { PERMISSIONS } from "@/common/constants/permissions";
import { authenticate } from "@/common/middleware/auth.middleware";
import { validate } from "@/common/middleware/validate.middleware";
import { createRoleSchema, getRoleByIdSchema, roleIdSchema, updateRoleSchema } from "./admin.schema";

const router = express.Router();

router
  .route("/users")
  .get(
    authenticate,
    authorizePermissions(PERMISSIONS.MANAGE_USERS),
    getAllUsersController,
  );
router
  .route("/users/:userId")
  .get(
    authenticate,
    authorizePermissions(PERMISSIONS.MANAGE_USERS),
    
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
  validate(getRoleByIdSchema),
  validate(roleIdSchema,"params"),
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
  validate(roleIdSchema
    , "params"),
  deleteRoleController,
);

export default router;
