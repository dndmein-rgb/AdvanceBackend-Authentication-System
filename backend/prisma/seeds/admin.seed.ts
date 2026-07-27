import argon2 from "argon2";

import { PrismaClient } from "../../src/generated/prisma/client";

import { SYSTEM_ROLES } from "../../src/common/constants/roles";

export const seedAdmin = async (prisma: PrismaClient): Promise<void> => {
  const admin = await prisma.user.upsert({
    where: {
      email: "admin@example.com",
    },
    update: {},
    create: {
      email: "admin@example.com",
      passwordHash: await argon2.hash("Admin@123"),
      authProvider: "EMAIL",
      isEmailVerified: true,
    },
  });

  const adminRole = await prisma.role.findUnique({
    where: {
      name: SYSTEM_ROLES.ADMIN,
    },
  });

  if (!adminRole) {
    throw new Error("Admin role not found.");
  }

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: admin.id,
        roleId: adminRole.id,
      },
    },
    update: {},
    create: {
      userId: admin.id,
      roleId: adminRole.id,
    },
  });
};
