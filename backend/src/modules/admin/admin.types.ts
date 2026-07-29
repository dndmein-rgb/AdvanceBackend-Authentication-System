import { Permission } from "@/common/constants/permissions";
import { AuthProvider, Prisma, Role } from "@/generated/prisma/client";

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
export type GetAllUsersType = Prisma.UserGetPayload<{
  select: {
    id: true;
    email: true;
    authProvider: true;
    isEmailVerified: true;
    createdAt: true;
  };
}>[];

export type GetAllRolesType = Prisma.RoleGetPayload<{
  select: {
    id: true;
    name: true;
    createdAt: true;

    userRoles: {
      select: {
        userId: true;
      };
    };
    rolePermissions: {
      select: {
        permission: {
          select: {
            id: true;
            name: true;
          };
        };
      };
    };
  };
}>[];

export type GetRoleByIdType = Prisma.RoleGetPayload<{
  select: {
    id: true;
    name: true;
    createdAt: true;

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
  name: string;
}

export type RoleResponseDTO = Pick<Role, "id" | "name" | "createdAt">;

export interface AssignPermissionsData {
  permissions: Permission[];
}
