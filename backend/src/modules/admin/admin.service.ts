import { AppError } from "@/common/errors/app-error";
import { IAdminRepository } from "./admin.interface";
<<<<<<< Updated upstream
import {
  AdminUserDTO,
  GetAllRolesType,
  GetRoleByIdType,
} from "./admin.types";
=======
import { AdminUserDTO, CursorPaginationResult } from "./admin.types";
import { Prisma } from "@/generated/prisma/client";
import {
  toCursorPaginationResponse,
  toRoleDetailsResponse,
  toRoleListResponse,
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
import {
  RoleDetailsResponseDTO,
  RoleListResponseDTO,
  RoleResponseDTO,
} from "./admin.response";
import { PaginationDTO } from "@/common/schema/pagination.schema";
import {
  ensureRoleIsAssignable,
  ensureRoleIsDeletable,
  ensureRoleIsEditable,
} from "./admin.guard";
import { permissionService } from "@/common/services/permission.service";
>>>>>>> Stashed changes

export class AdminService {
  constructor(private readonly adminRepo: IAdminRepository) {}

<<<<<<< Updated upstream
  async getAllUsers(): Promise<AdminUserDTO[]> {
    const users = await this.adminRepo.getAllUsers();
    return users;
=======
  async getAllUsers(
    query: PaginationDTO,
  ): Promise<CursorPaginationResult<AdminUserDTO>> {
    const users = await this.adminRepo.getAllUsers(query.cursor, query.limit);
    return toCursorPaginationResponse(users, toUserResponse);
>>>>>>> Stashed changes
  }
  async getUserById(userId: string): Promise<AdminUserDTO> {
    const user = await this.adminRepo.findUserById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  }

<<<<<<< Updated upstream
  async getAllRoles(): Promise<GetAllRolesType> {
    return await this.adminRepo.getAllRoles();
=======
  async getAllRoles(
    query: PaginationDTO,
  ): Promise<CursorPaginationResult<RoleListResponseDTO>> {
    const result = await this.adminRepo.getAllRoles(query.cursor, query.limit);
    return toCursorPaginationResponse(result, toRoleListResponse);
>>>>>>> Stashed changes
  }

  async getRoleById(roleId: string): Promise<GetRoleByIdType> {
    const role = await this.adminRepo.getRoleById(roleId);
    if (!role) throw new AppError("Role not found", 404);
<<<<<<< Updated upstream
    return role;
=======
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
    if (!data.name) {
      throw new AppError("Nothing to update", 400);
    }
    const role = await this.adminRepo.getRoleById(roleId);
    if (!role) {
      throw new AppError("Role not found", 404);
    }
    ensureRoleIsEditable(role);
    const existingRole = await this.adminRepo.findRoleByName(data.name);
    if (existingRole && existingRole.id !== roleId) {
      throw new AppError("Role already exists", 409);
    }

    const updatedRole = await this.adminRepo.updateRole(roleId, {
      name: data.name,
    });
    return toRoleResponse(updatedRole);
  }
  async deleteRole(roleId: string): Promise<void> {
    const role = await this.adminRepo.getRoleById(roleId);

    if (!role) {
      throw new AppError("Role not found", 404);
    }
    ensureRoleIsDeletable(role);
    await this.adminRepo.deleteRole(roleId);
  }
  private async getValidatedPermissionIds(
    permissions: AssignPermissionsDTO["permissions"],
  ): Promise<string[]> {
    const dbPermissions =
      await this.adminRepo.findPermissionsByNames(permissions);

    if (dbPermissions.length !== permissions.length) {
      throw new AppError("One or more permissions are invalid", 400);
    }

    return dbPermissions.map((permission) => permission.id);
  }

  async assignPermissionsToRole(
    roleId: string,
    data: AssignPermissionsDTO,
  ): Promise<void> {
    const role = await this.adminRepo.getRoleById(roleId);

    if (!role) {
      throw new AppError("Role not found", 404);
    }

    ensureRoleIsEditable(role);
    const permissionIds = await this.getValidatedPermissionIds(
      data.permissions,
    );

    await this.adminRepo.assignPermissionsToRole(roleId, permissionIds);
    await permissionService.invalidateRoleUsers(roleId);
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
    ensureRoleIsAssignable(role);
    try {
      await this.adminRepo.assignRoleToUser(userId, data.roleId);
      await permissionService.invalidateUserPermissions(userId);
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
    const user = await this.adminRepo.findUserById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    await this.adminRepo.removeRoleFromUser(userId, data.roleId);
    await permissionService.invalidateUserPermissions(userId);
  }

  async replaceRolePermissions(
    roleId: string,
    data: AssignPermissionsDTO,
  ): Promise<void> {
    const role = await this.adminRepo.getRoleById(roleId);

    if (!role) {
      throw new AppError("Role not found", 404);
    }

    ensureRoleIsEditable(role);
    const permissionIds = await this.getValidatedPermissionIds(
      data.permissions,
    );
    await this.adminRepo.replaceRolePermissions(roleId, permissionIds);
    await permissionService.invalidateRoleUsers(roleId);
>>>>>>> Stashed changes
  }
}
