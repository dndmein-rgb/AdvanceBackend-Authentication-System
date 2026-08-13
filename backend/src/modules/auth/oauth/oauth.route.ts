import express from "express";
import {
  googleCallbackController,
  redirectToGoogleController,
} from "./oauth.controller";
import { validate } from "@/common/middleware/validate.middleware";
import { googleCallbackSchema } from "./oauth.schema";
import {
  oauthStartLimiter,
  oauthCallbackLimiter,
} from "@/common/middleware/rate-limit/rate-limiters";

const router = express.Router();

router.route("/google").get(oauthStartLimiter,redirectToGoogleController);

router
  .route("/google/callback")
  .get(oauthCallbackLimiter,validate(googleCallbackSchema, "query"), googleCallbackController);

export default router;
