import type { User } from "@/generated/prisma/client";
import { createUserData, IAuthRepository } from "./auth.interface";
import { prisma } from "@/infrastructure/database";

export class  AuthRepository implements IAuthRepository{
  async createUser(data: createUserData): Promise<User> {
    return await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        authProvider:"EMAIL"
      }
    })
  }

  async findUserByEmail(email: string):Promise<User | null> {
    return await prisma.user.findUnique({
      where:{email}
    })
  }
}