import { PrismaClient } from "../../src/generated/prisma/client";
import { PERMISSIONS } from "../../src/common/constants/permissions";

export const seedPermissions = async (prisma: PrismaClient): Promise<void> => {
  await prisma.permission.createMany({
    data: Object.values(PERMISSIONS).map((name) => ({
      name,
    })),
    skipDuplicates: true,
  });
};
