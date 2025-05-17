"use client";

import { ThemeProvider as MTWProvider } from "@material-tailwind/react";

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  return <MTWProvider>{children}</MTWProvider>;
}
