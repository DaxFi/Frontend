import { createConfig, cookieStorage } from "@account-kit/react";
import { QueryClient } from "@tanstack/react-query";
import { alchemy } from "@account-kit/infra";
import { wonderTestnetAlchemy } from "./chains";

export const config = createConfig(
  {
    // alchemy config
    transport: alchemy({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "" }),
    chain: wonderTestnetAlchemy,
    ssr: true,
    storage: cookieStorage, // persist the account state using cookies
    enablePopupOauth: true,
    // optional config to override default session manager config
    sessionConfig: {
      expirationTimeMs: 1000 * 60 * 60 * 4, // 4 hours
    },
  },
  {
    // authentication ui config - your customizations here
    auth: {
      sections: [
        [{ type: "email" }],
        [{ type: "passkey" }, { type: "social", authProviderId: "google", mode: "popup" }],
      ],
      addPasskeyOnSignup: false, // disable passkey creation on signup
    },
  },
);

export const queryClient = new QueryClient();
