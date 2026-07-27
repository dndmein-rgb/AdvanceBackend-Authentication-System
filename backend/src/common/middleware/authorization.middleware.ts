import { NextFunction, Request, Response } from "express"
import { Permission } from "@/common/constants/permissions"
import { AppError } from "@/common/errors/app-error"
import { adminService } from "@/modules/admin/admin.container"
export const authorizePermissions = (permission: Permission) =>async(req:Request,_res:Response,next:NextFunction):Promise<void> =>{
  try {
    if (!req.user) {
      throw new AppError("Authentication required",401)
    }
    await adminService.authorize({permission,userId:req.user.userId
    })
    next()
  } catch (error) {
    next(error)
  }
}