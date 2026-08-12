import {
  AuthAccount,
  AuthProvider,
  Prisma,
  Session,
  User,
} from "@/generated/prisma/client";

import {
  AuthAccountWithUserType,
  CreateAuthAccountDTO,
  CreateSessionDTO,
  CreateUserDTO,
  CurrentUserDTO,
  RotateSessionDTO,
  UserRoleWithPermissionsType,
} from "./auth.types";

export type PrismaTransaction = Prisma.TransactionClient;

export interface IAuthRepository {
  createUser(
    data: CreateUserDTO,
    tx?: PrismaTransaction,
  ): Promise<User>;

  createAuthAccount(
    data: CreateAuthAccountDTO,
    tx?: PrismaTransaction,
  ): Promise<AuthAccount>;

  findUserByEmail(
    email: string,
    tx?: PrismaTransaction,
  ): Promise<User | null>;

  createSession(
    data: CreateSessionDTO,
    tx?: PrismaTransaction,
  ): Promise<Session>;

  withTransaction<T>(
    callback: (tx: PrismaTransaction) => Promise<T>,
  ): Promise<T>;

  findActiveSessionById(
    sessionId: string,
  ): Promise<Session | null>;

  rotateSessionRefreshToken(
    data: RotateSessionDTO,
  ): Promise<Session>;

  revokeSession(
    sessionId: string,
  ): Promise<Session>;

  revokeAllSessions(
    userId: string,
  ): Promise<number>;

  findUserById(
    userId: string,
  ): Promise<CurrentUserDTO | null>;

  getUserPermissions(
    userId: string,
  ): Promise<UserRoleWithPermissionsType[]>;

  findUserIdsByRole(
    roleId: string,
  ): Promise<string[]>;

  findAuthAccount(
    provider: AuthProvider,
    providerAccountId: string,
  ): Promise<AuthAccountWithUserType | null>;
}