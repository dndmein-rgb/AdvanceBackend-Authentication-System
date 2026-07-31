import { Role, UserRole } from "@/generated/prisma/client";
import { Permission as PermissionModel } from "@/generated/prisma/client";
import {
  AdminUserType,
  CreateRoleData,
  CursorPaginationResult,
  GetAllRolesType,
  GetRoleByIdType,
  PrismaTransaction,
  UpdateRoleData,
  UserRoleWithRoleType,
} from "./admin.types";
import { Permission } from "@/common/constants/permissions";

export interface IAdminRepository {
  getAllUsers(
    cursor?: string,
    limit?: number,
  ): Promise<CursorPaginationResult<AdminUserType>>;

  findUserById(userId: string): Promise<AdminUserType | null>;

  getAllRoles(): Promise<GetAllRolesType>;
  getRoleById(roleId: string): Promise<GetRoleByIdType | null>;
  findRoleByName(name: string): Promise<Role | null>;

  createRole(data: CreateRoleData): Promise<Role>;
  updateRole(roleId: string, data: UpdateRoleData): Promise<Role>;
  deleteRole(roleId: string): Promise<Role>;

  assignPermissionsToRole(
    roleId: string,
    permissionIds: string[],
  ): Promise<void>;

  replaceRolePermissions(
    roleId: string,
    permissionIds: string[],
  ): Promise<void>;

  findPermissionsByNames(names: Permission[]): Promise<PermissionModel[]>;

  assignRoleToUser(userId: string, roleId: string): Promise<UserRole>;

  findUserRole(
    tx: PrismaTransaction,
    userId: string,
    roleId: string,
  ): Promise<UserRoleWithRoleType | null>;
  
  countUsersByRoleId(tx: PrismaTransaction, roleId: string): Promise<number>;

  removeRoleFromUser(
    tx: PrismaTransaction,
    userId: string,
    roleId: string,
  ): Promise<void>;
}
