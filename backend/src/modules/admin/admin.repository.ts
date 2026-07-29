import { IAdminRepository } from "./admin.interface";
import { prisma } from "@/infrastructure/database";
import {
  AdminUserType,
  CreateRoleData,
  GetAllRolesType,
  GetAllUsersType,
  GetRoleByIdType,
  UpdateRoleData,
} from "./admin.types";
import { Role } from "@/generated/prisma/client";
import { adminUserSelect } from "./admin.select";
import { Permission as PermissionModel } from "@/generated/prisma/client";
import { Permission } from "@/common/constants/permissions";


export class AdminRepository implements IAdminRepository {
  async getAllUsers(): Promise<GetAllUsersType> {
    return prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: adminUserSelect,
    });
  }

  async findUserById(userId: string): Promise<AdminUserType | null> {
    return prisma.user.findUnique({
      where: { id: userId },
      select: adminUserSelect,
    });
  }
  async getAllRoles(): Promise<GetAllRolesType> {
    return prisma.role.findMany({
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
    return prisma.role.findUnique({
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
  async createRole(data: CreateRoleData): Promise<Role> {
    return prisma.role.create({
      data: { name: data.name },
    });
  }
  async updateRole(roleId: string, data: UpdateRoleData): Promise<Role> {
    return await prisma.role.update({
      where: { id: roleId },
      data: {
        name: data.name,
      },
    });
  }
  async deleteRole(roleId: string): Promise<Role> {
    return prisma.role.delete({
      where: {
        id: roleId,
      },
    });
  }
  async findRoleByName(name: string): Promise<Role | null> {
    return prisma.role.findUnique({
      where: { name },
    });
  }

  async assignPermissionsToRole(roleId: string, permissionIds: string[]): Promise<void> {
     await prisma.rolePermission.createMany({
      data:permissionIds.map((permissionId) => ({
        roleId,
        permissionId
      })),
      skipDuplicates:true
    })
  }
  async findPermissionsByNames(
    names: Permission[],
  ): Promise<PermissionModel[]> {
    return await prisma.permission.findMany({
      where: {
        name: {
          in: names,
        },
      },
    });
  }
}
