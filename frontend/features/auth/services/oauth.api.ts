import { api } from "@/lib/api"

type GoogleAuthResponse = {
  success: boolean;
  message: string;
  data: {
    url: string;
  };
};

export const getOAuthGoogleUrl = async (): Promise<string> => {
  
  const response = await api.get<GoogleAuthResponse>(
    "/api/v1/oauth/google",
  );

  return response.data.data.url;
};  