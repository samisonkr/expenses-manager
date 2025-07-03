"use client";

import { createContext, useContext, useEffect, useState } from "react";

export const themes = [
  { id: "default", name: "Default" },
  { id: "forest", name: "Forest" },
  { id: "sunset", name: "Sunset" },
  { id: "ocean", name: "Ocean" },
  { id: "yellow", name: "Yellow" },
] as const;

export type ThemeId = (typeof themes)[number]["id"];
export type ThemeMode = "light" | "dark" | "system";

type ThemeProviderState = {
  colorTheme: ThemeId;
  setColorTheme: (theme: ThemeId) => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
};

const initialState: ThemeProviderState = {
  colorTheme: "default",
  setColorTheme: () => null,
  themeMode: "system",
  setThemeMode: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorTheme, _setColorTheme] = useState<ThemeId>("default");
  const [themeMode, _setThemeMode] = useState<ThemeMode>("system");

  useEffect(() => {
    const storedColorTheme = localStorage.getItem("app-color-theme") as ThemeId;
    if (storedColorTheme && themes.some((t) => t.id === storedColorTheme)) {
      _setColorTheme(storedColorTheme);
    }
    const storedThemeMode = localStorage.getItem(
      "app-theme-mode"
    ) as ThemeMode;
    if (
      storedThemeMode &&
      ["light", "dark", "system"].includes(storedThemeMode)
    ) {
      _setThemeMode(storedThemeMode);
    }
  }, []);

  useEffect(() => {
    const body = window.document.body;
    const root = window.document.documentElement;

    // Apply color theme class to body
    themes.forEach((t) => {
      body.classList.remove(`theme-${t.id}`);
    });
    body.classList.add(`theme-${colorTheme}`);

    // Apply dark/light class to html
    const isDark =
      themeMode === "dark" ||
      (themeMode === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    root.classList.toggle("dark", isDark);
  }, [colorTheme, themeMode]);

  // Listener for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      if (themeMode === "system") {
        const root = window.document.documentElement;
        root.classList.toggle("dark", mediaQuery.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [themeMode]);

  const value = {
    colorTheme,
    setColorTheme: (newColorTheme: ThemeId) => {
      localStorage.setItem("app-color-theme", newColorTheme);
      _setColorTheme(newColorTheme);
    },
    themeMode,
    setThemeMode: (newThemeMode: ThemeMode) => {
      localStorage.setItem("app-theme-mode", newThemeMode);
      _setThemeMode(newThemeMode);
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
