
"use client"
import { CategoryManagement } from "@/components/settings/category-management";
import { PaymentMethods } from "@/components/settings/payment-methods";
import { ThemeSettings } from "@/components/settings/theme-settings";
import { useAppData } from "@/hooks/use-app-data";

export default function SettingsPage() {
  const { accounts, categories, incomeCategories, addCategory, addSubcategory } = useAppData();
  return (
    <div className="flex flex-1 flex-col gap-6">
      <h1 className="font-headline text-2xl font-bold md:text-3xl">
        Settings
      </h1>
      <ThemeSettings />
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
