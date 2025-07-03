"use client";

import { createContext, useContext, useEffect, useState } from "react";

export const themes = [
  { id: "default", name: "Default" },
  { id: "forest", name: "Forest" },
  { id: "sunset", name: "Sunset" },
  { id: "ocean", name: "Ocean" },
] as const;

export type ThemeId = (typeof themes)[number]["id"];

type ThemeProviderState = {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
};

const initialState: ThemeProviderState = {
  theme: "default",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeId>("default");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as ThemeId;
    if (storedTheme && themes.some((t) => t.id === storedTheme)) {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    const body = window.document.body;

    themes.forEach((t) => {
      body.classList.remove(`theme-${t.id}`);
    });

    if (theme) {
      body.classList.add(`theme-${theme}`);
    }
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme: ThemeId) => {
      localStorage.setItem("theme", newTheme);
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
