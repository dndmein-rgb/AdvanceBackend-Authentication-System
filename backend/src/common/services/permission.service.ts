import { CACHE_KEYS, CACHE_TTL } from "@/common/constants/cache";
import { Permission } from "@/common/constants/permissions";
import { logger } from "@/config/logger";
import { authRepository } from "@/modules/auth/auth.container";
import { cacheService } from "./cache.service";

export class PermissionService {
  async getUserPermissions(userId: string): Promise<Permission[]> {
    const cacheKey = CACHE_KEYS.USER_PERMISSIONS(userId);

    // 1. Check cache
    const cachedPermissions =
      await cacheService.get<Permission[]>(cacheKey);

    if (cachedPermissions) {
      logger.info({ userId }, "Permission cache hit");
      return cachedPermissions;
    }

    logger.info({ userId }, "Permission cache miss");

    // 2. Load from database
    const userRoles = await authRepository.getUserPermissions(userId);

    // 3. Flatten permissions
    const permissions = userRoles.flatMap((userRole) =>
      userRole.role.rolePermissions.map(
        (rolePermission) => rolePermission.permission.name as Permission,
      ),
    );

    // 4. Remove duplicates
    const uniquePermissions = [...new Set(permissions)];

    // 5. Store in Redis
    await cacheService.set(
      cacheKey,
      uniquePermissions,
      CACHE_TTL.USER_PERMISSIONS,
    );

    // 6. Return permissions
    return uniquePermissions;
  }

  async invalidateUserPermissions(userId: string): Promise<void> {
    await cacheService.del(CACHE_KEYS.USER_PERMISSIONS(userId));
  }

  async invalidateRoleUsers(roleId: string): Promise<void> {
    const userIds = await authRepository.findUserIdsByRole(roleId);

    if (!userIds.length) {
      return;
    }

    const keys = userIds.map((userId) =>
      CACHE_KEYS.USER_PERMISSIONS(userId),
    );

    await cacheService.delMany(keys);
  }
}

export const permissionService = new PermissionService();