import { Permission } from "@/common/constants/permissions";
import { IAdminRepository } from "./admin.interface";
import { prisma } from "@/infrastructure/database";
import { User } from "@/generated/prisma/client";

export class AdminRepository implements IAdminRepository {
  async getUserPermissions(userId: string): Promise<Permission[]> {
    const userRoles = await prisma.userRole.findMany({
      where: {
        userId,
      },
      select: {
        role: {
          select: {
            rolePermissions: {
              select: {
                permission: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    const permissions = userRoles.flatMap((userRole) =>
      userRole.role.rolePermissions.map(
        (rolePermission) => rolePermission.permission.name as Permission,
      ),
    );

    return [...new Set(permissions)];
  }
  async getAllUsers(): Promise<User[]> {
    return await prisma.user.findMany()
  }
}
