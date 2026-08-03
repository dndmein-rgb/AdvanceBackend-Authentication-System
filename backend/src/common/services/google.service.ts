import { env } from "@/config/env";
import { OAuth2Client } from "google-auth-library";
import { AppError } from "../errors/app-error";
console.log(env.GOOGLE_REDIRECT_URL);
const googleClient = new OAuth2Client(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  env.GOOGLE_REDIRECT_URL,
);

export class GoogleService {
  generateAuthUrl(state: string): string{
    return googleClient.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: ["openid", "email", "profile"],
      state
    })
  }
  async exchangeCodeForTokens(code: string) {
    const { tokens } = await googleClient.getToken(code)
    if (!tokens.id_token) {
         throw new AppError("Google did not return an ID token",502);
       }
   
       return tokens;
    
  }

  async verifyToken(idToken: string) {
    const ticket =await googleClient.verifyIdToken({
      idToken,
      audience:env.GOOGLE_CLIENT_ID
    })
    const payload = ticket.getPayload();
 
     if (!payload) {
       throw new AppError("Unable to verify Google ID token",401);
     }
 
     return payload;
  }
}

export const googleService=new GoogleService()
