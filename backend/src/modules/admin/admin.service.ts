import { AppError } from "@/common/errors/app-error";
import { IAdminRepository } from "./admin.interface";
import { AuthServiceDTO } from "./admin.types";
import { User } from "@/generated/prisma/client";

export class AdminService{
  constructor(private readonly adminRepo: IAdminRepository) { }

  async authorize(data: AuthServiceDTO):Promise<void> {
    const permissions = await this.adminRepo.getUserPermissions(data.userId)
    if (!permissions.includes(data.permission)) {
      throw new AppError("Forbidden",403)
    }
  }
  async getAllUsers(): Promise<User[]>{
    const users = await this.adminRepo.getAllUsers()
    return users;
  }
}