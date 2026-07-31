import { AdminUserDTO, AdminUserType, CursorPaginationResult, GetRoleByIdType, RoleListType } from "./admin.types";
import {
  PermissionResponseDTO,
  RoleDetailsResponseDTO,
  RoleListResponseDTO,
  RoleResponseDTO,
  UserRoleResponseDTO,
} from "./admin.response";
import { Role } from "@/generated/prisma/client";

export const toRoleResponse = (role: Role): RoleResponseDTO => ({
  id: role.id,
  name: role.name,
  isSystem: role.isSystem,
  createdAt: role.createdAt,
});

export const toUserResponse = (user: AdminUserType): AdminUserDTO => ({
  id: user.id,
  email: user.email,
  authProvider: user.authProvider,
  isEmailVerified: user.isEmailVerified,
  createdAt: user.createdAt,
});

export const toPermissionResponse = (permission: {
  id: string;
  name: string;
}): PermissionResponseDTO => ({
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
  isSystem: role.isSystem,


  permissions: role.rolePermissions.map((rp) => ({
    assignedAt: rp.assignedAt,
    ...toPermissionResponse(rp.permission),
  })),

  users: role.userRoles.map(toUserRoleResponse),
});

export const toRoleListResponse = (
  role: RoleListType,
): RoleListResponseDTO => ({
  id: role.id,
  name: role.name,
  isSystem: role.isSystem,
  createdAt: role.createdAt,
  userCount: role._count.userRoles,
  permissionCount: role._count.rolePermissions,
});


export const toCursorPaginationResponse = <T, R>(
  result: CursorPaginationResult<T>,
  mapper: (item: T) => R,
) => ({
  data: result.data.map(mapper),

  pagination: {
    nextCursor: result.pagination.nextCursor,
    hasMore: result.pagination.hasMore,
    limit: result.pagination.limit,
  },
});
