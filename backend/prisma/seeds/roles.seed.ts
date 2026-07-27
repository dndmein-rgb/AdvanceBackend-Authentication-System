import { PrismaClient } from "../../src/generated/prisma/client";
import { SYSTEM_ROLES } from "../../src/common/constants/roles";
export const seedRoles = async (prisma: PrismaClient):Promise<void> => {
  await prisma.role.createMany({
    data: Object.values(SYSTEM_ROLES).map((name) => ({
      name,
    })),
    skipDuplicates: true,
  });
};
