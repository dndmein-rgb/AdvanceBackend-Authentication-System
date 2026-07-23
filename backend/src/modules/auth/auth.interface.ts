import { User } from "@/generated/prisma/client";

export interface createUserData {
  readonly email: string;
  readonly passwordHash: string;
}


export interface IAuthRepository {
  createUser(data: createUserData): Promise<User>;

  findUserByEmail(email: string): Promise<User | null>;
}
