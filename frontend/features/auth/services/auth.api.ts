import { api, setAccessToken } from "@/lib/api";

interface RefreshTokenResponse {
  success: boolean;
  data: {
    accessToken: string;
  };
}

interface CurrentUserResponse {
  success: boolean;
  data: {
      id: string;
      email: string;
      createdAt: string;
    
  };
}

export const refreshAccessToken = async (): Promise<string> => {
  console.trace("🔥 refreshAccessToken CALLED");

  const response = await api.post<RefreshTokenResponse>(
    "/api/v1/auth/refresh-token",
  );

  const accessToken = response.data.data.accessToken
  setAccessToken(accessToken);

  return accessToken;
};

export const getCurrentUser = async () => {
  const response = await api.get<CurrentUserResponse>(
    "/api/v1/auth/me",
  );

  return response.data.data;
};