"use client";

import { useState } from "react";
import { Lightbulb } from "lucide-react";

import { discoverExpensePatterns } from "@/ai/flows/discover-patterns";
import { expenses } from "@/lib/data"; // Using mock data
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export function PatternDisplay() {
  const [patterns, setPatterns] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDiscoverPatterns = async () => {
    setIsLoading(true);
    setPatterns("");
    try {
      const result = await discoverExpensePatterns({
        expenses: JSON.stringify(expenses),
      });
      setPatterns(result.patterns);
    } catch (error) {
      console.error("AI pattern discovery failed:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Could not discover spending patterns.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Lightbulb className="text-primary" />
          Spending Patterns
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleDiscoverPatterns} disabled={isLoading}>
          {isLoading ? "Analyzing..." : "Discover Patterns with AI"}
        </Button>
        {isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[80%]" />
          </div>
        )}
        {patterns && (
          <div className="max-w-none rounded-lg border bg-accent/20 p-4 text-sm">
            <p>{patterns}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
