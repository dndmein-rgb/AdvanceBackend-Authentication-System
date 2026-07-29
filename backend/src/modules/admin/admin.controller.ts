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
  async (_req: Request, res: Response) => {
    const result = await adminService.getAllRoles();

    sendResponse(res, 200, {
      success: true,
      message: "User roles fetched successfully",
      data: result,
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

export const assignPermissionsController =
asyncHandler(
 async(
  req:Request,
  res:Response,
 )=>{

  await adminService.assignPermissionsToRole(
    req.params.roleId as string,
    req.body,
  );


  sendResponse(res,200,{
    success:true,
    message:"Permissions assigned successfully",
    data:null,
  });

 }
);
