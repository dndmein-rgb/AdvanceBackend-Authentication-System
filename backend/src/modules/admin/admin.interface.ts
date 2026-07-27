import { Permission } from "@/common/constants/permissions";
import { User } from "@/generated/prisma/client";

export interface IAdminRepository {
  getUserPermissions(userId: string): Promise<Permission[]>;

  getAllUsers():Promise<User[]>
}
