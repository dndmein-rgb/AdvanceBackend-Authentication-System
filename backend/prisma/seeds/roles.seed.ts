import { PrismaClient } from "../../src/generated/prisma/client";
import { SYSTEM_ROLES } from "../../src/common/constants/roles";

export const seedRoles = async (
  prisma: PrismaClient,
): Promise<void> => {
  const roles = [
    {
      name: SYSTEM_ROLES.USER,
      isSystem: false,
    },
    {
      name: SYSTEM_ROLES.SELLER,
      isSystem: false,
    },
    {
      name: SYSTEM_ROLES.ADMIN,
      isSystem: true,
    },
    {
      name: SYSTEM_ROLES.SUPER_ADMIN,
      isSystem: true,
    },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: {
        name: role.name,
      },
      update: {
        isSystem: role.isSystem,
      },
      create: role,
    });
  }
};