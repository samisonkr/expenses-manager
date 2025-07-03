
"use client"
import { PatternDisplay } from "@/components/insights/pattern-display";
import { useAppData } from "@/hooks/use-app-data";

export default function InsightsPage() {
  const { expenses } = useAppData();
  return (
    <div className="flex flex-1 flex-col gap-6">
      <h1 className="font-headline text-2xl font-bold md:text-3xl">
        Smart Insights
      </h1>
      <p className="text-muted-foreground">
        Let AI analyze your spending habits and uncover interesting patterns.
      </p>
      <PatternDisplay expenses={expenses} />
    </div>
  );
}
