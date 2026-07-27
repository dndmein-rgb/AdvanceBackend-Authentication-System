import { PrismaClient } from "../../src/generated/prisma/client";
import { PERMISSIONS } from "../../src/common/constants/permissions";
import { SYSTEM_ROLES } from "../../src/common/constants/roles";

export const seedRolePermissions = async (
  prisma: PrismaClient,
): Promise<void> => {
  const roles = await prisma.role.findMany({
    select: {
      id: true,
      name: true,
    },
  });
  const permissions = await prisma.permission.findMany({
    select: {
      id: true,
      name: true,
    },
  });
  const roleMap = new Map(roles.map((role) => [role.name, role.id]));

  const permissionMap = new Map(
    permissions.map((permission) => [permission.name, permission.id]),
  );
  const mappings = [
    // USER
    {
      role: SYSTEM_ROLES.USER,
      permissions: [
        PERMISSIONS.CREATE_ORDER,
        PERMISSIONS.VIEW_ORDER,
        PERMISSIONS.CANCEL_ORDER,
      ],
    },

    // SELLER
    {
      role: SYSTEM_ROLES.SELLER,
      permissions: [
        PERMISSIONS.CREATE_PRODUCT,
        PERMISSIONS.UPDATE_PRODUCT,
        PERMISSIONS.DELETE_PRODUCT,
        PERMISSIONS.VIEW_PRODUCT,
      ],
    },

    // ADMIN
    {
      role: SYSTEM_ROLES.ADMIN,
      permissions: Object.values(PERMISSIONS),
    },

    // SUPER ADMIN
    {
      role: SYSTEM_ROLES.SUPER_ADMIN,
      permissions: Object.values(PERMISSIONS),
    },
  ];

  const data = mappings.flatMap(({ role, permissions }) => {
    const roleId = roleMap.get(role);

    if (!roleId) {
      throw new Error(`Role '${role}' not found.`);
    }

    return permissions.map((permission) => {
      const permissionId = permissionMap.get(permission);

      if (!permissionId) {
        throw new Error(`Permission '${permission}' not found.`);
      }

      return {
        roleId,
        permissionId,
        assignedAt: new Date(),
      };
    });
  });

  await prisma.rolePermission.createMany({
    data,
    skipDuplicates: true,
  });
};
