-- DropIndex
DROP INDEX "User_email_idx";

-- AlterTable
ALTER TABLE "RolePermission" ALTER COLUMN "assignedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "UserRole" ADD COLUMN     "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
