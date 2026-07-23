import express from "express"
import { loginUserController, registerUserController } from "./auth.controller"
import { validate } from "@/common/middleware/validate.middleware"
import { loginUserSchema, registerUserSchema } from "./auth.schema"

const router = express.Router()

router.route("/register").post(validate(registerUserSchema),registerUserController)
router.route("/login").post(validate(loginUserSchema),loginUserController)

export default router