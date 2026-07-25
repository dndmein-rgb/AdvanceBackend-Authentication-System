import { Session, User } from "@/generated/prisma/client";
import {
  CreateSessionDTO,
  CreateUserDTO,
  RotateSessionDTO,
} from "./auth.types";

export interface IAuthRepository {
  createUser(data: CreateUserDTO): Promise<User>;

  findUserByEmail(email: string): Promise<User | null>;

  createSession(data: CreateSessionDTO): Promise<Session>;

  findActiveSessionById(sessionId: string): Promise<Session | null>;

  rotateSessionRefreshToken(data: RotateSessionDTO): Promise<Session>;

  revokeSession(sessionId: string): Promise<Session>;

  revokeAllSessions(userId: string): Promise<number>;
}
