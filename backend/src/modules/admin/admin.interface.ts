import { Role } from "@/generated/prisma/client";
import {
  AdminUserType,
  CreateRoleData,
  GetAllRolesType,
  GetAllUsersType,
  GetRoleByIdType,
  UpdateRoleData,
} from "./admin.types";

export interface IAdminRepository {
  getAllUsers(): Promise<GetAllUsersType>;

  findUserById(userId: string): Promise<AdminUserType | null>;

  getAllRoles(): Promise<GetAllRolesType>;
  getRoleById(roleId: string): Promise<GetRoleByIdType | null>;
  findRoleByName(name: string): Promise<Role | null>;
  createRole(data: CreateRoleData): Promise<Role>;
  updateRole(roleId: string, data: UpdateRoleData): Promise<Role>;
  deleteRole(roleId: string): Promise<Role>;
}
