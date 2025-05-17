"use client";

import { auth } from "@/lib/firebase";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  User,
} from "firebase/auth";
import { wonderTestnet } from "@/config/chains";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

const AuthContext = createContext<{
  user: any | null;
  address: string | null;
  signIn?: () => Promise<void>;
  signOut?: () => Promise<void>;
}>({ user: null, address: null });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [user, setUser] = useState<any | null>(null);
  const [address, setAddress] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser: User | null) => {
        if (firebaseUser) {
          setUser(firebaseUser);
          localStorage.setItem("daxfi:user", JSON.stringify(firebaseUser));
          router.push("/dashboard");
        } else {
          setUser(null);
          localStorage.removeItem("daxfi:user");
          router.push("/login");
        }
      },
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function init() {
      const account = privateKeyToAccount(
        "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      ); // MOCK
      const walletClient = createWalletClient({
        account,
        chain: wonderTestnet,
        transport: http("http://rpc.testnet.wonderchain.org/"),
      });

      const { address } = walletClient.account;

      setAddress(address);

      if (!user) {
        router.push("/login");
      }
    }

    init();
  }, []);

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
  return (
    <AuthContext.Provider value={{ user, address, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
