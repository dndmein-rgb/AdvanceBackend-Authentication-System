import { NextFunction, Request, Response } from "express";
import { Permission } from "@/common/constants/permissions";
import { AppError } from "@/common/errors/app-error";
import { permissionService } from "../services/permission.service";
export const authorizePermissions =
  (...requiredPermissions: Permission[]) =>
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError("Authentication required", 401);
      }
      const permissions = await permissionService.getUserPermissions(req.user.userId);

      const hasPermission = requiredPermissions.every((permission) =>
        permissions.includes(permission),
      );

      if (!hasPermission) {
        throw new AppError("Forbidden", 403);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
