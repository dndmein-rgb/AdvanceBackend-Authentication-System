"use client";

import { useEffect, useRef, useState } from "react";
import {
  getCurrentUser,
  refreshAccessToken,
} from "@/features/auth/services/auth.api";

interface User {
  id: string;
  email: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    initialized.current = true;

    const init = async () => {
      try {

        await refreshAccessToken();

        const currentUser = await getCurrentUser();

        setUser(currentUser);
      } catch (error) {
        console.error("Authentication failed:", error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <div className="mt-6 rounded-lg border p-6">
          <h2 className="text-xl font-semibold">Welcome</h2>

          <div className="mt-4 space-y-2">
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Created:</strong> {user.createdAt}
            </p>
            <p>
              <strong>User ID:</strong> {user.id}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}