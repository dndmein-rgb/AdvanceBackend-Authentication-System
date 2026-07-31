import { Permission } from "@/common/constants/permissions";
import { AuthProvider, Prisma } from "@/generated/prisma/client";

export interface AuthServiceDTO {
  userId: string;
  permission: Permission;
}

export interface AdminUserDTO {
  id: string;
  email: string;
  authProvider: AuthProvider;
  isEmailVerified: boolean;
  createdAt: Date;
}

export type AdminUserType = Prisma.UserGetPayload<{
  select: {
    id: true;
    email: true;
    authProvider: true;
    isEmailVerified: true;
    createdAt: true;
  };
}>;



export type GetRoleByIdType = Prisma.RoleGetPayload<{
  select: {
    id: true;
    name: true;
    createdAt: true;
    isSystem: true;

    rolePermissions: {
      select: {
        assignedAt: true;
        permission: {
          select: {
            id: true;
            name: true;
          };
        };
      };
    };

    userRoles: {
      select: {
        assignedAt: true;
        user: {
          select: {
            id: true;
            email: true;
            createdAt: true;
          };
        };
      };
    };
  };
}>;

export interface CreateRoleData {
  name: string;
}

export interface UpdateRoleData {
  name?: string;
}

export interface AssignPermissionsData {
  permissions: Permission[];
}

export interface CursorPaginationResult<T> {
  data: T[];
  pagination: {
    nextCursor: string | null;
    hasMore: boolean;
    limit: number;
  };
}

export type UserRoleWithRoleType = Prisma.UserRoleGetPayload<{
  include: {
    role: true;
  };
}>;

export type RoleListType = Prisma.RoleGetPayload<{
  select: {
    id: true;
    name: true;
    createdAt: true;
    isSystem: true;

    _count: {
      select: {
        userRoles: true;
        rolePermissions: true;
      };
    };
  };
}>;



