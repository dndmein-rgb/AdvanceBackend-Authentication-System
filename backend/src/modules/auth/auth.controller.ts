import { asyncHandler } from "@/common/middleware/async-handler";
import type { Request, Response } from "express";
import { authService } from "./auth.container";
import { sendResponse } from "@/common/utils/send-response";
import { setRefreshTokenCookie } from "@/common/utils/cookie";

export const registerUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await authService.register({
      ...req.body,
      userAgent: req.get("user-agent"),
      ipAddress: req.ip,
    });
    setRefreshTokenCookie(res, result.refreshToken);
    sendResponse(res, 201, {
      success: true,
      message: "User registered successfully",
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  },
);

export const loginUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await authService.login({
      ...req.body,
      userAgent: req.get("user-agent"),
      ipAddress: req.ip,
    });
    console.log("token: ",result.refreshToken);
    setRefreshTokenCookie(res, result.refreshToken);
    console.log(res.getHeaders());

    sendResponse(res, 200, {
      success: true,
      message: "User logged in successfully",
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  },
);
