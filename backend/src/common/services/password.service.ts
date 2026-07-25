import argon2 from "argon2";

export class PasswordService {
  static hash(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1,
    });
  }

  static verify(password: string, hashedPassword: string): Promise<boolean> {
    return argon2.verify(hashedPassword, password);
  }
  static hashRefreshToken(refreshToken: string): Promise<string>{
    return argon2.hash(refreshToken)
  }
  static verifyRefreshToken(refreshToken: string, hash: string): Promise<boolean>{
    return argon2.verify(hash,refreshToken)
  }
}
