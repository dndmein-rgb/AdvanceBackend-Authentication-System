import type {
  AuthAccount,
  AuthProvider,
  Session,
  User,
} from "@/generated/prisma/client";
import { IAuthRepository } from "./auth.interface";
import { prisma } from "@/infrastructure/database";
import {
  AuthAccountWithUserType,
  CreateAuthAccountDTO,
  CreateSessionDTO,
  CreateUserDTO,
  CurrentUserType,
  RotateSessionDTO,
  UserRoleWithPermissionsType,
} from "./auth.types";

import { Prisma } from "@/generated/prisma/client";
export type PrismaTransaction = Prisma.TransactionClient;

export class AuthRepository implements IAuthRepository {
  async withTransaction<T>(
    callback: (tx: PrismaTransaction) => Promise<T>,
  ): Promise<T> {
    return prisma.$transaction(async (tx) => {
      return callback(tx);
    });
  }
  async createUser(data: CreateUserDTO, tx?: PrismaTransaction): Promise<User> {
    const client = tx ?? prisma;

    return client.user.create({
      data,
    });
  }

  async findUserByEmail(
    email: string,
    tx?: PrismaTransaction,
  ): Promise<User | null> {
    const client = tx ?? prisma;

    return client.user.findUnique({
      where: {
        email,
      },
    });
  }
  async createSession(
    data: CreateSessionDTO,
    tx?: PrismaTransaction,
  ): Promise<Session> {
    const client = tx ?? prisma;

    return client.session.create({
      data,
    });
  }
  async findActiveSessionById(sessionId: string): Promise<Session | null> {
    return await prisma.session.findFirst({
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
    return prisma.session.update({
      where: {
        id: sessionId,
      },
      data: {
        revokedAt: new Date(),
      },
    });
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

  async findAuthAccount(
    provider: AuthProvider,
    providerAccountId: string,
  ): Promise<AuthAccountWithUserType | null> {
    return prisma.authAccount.findUnique({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId,
        },
      },
      include: { user: true },
    });
  }
  async createAuthAccount(
    data: CreateAuthAccountDTO,
    tx?: PrismaTransaction,
  ): Promise<AuthAccount> {
    const client = tx ?? prisma;

    return client.authAccount.create({
      data,
    });
  }
}
