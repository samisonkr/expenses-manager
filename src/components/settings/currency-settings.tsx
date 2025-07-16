
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { currencies } from "@/lib/currencies";
import { useToast } from "@/hooks/use-toast";

interface CurrencySettingsProps {
  selectedCurrency: string;
  onCurrencyChange: (currency: string) => void;
}

export function CurrencySettings({ selectedCurrency, onCurrencyChange }: CurrencySettingsProps) {
  const { toast } = useToast();

  const handleCurrencyChange = (value: string) => {
    onCurrencyChange(value);
    toast({
        title: "Currency Updated",
        description: `The default currency has been set to ${value}.`
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Currency</CardTitle>
        <CardDescription>
          Select the default currency for the application.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Select onValueChange={handleCurrencyChange} value={selectedCurrency}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Select a currency" />
          </SelectTrigger>
          <SelectContent>
            {currencies.map((currency) => (
              <SelectItem key={currency.code} value={currency.code}>
                {currency.name} ({currency.symbol})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
