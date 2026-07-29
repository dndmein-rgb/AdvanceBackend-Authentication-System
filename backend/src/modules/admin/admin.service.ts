import { AppError } from "@/common/errors/app-error";
import { IAdminRepository } from "./admin.interface";
import {
  AdminUserDTO,
  CreateRoleDTO,
  GetAllRolesType,
  GetRoleByIdType,
  UpdateRoleDTO,
} from "./admin.types";
import { Role } from "@/generated/prisma/client";
import { toRoleResponse } from "./admin.mapper";

export class AdminService {
  constructor(private readonly adminRepo: IAdminRepository) { }

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

  async createRole(data: CreateRoleDTO): Promise<Role> {
    const existingRole = await this.adminRepo.findRoleByName(data.name);
    if (existingRole) {
      throw new AppError("Role already exists", 409);
    }
    const role = await this.adminRepo.createRole(data);
    return toRoleResponse(role);
  }

  async updateRole(roleId: string, data: UpdateRoleDTO): Promise<Role> {
    const role = await this.adminRepo.getRoleById(roleId)
    if (!role) {
      throw new AppError("Role not found", 404);
    }
    const existingRole = await this.adminRepo.findRoleByName(data.name)
    if (existingRole && existingRole.id !== roleId) {
      throw new AppError("Role already exists", 409);
    }

    const updatedRole = await this.adminRepo.updateRole(
      roleId,
      data,
    );
    return toRoleResponse(updatedRole)
    
  }
  async deleteRole(roleId: string): Promise<void> {
    const role = await this.adminRepo.getRoleById(roleId);
  
    if (!role) {
      throw new AppError("Role not found", 404);
    }
  
    await this.adminRepo.deleteRole(roleId);
  }
}
