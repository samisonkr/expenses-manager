
"use client"
import { CategoryManagement } from "@/components/settings/category-management";
import { PaymentMethods } from "@/components/settings/payment-methods";
import { ThemeSettings } from "@/components/settings/theme-settings";
import { SyncToFirebase } from "@/components/settings/sync-to-firebase";
import { useAppData } from "@/hooks/use-app-data";
import { useAuth } from "@/components/auth/auth-provider";
import { CurrencySettings } from "@/components/settings/currency-settings";

export default function SettingsPage() {
  const { accounts, categories, incomeCategories, addCategory, addSubcategory, currency, setCurrency } = useAppData();
  const { authMode } = useAuth();
  
  return (
    <div className="flex flex-1 flex-col gap-6">
      <h1 className="font-headline text-2xl font-bold md:text-3xl">
        Settings
      </h1>
      {authMode === 'guest' && <SyncToFirebase />}
      <ThemeSettings />
      <CurrencySettings selectedCurrency={currency} onCurrencyChange={setCurrency} />
      <PaymentMethods accounts={accounts} />
      <CategoryManagement
        expenseCategories={categories}
        incomeCategories={incomeCategories}
        onAddCategory={addCategory}
        onAddSubcategory={addSubcategory}
      />
    </div>
  );
}
