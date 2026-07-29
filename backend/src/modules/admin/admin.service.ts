import { AppError } from "@/common/errors/app-error";
import { IAdminRepository } from "./admin.interface";
import { AdminUserDTO, GetAllRolesType, GetRoleByIdType } from "./admin.types";
import { Prisma, Role } from "@/generated/prisma/client";
import { toRoleResponse } from "./admin.mapper";
import {
  AssignPermissionsDTO,
  AssignRoleSchemaDTO,
  CreateRoleDTO,
  RemoveRoleSchemaDTO,
  UpdateRoleDTO,
} from "./admin.schema";

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

  async createRole(data: CreateRoleDTO): Promise<Role> {
    const existingRole = await this.adminRepo.findRoleByName(data.name);
    if (existingRole) {
      throw new AppError("Role already exists", 409);
    }
    const role = await this.adminRepo.createRole(data);
    return toRoleResponse(role);
  }

  async updateRole(roleId: string, data: UpdateRoleDTO): Promise<Role> {
    const role = await this.adminRepo.getRoleById(roleId);
    if (!role) {
      throw new AppError("Role not found", 404);
    }
    const existingRole = await this.adminRepo.findRoleByName(data.name);
    if (existingRole && existingRole.id !== roleId) {
      throw new AppError("Role already exists", 409);
    }

    const updatedRole = await this.adminRepo.updateRole(roleId, data);
    return toRoleResponse(updatedRole);
  }
  async deleteRole(roleId: string): Promise<void> {
    const role = await this.adminRepo.getRoleById(roleId);

    if (!role) {
      throw new AppError("Role not found", 404);
    }

    await this.adminRepo.deleteRole(roleId);
  }

  async assignPermissionsToRole(
    roleId: string,
    data: AssignPermissionsDTO,
  ): Promise<void> {
    const role = await this.adminRepo.getRoleById(roleId);
    if (!role) {
      throw new AppError("Role not found", 404);
    }
    const permissions = await this.adminRepo.findPermissionsByNames(
      data.permissions,
    );
    if (permissions.length !== data.permissions.length) {
      throw new AppError("One or more permissions are invalid", 400);
    }
    await this.adminRepo.assignPermissionsToRole(
      roleId,
      permissions.map((permission) => permission.id),
    );
  }

  async assignRoleToUser(
    userId: string,
    data: AssignRoleSchemaDTO,
  ): Promise<void> {
    const user = await this.adminRepo.findUserById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    const role = await this.adminRepo.getRoleById(data.roleId);
    if (!role) {
      throw new AppError("Role not found", 404);
    }
    try {
      await this.adminRepo.assignRoleToUser(userId, data.roleId);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new AppError("Role already assigned to user", 409);
      }

      throw error;
    }
  }
  async removeRoleFromUser(
    userId: string,
    data: RemoveRoleSchemaDTO,
  ): Promise<void> {
    const user = await this.adminRepo.findUserById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const role = await this.adminRepo.getRoleById(data.roleId);

    if (!role) {
      throw new AppError("Role not found", 404);
    }

    try {
      await this.adminRepo.removeRoleFromUser(userId, data.roleId);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new AppError("Role is not assigned to user", 404);
      }

      throw error;
    }
  }
  async replaceRolePermissions(
    roleId: string,
    data: AssignPermissionsDTO,
  ): Promise<void> {
    const role = await this.adminRepo.getRoleById(roleId);

    if (!role) {
      throw new AppError("Role not found", 404);
    }

    const permissions = await this.adminRepo.findPermissionsByNames(
      data.permissions,
    );

    if (permissions.length !== data.permissions.length) {
      throw new AppError("One or more permissions are invalid", 400);
    }

    await this.adminRepo.replaceRolePermissions(
      roleId,
      permissions.map((permission) => permission.id),
    );
  }
}
