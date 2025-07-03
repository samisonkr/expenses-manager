import { IncomesList } from "@/components/income/incomes-list";
import {
  incomes,
  incomeCategories,
  paymentMethods,
} from "@/lib/data";

export default function IncomesPage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <IncomesList
        initialIncomes={incomes}
        categories={incomeCategories}
        paymentMethods={paymentMethods}
      />
    </div>
  );
}
