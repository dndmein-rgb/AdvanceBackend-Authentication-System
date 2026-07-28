import { AdminUserType, GetAllRolesType, GetAllUsersType, GetRoleByIdType } from "./admin.types";

export interface IAdminRepository {

  getAllUsers(): Promise<GetAllUsersType>;

  findUserById(userId: string): Promise<AdminUserType | null>;

  getAllRoles(): Promise<GetAllRolesType>;
  getRoleById(roleId: string): Promise<GetRoleByIdType | null>;
}
