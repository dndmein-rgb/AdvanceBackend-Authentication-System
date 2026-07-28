import { asyncHandler } from "@/common/middleware/async-handler";
import type { Request, Response } from "express";
import { authService } from "./auth.container";
import { sendResponse } from "@/common/utils/send-response";
import {
  clearRefreshTokenCookie,
  setRefreshTokenCookie,
} from "@/common/utils/cookie";
import { AppError } from "@/common/errors/app-error";

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
    setRefreshTokenCookie(res, result.refreshToken);

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

export const refreshTokenController = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    const result = await authService.refreshToken({ refreshToken });
    setRefreshTokenCookie(res, result.refreshToken);
    sendResponse(res, 200, {
      success: true,
      message: "Token refreshed successfully",
      data: {
        accessToken: result.accessToken,
      },
    });
  },
);
export const logoutUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError("Refresh token is missing", 401);
    }
    await authService.logout({
      refreshToken,
    });

    clearRefreshTokenCookie(res);

    sendResponse(res, 200, {
      success: true,
      message: "Logged out successfully",
      data: null,
    });
  },
);

export const getCurrentUserController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const response = await authService.getCurrentUser({
    userId: req.user!.userId,
  });

  sendResponse(res, 200, {
    success: true,
    message: "Current user fetched successfully",
    data: response,
  });
};
export const logoutAllSessionsController = asyncHandler(
  async (req: Request, res: Response) => {
    await authService.logoutAllSessions(req.user!.userId);
    clearRefreshTokenCookie(res);
    sendResponse(res, 200, {
      success: true,
      message: "Logged out from all devices successfully",
    });
  },
);

export const getUserPermissionsController = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user;

    const result = await authService.getUserPermissions(user!.userId );

    sendResponse(res, 200, {
      success: true,
      message: "User permissions fetched successfully",
      data: result,
    });
  },
);
