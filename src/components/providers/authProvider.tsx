"use client";

import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<{
  user: User | null;
  signIn?: () => Promise<void>;
  signOut?: () => Promise<void>;
}>({ user: null });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        localStorage.setItem("daxfi:user", JSON.stringify(firebaseUser));
        router.push("/dashboard");
      } else {
        setUser(null);
        localStorage.removeItem("daxfi:user");
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("[SignIn Error]", err);
    }
  };

  const signOut = async () => {
    await auth.signOut();
  };
  return <AuthContext.Provider value={{ user, signIn, signOut }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
