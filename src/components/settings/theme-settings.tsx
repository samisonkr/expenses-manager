"use client";

import { useTheme, themes, ThemeId } from "@/components/theme/theme-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

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
  const { theme, setTheme } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Theme</CardTitle>
        <CardDescription>
          Select a visual theme for the application.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {themes.map((t) => (
          <div key={t.id} className="relative">
            <Button
              variant="outline"
              className={cn(
                "h-auto w-full flex-col p-2 space-y-2 justify-start",
                theme === t.id && "border-primary border-2"
              )}
              onClick={() => setTheme(t.id)}
            >
              <ThemePreview themeId={t.id} />
              <span className="text-sm font-medium">{t.name}</span>
            </Button>
            {theme === t.id && (
              <Check className="w-5 h-5 absolute top-3 right-3 text-primary" />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
