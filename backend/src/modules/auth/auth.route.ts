import express from "express";
import {
  getCurrentUserController,
  loginUserController,
  logoutAllSessionsController,
  logoutUserController,
  refreshTokenController,
  registerUserController,
} from "./auth.controller";
import { validate } from "@/common/middleware/validate.middleware";
import { loginUserSchema, registerUserSchema } from "./auth.schema";
import { authenticate } from "@/common/middleware/auth.middleware";

const router = express.Router();

router
  .route("/register")
  .post(validate(registerUserSchema), registerUserController);
router.route("/login").post(validate(loginUserSchema), loginUserController);
router.route("/logout").post(logoutUserController);
router.route("/logout-all").post(authenticate,logoutAllSessionsController)
router.route("/refresh").post(refreshTokenController);
router.route("/me").get(authenticate, getCurrentUserController);
export default router;
