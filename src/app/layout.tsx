import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { AuthProvider } from "@/components/providers/authProvider";
import { Providers as AlchemyProvider } from "@/components/providers/alchemyProvider";
import { cookieToInitialState } from "@account-kit/core";
import { headers } from "next/headers";
import { config } from "@/config/alchemy";
import { AppThemeProvider } from "@/components/providers/appThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DaxFi - Send stablecoins without wallets",
  description:
    "DaxFi lets you send and receive USDC using just an email, phone number, or @handle.\
   No wallet needed. No gas fees. Borderless, instant payments made simple.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  const initialState = cookieToInitialState(config, (await headers()).get("cookie") ?? undefined);

  return (
    <html lang={locale}>
      <AppThemeProvider>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <AlchemyProvider initialState={initialState}>
            <AuthProvider>
              <NextIntlClientProvider>{children}</NextIntlClientProvider>
            </AuthProvider>
          </AlchemyProvider>
        </body>
      </AppThemeProvider>
    </html>
  );
}
