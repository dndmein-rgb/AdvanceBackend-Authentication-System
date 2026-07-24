import crypto from "crypto";
export class TokenService {
  private constructor() {}

  static hashRefreshToken(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
  }
  static generateRefreshToken(): string {
    return crypto.randomBytes(64).toString("hex");
  }
}
