"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect } from "react";
import { useSignerStatus, useLogout, useAuthenticate, useUser } from "@account-kit/react";
import type { User } from "@account-kit/signer";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { generateHandle } from "@/lib/utils";

type AuthMethod = "google" | "email";

const AuthContext = createContext<{
  user: User | null;
  signIn?: (method: AuthMethod) => Promise<void>;
  signOut?: () => Promise<void>;
}>({ user: null });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const { isConnected, isDisconnected, isAuthenticating } = useSignerStatus();
  const { logout } = useLogout({
    onSuccess: () => {
      router.push("/login");
    },
  });
  const { authenticate } = useAuthenticate();
  const user = useUser();

  useEffect(() => {
    const syncUserToFirestore = async () => {
      if (!user) return;

      try {
        const { address } = user;
        const userRef = doc(db, "users", user.userId);
        const docSnap = await getDoc(userRef);

        if (!docSnap.exists()) {
          await setDoc(userRef, {
            email: user.email?.toLowerCase() || null,
            walletAddress: address,
            createdAt: new Date().toISOString(),
            handle: generateHandle(user.email),
          });
        }
      } catch (err) {
        console.error("Failed to sync user to Firestore", err);
      }
    };

    if (isConnected && user) {
      syncUserToFirestore();
    }
    if (isDisconnected) {
      router.push("/login");
    }
    if ((isConnected && pathname === "/") || pathname === "/login") {
      router.push("/dashboard");
    } else if (isAuthenticating && pathname === "/") {
      router.push("/");
    }
  }, [isAuthenticating, isConnected, isDisconnected]);

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
