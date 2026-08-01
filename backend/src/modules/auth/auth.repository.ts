import type { Session, User } from "@/generated/prisma/client";
import { IAuthRepository } from "./auth.interface";
import { prisma } from "@/infrastructure/database";
import {
  CreateSessionDTO,
  CreateUserDTO,
  CurrentUserType,
  RotateSessionDTO,
  UserRoleWithPermissionsType,
} from "./auth.types";

export class AuthRepository implements IAuthRepository {
  async createUser(data: CreateUserDTO): Promise<User> {
    return await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        authProvider: "EMAIL",
      },
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  }
  async createSession(data: CreateSessionDTO): Promise<Session> {
    return await prisma.session.create({
      data,
    });
  }
  async findActiveSessionById(sessionId: string): Promise<Session | null> {
    return await prisma.session.findUnique({
      where: { id: sessionId, revokedAt: null },
    });
  }
  async rotateSessionRefreshToken(data: RotateSessionDTO): Promise<Session> {
    return await prisma.session.update({
      where: { id: data.sessionId },
      data: {
        refreshTokenHash: data.refreshTokenHash,
        expiresAt: data.expiresAt,
      },
    });
  }
  async revokeSession(sessionId: string): Promise<Session> {
    return await prisma.session.delete({ where: { id: sessionId } });
  }
  async revokeAllSessions(userId: string): Promise<number> {
    const result = await prisma.session.updateMany({
      where: { userId, revokedAt: null },
      data: {
        revokedAt: new Date(),
      },
    });
    return result.count;
  }
  async findUserById(userId: string): Promise<CurrentUserType | null> {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });
  }
  async getUserPermissions(
    userId: string,
  ): Promise<UserRoleWithPermissionsType[]> {
    return prisma.userRole.findMany({
      where: {
        userId,
      },
      select: {
        role: {
          select: {
            name: true,

            rolePermissions: {
              select: {
                permission: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }
  async findUserIdsByRole(roleId: string): Promise<string[]> {
    const userRoles = await prisma.userRole.findMany({
      where: {
        roleId,
      },
      select: {
        userId: true,
      },
    });
    return userRoles.map((userRole) => userRole.userId);
  }
}
