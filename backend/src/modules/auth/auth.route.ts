import express from "express";
import {
  getCurrentUserController,
  getUserPermissionsController,
  loginUserController,
  logoutAllSessionsController,
  logoutUserController,
  refreshTokenController,
  registerUserController,
} from "./auth.controller";
import { validate } from "@/common/middleware/validate.middleware";
import { loginUserSchema, registerUserSchema } from "./auth.schema";
import { authenticate } from "@/common/middleware/auth.middleware";
import { registerRateLimiter ,loginRateLimiter,refreshTokenRateLimiter} from "@/common/middleware/rate-limit/rate-limiters";

const router = express.Router();

router
  .route("/register")
  .post(registerRateLimiter,validate(registerUserSchema), registerUserController);
router.route("/login").post(loginRateLimiter,validate(loginUserSchema), loginUserController);
router.route("/logout").post(logoutUserController);
router.route("/logout-all").post(authenticate, logoutAllSessionsController);
router.route("/refresh-token").post(refreshTokenRateLimiter,refreshTokenController);
router.route("/me").get(authenticate, getCurrentUserController);

router
  .route("/me/permissions")
  .get(authenticate, getUserPermissionsController);
export default router;
