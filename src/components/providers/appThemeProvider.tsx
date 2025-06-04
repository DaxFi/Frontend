// "use client";

// import { ThemeProvider as MTWProvider } from "@material-tailwind/react";

// export function AppThemeProvider({ children }: { children: React.ReactNode }) {
//   return <MTWProvider>{children}</MTWProvider>;
// }

// components/providers/themeProvider.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}>({
  theme: "dark",
  setTheme: () => {},
  toggleTheme: () => {},
});

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  // Load saved theme on mount
  useEffect(() => {
    const stored = localStorage.getItem("daxfi-theme");
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
    }
  }, []);

  // Persist theme and update HTML class
  useEffect(() => {
    localStorage.setItem("daxfi-theme", theme);
    document.documentElement.className = theme;
  }, [theme]);

  // Add toggleTheme logic here
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
