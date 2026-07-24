import { Session, User } from "@/generated/prisma/client";
import { CreateSessionDTO, CreateUserDTO } from "./auth.types";




export interface IAuthRepository {
  createUser(data: CreateUserDTO): Promise<User>;

  findUserByEmail(email: string): Promise<User | null>;

  createSession(data:CreateSessionDTO):Promise<Session>
}
