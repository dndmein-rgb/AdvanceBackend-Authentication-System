import { IAdminRepository } from "./admin.interface";
import { prisma } from "@/infrastructure/database";
import {
  AdminUserType,
  CreateRoleData,
  CursorPaginationResult,
  GetRoleByIdType,
  RoleListType,
  UpdateRoleData,
} from "./admin.types";
import { Prisma, Role, UserRole } from "@/generated/prisma/client";
import { adminRoleSelect, adminUserSelect } from "./admin.select";
import { Permission as PermissionModel } from "@/generated/prisma/client";
import { Permission } from "@/common/constants/permissions";
import { AppError } from "@/common/errors/app-error";


export class AdminRepository implements IAdminRepository {
  async getAllUsers(
    cursor?: string,
    limit = 10,
  ): Promise<CursorPaginationResult<AdminUserType>> {
    const users = await prisma.user.findMany({
      take: limit + 1,

      ...(cursor && {
        cursor: {
          id: cursor,
        },
        skip: 1,
      }),

      orderBy: [
        {
          createdAt: "desc",
        },
        {
          id: "desc",
        },
      ],

      select: adminUserSelect,
    });

    const hasMore = users.length > limit;

    if (hasMore) {
      users.pop();
    }

    return {
      data: users,
      pagination: {
        hasMore,
        nextCursor: hasMore ? users[users.length - 1].id : null,
        limit,
      },
    };
  }
  async findUserById(userId: string): Promise<AdminUserType | null> {
    return prisma.user.findUnique({
      where: { id: userId },
      select: adminUserSelect,
    });
  }
  async getAllRoles(
    cursor?: string,
    limit = 10,
  ): Promise<CursorPaginationResult<RoleListType>> {
    const roles = await prisma.role.findMany({
      take: limit + 1,

      ...(cursor && {
        cursor: {
          id: cursor,
        },
        skip: 1,
      }),

      orderBy: [
        {
          createdAt: "desc",
        },
        {
          id: "desc",
        },
      ],

      select: {
        ...adminRoleSelect,

        _count: {
          select: {
            userRoles: true,
            rolePermissions: true,
          },
        },
      },
    });

    const hasMore = roles.length > limit;

    if (hasMore) {
      roles.pop();
    }

    return {
      data: roles,

      pagination: {
        hasMore,
        nextCursor: hasMore ? roles[roles.length - 1].id : null,
        limit,
      },
    };
  }
  async getRoleById(roleId: string): Promise<GetRoleByIdType | null> {
    return prisma.role.findUnique({
      where: { id: roleId },
      select: {
        ...adminRoleSelect,

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
    return prisma.role.update({
      where: { id: roleId },
      data: {
        ...(data.name && {
          name: data.name,
        }),
      },
    });
  }
  async deleteRole(roleId: string): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const assignedUsers = await tx.userRole.count({
        where: {
          roleId,
        },
      });

      if (assignedUsers > 0) {
        throw new AppError("Cannot delete role assigned to users", 409);
      }

      try {
        await tx.role.delete({
          where: { id: roleId }
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2025"
        ) {
          throw new AppError("Role not found", 404);
        }
      
        throw error;
      }
    });
  }
  async findRoleByName(name: string): Promise<Role | null> {
    return prisma.role.findUnique({
      where: { name },
    });
  }

  async assignPermissionsToRole(
    roleId: string,
    permissionIds: string[],
  ): Promise<void> {
    await prisma.rolePermission.createMany({
      data: permissionIds.map((permissionId) => ({
        roleId,
        permissionId,
      })),
      skipDuplicates: true,
    });
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
  async assignRoleToUser(userId: string, roleId: string): Promise<UserRole> {
    return prisma.userRole.create({
      data: {
        userId,
        roleId,
      },
    });
  }

  async replaceRolePermissions(
    roleId: string,
    permissionIds: string[],
  ): Promise<void> {
    await prisma.$transaction(async (tx) => {
      await tx.rolePermission.deleteMany({
        where: { roleId },
      });
      await tx.rolePermission.createMany({
        data: permissionIds.map((permissionId) => ({
          roleId,
          permissionId,
        })),
        skipDuplicates: true,
      });
    });
  }

  async removeRoleFromUser(userId: string, roleId: string): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const assignment = await tx.userRole.findUnique({
        where: {
          userId_roleId: {
            userId,
            roleId,
          },
        },
        include: {
          role: true,
        },
      });
      if (!assignment) {
        throw new AppError("Role is not assigned to user", 404);
      }

      if (assignment.role.isSystem) {
        const adminCount = await tx.userRole.count({
          where: {
            roleId: assignment.roleId,
          },
        });

        if (adminCount <= 1) {
          throw new AppError("Cannot remove the last admin", 403);
        }
      }
      await tx.userRole.delete({
        where: {
          userId_roleId: {
            userId,
            roleId,
          },
        },
      });
    });
  }
}

