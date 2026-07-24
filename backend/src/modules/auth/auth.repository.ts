import type { Session, User } from "@/generated/prisma/client";
import { IAuthRepository } from "./auth.interface";
import { prisma } from "@/infrastructure/database";
import { CreateSessionDTO, CreateUserDTO } from "./auth.types";

export class  AuthRepository implements IAuthRepository{
  async createUser(data: CreateUserDTO): Promise<User> {
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
  async createSession(data: CreateSessionDTO): Promise<Session> {
    return await prisma.session.create({
      data
    })
  }
}