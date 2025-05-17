import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppThemeProvider } from "@/components/providers/appThemeProvider";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { AuthProvider } from "@/components/providers/authProvider";

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

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppThemeProvider>
          <AuthProvider>
            <NextIntlClientProvider>{children}</NextIntlClientProvider>
          </AuthProvider>
        </AppThemeProvider>
      </body>
    </html>
  );
}
