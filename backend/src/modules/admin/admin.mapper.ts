import {
  AdminUserDTO,
  AdminUserType,
  GetRoleByIdType,
} from "./admin.types";
import {
  PermissionResponseDTO,
  RoleDetailsResponseDTO,
  RoleResponseDTO,
  UserRoleResponseDTO,
} from "./admin.response";
import { Role } from "@/generated/prisma/client";

export const toRoleResponse = (
  role: Role,
): RoleResponseDTO => ({
  id: role.id,
  name: role.name,
  createdAt: role.createdAt,
});

export const toUserResponse = (
  user: AdminUserType,
): AdminUserDTO => ({
  id: user.id,
  email: user.email,
  authProvider: user.authProvider,
  isEmailVerified: user.isEmailVerified,
  createdAt: user.createdAt,
});

export const toPermissionResponse = (
  permission: {
    id: string;
    name: string;
  },
): PermissionResponseDTO => ({
  id: permission.id,
  name: permission.name,
});

export const toUserRoleResponse = (
  userRole: GetRoleByIdType["userRoles"][number],
): UserRoleResponseDTO => ({
  id: userRole.user.id,
  email: userRole.user.email,
  assignedAt: userRole.assignedAt,
});

export const toRoleDetailsResponse = (
  role: GetRoleByIdType,
): RoleDetailsResponseDTO => ({
  id: role.id,
  name: role.name,
  createdAt: role.createdAt,

  permissions: role.rolePermissions.map((rp) => ({
    assignedAt: rp.assignedAt,
    ...toPermissionResponse(rp.permission),
  })),

  users: role.userRoles.map(toUserRoleResponse),
});