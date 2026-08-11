"use client"
import { getOAuthGoogleUrl } from "@/features/auth/services/oauth.api";
import { Button } from "./ui/button";

export default function GoogleLoginButton() {
  const handleGoogleLogin = async () => {
    try {
      const url = await getOAuthGoogleUrl();
      window.location.href = url;
    } catch (error) {
      console.error(error);

      alert("Failed to start Google login");
    }
  };
  return (
    <Button
      onClick={handleGoogleLogin}
      className="rounded-md border px-4 py-2 cursor-pointer hover:bg-gray-900"
    >
      Continue with Google
    </Button>
  );
}
