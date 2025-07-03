import { PatternDisplay } from "@/components/insights/pattern-display";

export default function InsightsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <h1 className="font-headline text-2xl font-bold md:text-3xl">
        Smart Insights
      </h1>
      <p className="text-muted-foreground">
        Let AI analyze your spending habits and uncover interesting patterns.
      </p>
      <PatternDisplay />
    </div>
  );
}
