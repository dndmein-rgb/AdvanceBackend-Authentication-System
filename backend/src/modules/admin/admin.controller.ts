import { asyncHandler } from "@/common/middleware/async-handler";
import { Request, Response } from "express";
import { adminService } from "./admin.container";
import { sendResponse } from "@/common/utils/send-response";
import { PaginationDTO } from "@/common/schema/pagination.schema";

export const getAllUsersController = asyncHandler(
  async (req: Request, res: Response) => {
    const query = req.query as unknown as PaginationDTO;

    const result = await adminService.getAllUsers(query);
    sendResponse(res, 200, {
      success: true,
      message: "All users fetched successfully",
      data: result,
      meta: {
        pagination: result.pagination,
      },
    });
  },
);

export const getUserByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await adminService.getUserById(req.params.userId as string);

    sendResponse(res, 200, {
      success: true,
      message: "User fetched successfully",
      data: result,
    });
  },
);
export const getAllRolesController = asyncHandler(
  async (req: Request, res: Response) => {
    const query = req.query as unknown as PaginationDTO;
    const result = await adminService.getAllRoles(query);

    sendResponse(res, 200, {
      success: true,
      message: "Roles fetched successfully",
      data: result,
      meta: {
        pagination: result.pagination,
      },
    });
  },
);
export const getRoleByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await adminService.getRoleById(req.params.roleId as string);

    sendResponse(res, 200, {
      success: true,
      message: "Role fetched successfully",
      data: result,
    });
  },
);

export const createRoleController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await adminService.createRole(req.body);

    sendResponse(res, 201, {
      success: true,
      message: "Role created successfully",
      data: result,
    });
  },
);
export const updateRoleController = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await adminService.updateRole(
      req.params.roleId as string,
      req.body,
    );

    sendResponse(res, 200, {
      success: true,
      message: "Role updated successfully",
      data: result,
    });
  },
);
export const deleteRoleController = asyncHandler(
  async (req: Request, res: Response) => {
    await adminService.deleteRole(req.params.roleId as string);

    sendResponse(res, 200, {
      success: true,
      message: "Role deleted successfully",
      data: null,
    });
  },
);

export const assignPermissionsController = asyncHandler(
  async (req: Request, res: Response) => {
    await adminService.assignPermissionsToRole(
      req.params.roleId as string,
      req.body,
    );

    sendResponse(res, 200, {
      success: true,
      message: "Permissions assigned successfully",
      data: null,
    });
  },
);

export const assignRoleToUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.params;

    await adminService.assignRoleToUser(userId as string, req.body);

    sendResponse(res, 200, {
      success: true,
      message: "Role assigned successfully",
      data: null,
    });
  },
);

export const removeRoleFromUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.params;

    await adminService.removeRoleFromUser(userId as string, req.body);

    sendResponse(res, 200, {
      success: true,
      message: "Role removed successfully",
      data: null,
    });
  },
);
export const replaceRolePermissionsController = asyncHandler(
  async (req, res) => {
    await adminService.replaceRolePermissions(
      req.params.roleId as string,
      req.body,
    );

    sendResponse(res, 200, {
      success: true,
      message: "Role permissions updated successfully",
      data: null,
    });
  },
);
