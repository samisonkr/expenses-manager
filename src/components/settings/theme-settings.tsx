"use client";

import { useTheme, themes, ThemeId, ThemeMode } from "@/components/theme/theme-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Sun, Moon, Laptop } from "lucide-react";

const ThemePreview = ({ themeId }: { themeId: ThemeId }) => (
  <div className={cn("p-2", `theme-${themeId}`)}>
    <div className="flex space-x-2 rounded-md bg-background p-2 border">
      <div className="h-5 w-5 rounded-full bg-primary" />
      <div className="h-5 w-5 rounded-full bg-accent" />
      <div className="h-5 w-5 rounded-full bg-card" />
    </div>
  </div>
);

export function ThemeSettings() {
  const { colorTheme, setColorTheme, themeMode, setThemeMode } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Theme</CardTitle>
        <CardDescription>
          Select a visual theme and mode for the application.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="mb-2 text-sm font-medium">Color Palette</h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {themes.map((t) => (
              <div key={t.id} className="relative">
                <Button
                  variant="outline"
                  className={cn(
                    "h-auto w-full flex-col space-y-2 justify-start p-2",
                    colorTheme === t.id && "border-primary border-2"
                  )}
                  onClick={() => setColorTheme(t.id)}
                >
                  <ThemePreview themeId={t.id} />
                  <span className="text-sm font-medium">{t.name}</span>
                </Button>
                {colorTheme === t.id && (
                  <Check className="absolute right-3 top-3 h-5 w-5 text-primary" />
                )}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-2 text-sm font-medium">Mode</h3>
          <div className="inline-flex gap-1 rounded-lg bg-muted p-1">
            <Button
              size="sm"
              variant={themeMode === "light" ? "default" : "ghost"}
              onClick={() => setThemeMode("light")}
              className="w-28"
            >
              <Sun className="mr-2 h-4 w-4" /> Light
            </Button>
            <Button
              size="sm"
              variant={themeMode === "dark" ? "default" : "ghost"}
              onClick={() => setThemeMode("dark")}
              className="w-28"
            >
              <Moon className="mr-2 h-4 w-4" /> Dark
            </Button>
            <Button
              size="sm"
              variant={themeMode === "system" ? "default" : "ghost"}
              onClick={() => setThemeMode("system")}
              className="w-28"
            >
              <Laptop className="mr-2 h-4 w-4" /> System
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
