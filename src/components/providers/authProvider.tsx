"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect } from "react";
import {
  useSignerStatus,
  useLogout,
  useAuthenticate,
  useUser,
  useSigner,
} from "@account-kit/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import type { User } from "@account-kit/signer";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  setDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { generateHandle, walletAddressToHandle } from "@/lib/utils";
import { getPendingAmountForEmail, claimFundsForEmail } from "@/app/utils/contracts";
import provider from "@/lib/provider";

type AuthMethod = "google" | "email";

const AuthContext = createContext<{
  user: User | null;
  handle: string | null;
  isLoading: boolean;
  signIn?: (method: AuthMethod) => Promise<void>;
  signOut?: () => Promise<void>;
}>({ user: null, handle: null, isLoading: true });

// TODO: Refactor isOnDaxFi logic.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const redirectParam = searchParams.get("redirect") || "/dashboard";

  const [redirectPath] = useState(redirectParam);

  const { isConnected, isDisconnected, isAuthenticating } = useSignerStatus();
  const { logout } = useLogout({
    onSuccess: () => {
      window.location.href = "/login";
    },
  });
  const { authenticate } = useAuthenticate();
  const user = useUser();
  const signer = useSigner();

  const [handle, setHandle] = useState<string | null>(null);

  const isLoading = (isConnected && !user) || isAuthenticating;

  useEffect(() => {
    if (!user) return;

    const fetchHandle = async () => {
      try {
        const userWalletAddress = user.address as `0x${string}`;
        const userHandle = await walletAddressToHandle(userWalletAddress);
        setHandle(userHandle);
      } catch (error) {
        console.error("Error fetching user handle:", error);
      }
    };

    fetchHandle();
  }, [user]);

  useEffect(() => {
    const syncUserToFirestore = async () => {
      if (!user) return;
      if (!signer) return;

      try {
        const { address } = user;
        const userRef = doc(db, "users", user.userId);
        const docSnap = await getDoc(userRef);

        const isUserOnDaxFi = docSnap.exists();
        if (!isUserOnDaxFi) {
          const signerAddress = await signer?.getAddress();

          const amount = BigInt(await getPendingAmountForEmail(user?.email));
          if (amount > 0) {
            const tx = await claimFundsForEmail({
              signer,
              email: user.email!,
              recipientAddress: signerAddress,
            });
            await provider.waitForTransaction(tx.hash!);

            const q = query(
              collection(db, "pendingTransfers"),
              where("recipientEmail", "==", user.email!),
            );
            const querySnapshot = await getDocs(q);

            const updates = querySnapshot.docs.map(async (docSnap) => {
              const ref = doc(db, "pendingTransfers", docSnap.id);

              console.log("CLAIMED AND SETTING CLAIMED AS TRUE");
              await updateDoc(ref, {
                claimed: true,
                successTransactionHash: tx.hash,
                recipientWallet: await signer.getAddress(),
              });
            });

            await Promise.all(updates);
          }

          await setDoc(userRef, {
            email: user.email?.toLowerCase() || null,
            walletAddress: address,
            createdAt: new Date().toISOString(),
            handle: generateHandle(user.email),
          });
        }

        if ((isConnected && pathname === "/") || (pathname === "/login" && isConnected)) {
          router.push(redirectPath);
        } else if (isAuthenticating && pathname === "/") {
          router.push("/");
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

  return (
    <AuthContext.Provider value={{ user, handle, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
