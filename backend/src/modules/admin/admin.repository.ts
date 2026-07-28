import { IAdminRepository } from "./admin.interface";
import { prisma } from "@/infrastructure/database";
import {  AdminUserType, GetAllRolesType, GetAllUsersType, GetRoleByIdType } from "./admin.types";

export class AdminRepository implements IAdminRepository {
  
  async getAllUsers(): Promise<GetAllUsersType> {
    return await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        authProvider: true,
        isEmailVerified: true,
        createdAt: true,
      },
    });
  }

  async findUserById(userId: string): Promise<AdminUserType | null> {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        authProvider: true,
        isEmailVerified: true,
        createdAt: true,
      },
    });
  }
  async getAllRoles(): Promise<GetAllRolesType> {
    return await prisma.role.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        createdAt: true,

        userRoles: {
          select: {
            userId: true,
          },
        },

        rolePermissions: {
          select: {
            permission: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }
  async getRoleById(roleId: string): Promise<GetRoleByIdType | null> {
    return await prisma.role.findUnique({
      where: { id: roleId },
      select: {
        id: true,
        name: true,
        createdAt: true,

        rolePermissions: {
          select: {
            assignedAt: true,
            permission: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        userRoles: {
          select: {
            assignedAt: true,
            user: {
              select: {
                id: true,
                email: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });
  }
}
