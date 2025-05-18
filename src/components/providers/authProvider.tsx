"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect } from "react";
import { useSignerStatus, useLogout, useAuthenticate, useUser } from "@account-kit/react";
import type { User } from "@account-kit/signer";

type AuthMethod = "google" | "email";

const AuthContext = createContext<{
  user: User | null;
  signIn?: (method: AuthMethod) => Promise<void>;
  signOut?: () => Promise<void>;
}>({ user: null });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const { isConnected, isDisconnected, isAuthenticating } = useSignerStatus();
  const { logout } = useLogout({
    onSuccess: () => {
      router.push("/login");
    },
  });
  const { authenticate } = useAuthenticate();
  const user = useUser();

  useEffect(() => {
    if (isDisconnected) {
      router.push("/login");
    }
    if (isConnected) {
      router.push("/dashboard");
    } else if (isAuthenticating) {
      router.push("/");
    }
  }, [isAuthenticating, isConnected, isDisconnected, router]);

  const handleGooglePopupLogin = () => {
    authenticate({
      type: "oauth",
      authProviderId: "google",
      mode: "popup",
    });
  };

  const signIn = async (method: string) => {
    if (method === "google") handleGooglePopupLogin();
  };

  const signOut = async () => {
    await logout();
  };

  return <AuthContext.Provider value={{ user, signIn, signOut }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
