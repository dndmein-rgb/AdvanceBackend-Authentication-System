import { AppError } from "@/common/errors/app-error";
import { PasswordService } from "@/common/services/password.service";

import { toUserResponse } from "./auth.mapper";

import type { IAuthRepository } from "./auth.interface";
import type { LoginUserDTO, RegisterUserDTO } from "./auth.schema";
import type { UserResponse } from "./auth.response";

export class AuthService {
  constructor(private readonly authRepo: IAuthRepository) {}

  async register(data: RegisterUserDTO): Promise<UserResponse> {
    const existingUser = await this.authRepo.findUserByEmail(data.email);

    if (existingUser) {
      throw new AppError("User already exists", 400);
    }
    const passwordHash = await PasswordService.hash(data.password);

    const user = await this.authRepo.createUser({
      email: data.email,
      passwordHash,
    });
    return toUserResponse(user);
  }

  async login(data: LoginUserDTO):Promise<UserResponse> {
    const user = await this.authRepo.findUserByEmail(data.email);

    if (!user) {
      throw new AppError("Invalid email or passoword", 401);
    }

    if (!user.passwordHash) {
      throw new AppError("Invalid login method",400)
    }

    const isPasswordValid=await PasswordService.verify(data.password, user.passwordHash)

    
    if (!isPasswordValid) {
      throw new AppError(
        "Invalid email or password",
        401,
      );
    }


    return toUserResponse(user);
  }
  }

