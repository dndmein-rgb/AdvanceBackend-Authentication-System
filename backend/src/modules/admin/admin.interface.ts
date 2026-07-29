import { Role, UserRole } from "@/generated/prisma/client";
import { Permission as PermissionModel } from "@/generated/prisma/client";
import {
  AdminUserType,
  CreateRoleData,
  GetAllRolesType,
  GetAllUsersType,
  GetRoleByIdType,
  UpdateRoleData,
} from "./admin.types";
import { Permission } from "@/common/constants/permissions";

export interface IAdminRepository {
  getAllUsers(): Promise<GetAllUsersType>;

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

  removeRoleFromUser(userId: string, roleId: string): Promise<void>;
}
