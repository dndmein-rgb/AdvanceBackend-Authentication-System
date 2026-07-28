import { AppError } from "@/common/errors/app-error";
import { IAdminRepository } from "./admin.interface";
import {
  AdminUserDTO,
  GetAllRolesType,
  GetRoleByIdType,
} from "./admin.types";

export class AdminService {
  constructor(private readonly adminRepo: IAdminRepository) {}

  async getAllUsers(): Promise<AdminUserDTO[]> {
    const users = await this.adminRepo.getAllUsers();
    return users;
  }
  async getUserById(userId: string): Promise<AdminUserDTO> {
    const user = await this.adminRepo.findUserById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  }

  async getAllRoles(): Promise<GetAllRolesType> {
    return await this.adminRepo.getAllRoles();
  }

  async getRoleById(roleId: string): Promise<GetRoleByIdType> {
    const role = await this.adminRepo.getRoleById(roleId);
    if (!role) throw new AppError("Role not found", 404);
    return role;
  }
}
