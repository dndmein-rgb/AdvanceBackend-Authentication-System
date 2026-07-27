import {prisma} from "../src/infrastructure/database/index"
import { seedRoles } from "./seeds/roles.seed";
import { seedPermissions } from "./seeds/permissions.seed";
import { seedRolePermissions } from "./seeds/role-permissions.seed";
import { seedAdmin } from "./seeds/admin.seed";


async function main() {
  console.log("🌱 Seeding database...");

  await seedRoles(prisma);
  console.log("✓ Roles seeded");

  await seedPermissions(prisma);
  console.log("✓ Permissions seeded");

  await seedRolePermissions(prisma);
  console.log("✓ Role permissions seeded");

  await seedAdmin(prisma);
  console.log("✓ Admin user seeded");

  console.log("🎉 Database seeded successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });