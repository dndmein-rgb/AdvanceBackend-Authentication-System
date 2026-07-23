import { asyncHandler } from "@/common/middleware/async-handler";
import type { Request, Response } from "express";
import { authService } from "./auth.container";
import { sendResponse } from "@/common/utils/send-response";

export const registerUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    sendResponse(res, 201, {
      success: true,
      message: "User registered sucessfully",
      data: result,
    });
  },
);

export const loginUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    sendResponse(res, 200, {
      success: true,
      message: "User logged in sucessfully",
      data: result,
    });
  },
);
