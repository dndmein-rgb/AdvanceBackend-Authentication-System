import { asyncHandler } from "@/common/middleware/async-handler";
import { Request, Response } from "express";
import { adminService } from "./admin.container";
import { sendResponse } from "@/common/utils/send-response";

export const getAllUsersController = asyncHandler(
  async (_req: Request, res: Response) => {
    const result = await adminService.getAllUsers();
    sendResponse(res, 200, {
      success: true,
      message: "All users fetched successfully",
      data: result,
    });
  },
);
