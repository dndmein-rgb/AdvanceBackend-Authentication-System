import { AppError } from "@/common/errors/app-error";
import { IAdminRepository } from "./admin.interface";
import {
  AdminUserDTO,
  CursorPaginationResult,
  GetAllRolesType,
} from "./admin.types";
import { Prisma } from "@/generated/prisma/client";
import {
  toRoleDetailsResponse,
  toRoleResponse,
  toUserResponse,
} from "./admin.mapper";
import {
  AssignPermissionsDTO,
  AssignRoleDTO,
  CreateRoleDTO,
  RemoveRoleDTO,
  UpdateRoleDTO,
} from "./admin.schema";
import { RoleDetailsResponseDTO, RoleResponseDTO } from "./admin.response";
import { PaginationDTO } from "@/common/schema/pagination.schema";
import { prisma } from "@/infrastructure/database";
import { SYSTEM_ROLES } from "@/common/constants/roles";

export class AdminService {
  constructor(private readonly adminRepo: IAdminRepository) {}

  async getAllUsers(
    query: PaginationDTO,
  ): Promise<CursorPaginationResult<AdminUserDTO>> {
    return await this.adminRepo.getAllUsers(query.cursor, query.limit);
  }
  async getUserById(userId: string): Promise<AdminUserDTO> {
    const user = await this.adminRepo.findUserById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return toUserResponse(user);
  }

  async getAllRoles(): Promise<GetAllRolesType> {
    return await this.adminRepo.getAllRoles();
  }

  async getRoleById(roleId: string): Promise<RoleDetailsResponseDTO> {
    const role = await this.adminRepo.getRoleById(roleId);
    if (!role) throw new AppError("Role not found", 404);
    return toRoleDetailsResponse(role);
  }

  async createRole(data: CreateRoleDTO): Promise<RoleResponseDTO> {
    const existingRole = await this.adminRepo.findRoleByName(data.name);
    if (existingRole) {
      throw new AppError("Role already exists", 409);
    }
    const role = await this.adminRepo.createRole(data);
    return toRoleResponse(role);
  }

  async updateRole(
    roleId: string,
    data: UpdateRoleDTO,
  ): Promise<RoleResponseDTO> {
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
  private async getValidatedPermissionIds(
    roleId: string,
    data: AssignPermissionsDTO,
  ): Promise<string[]> {
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

    return permissions.map((permission) => permission.id);
  }

  async assignPermissionsToRole(
    roleId: string,
    data: AssignPermissionsDTO,
  ): Promise<void> {
    const permissionIds = await this.getValidatedPermissionIds(roleId, data);

    await this.adminRepo.assignPermissionsToRole(roleId, permissionIds);
  }
  async assignRoleToUser(userId: string, data: AssignRoleDTO): Promise<void> {
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
  async removeRoleFromUser(userId: string, data: RemoveRoleDTO): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const user = await this.adminRepo.findUserById(userId);
      if (!user) {
        throw new AppError("User not found", 404);
      }
      const assignment = await this.adminRepo.findUserRole(
        tx,
        userId,
        data.roleId,
      );
      if (!assignment) {
        throw new AppError("Role is not assigned to user", 404);
      }
      if (assignment.role.name === SYSTEM_ROLES.ADMIN) {
        const adminCount = await this.adminRepo.countUsersByRoleId(
          tx,
          assignment.roleId,
        );
        if (adminCount <= 1) {
          throw new AppError("Cannot remove the last admin", 403);
        }
      }
      try {
        await this.adminRepo.removeRoleFromUser(tx, userId, data.roleId);
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2025"
        ) {
          throw new AppError("Role is not assigned to user", 404);
        }

        throw error;
      }
    });
  }
  async replaceRolePermissions(
    roleId: string,
    data: AssignPermissionsDTO,
  ): Promise<void> {
    const permissionIds = await this.getValidatedPermissionIds(roleId, data);
    await this.adminRepo.replaceRolePermissions(roleId, permissionIds);
  }
}
