import express from "express";
import {
  getAllRolesController,
  getAllUsersController,
  getRoleByIdController,
  getUserByIdController,
} from "./admin.controller";
import { authorizePermissions } from "@/common/middleware/authorization.middleware";
import { PERMISSIONS } from "@/common/constants/permissions";
import { authenticate } from "@/common/middleware/auth.middleware";
import { validate } from "@/common/middleware/validate.middleware";
import { getRoleByIdSchema } from "./admin.schema";

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
  authorizePermissions(PERMISSIONS.MANAGE_ROLES),validate(getRoleByIdSchema,"params"),
  getRoleByIdController,
);

export default router;
