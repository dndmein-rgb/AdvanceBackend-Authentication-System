import express from "express";
import { getAllUsersController } from "./admin.controller";
import { authorizePermissions } from "@/common/middleware/authorization.middleware";
import { PERMISSIONS } from "@/common/constants/permissions";
import { authenticate } from "@/common/middleware/auth.middleware";

const router = express.Router();

router.route("/users").get(authenticate,authorizePermissions(PERMISSIONS.MANAGE_USERS) ,getAllUsersController);

export default router;
