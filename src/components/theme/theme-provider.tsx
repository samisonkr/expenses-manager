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

  // Load saved themes from localStorage on mount
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

  // Effect to apply color theme and explicit light/dark modes
  useEffect(() => {
    const root = window.document.documentElement;

    // Apply color theme
    themes.forEach((t) => {
      root.classList.remove(`theme-${t.id}`);
    });
    root.classList.add(`theme-${colorTheme}`);

    // Handle explicit light/dark modes
    // The 'system' mode is handled in a separate effect
    if (themeMode === 'light') {
      root.classList.remove('dark');
    } else if (themeMode === 'dark') {
      root.classList.add('dark');
    }
  }, [colorTheme, themeMode]);


  // Effect to handle 'system' mode and listen for OS-level changes
  useEffect(() => {
    if (themeMode !== 'system') {
      return;
    }

    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemChange = (e: MediaQueryListEvent) => {
      root.classList.toggle('dark', e.matches);
    };

    // Set initial state for system mode
    root.classList.toggle('dark', mediaQuery.matches);
    
    mediaQuery.addEventListener('change', handleSystemChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemChange);
    };
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
