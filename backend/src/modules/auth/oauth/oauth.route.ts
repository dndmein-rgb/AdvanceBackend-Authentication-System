import express from "express";
import {
  googleCallbackController,
  redirectToGoogleController,
} from "./oauth.controller";
import { validate } from "@/common/middleware/validate.middleware";
import { googleCallbackSchema } from "./oauth.schema";

const router = express.Router();

router.route("/google").get(redirectToGoogleController);

router
  .route("/google/callback")
  .get(validate(googleCallbackSchema, "query"), googleCallbackController);

export default router;
