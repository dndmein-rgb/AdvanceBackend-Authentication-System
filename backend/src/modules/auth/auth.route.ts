import express from "express";
import {
  loginUserController,
  logoutUserController,
  refreshTokenController,
  registerUserController,
} from "./auth.controller";
import { validate } from "@/common/middleware/validate.middleware";
import { loginUserSchema, registerUserSchema } from "./auth.schema";

const router = express.Router();

router
  .route("/register")
  .post(validate(registerUserSchema), registerUserController);
router.route("/login").post(validate(loginUserSchema), loginUserController);
router.route("/logout").post(logoutUserController);
router.route("/refresh").post(refreshTokenController);

export default router;
