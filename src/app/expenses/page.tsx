import { ExpensesList } from "@/components/expenses/expenses-list";
import {
  expenses,
  categories,
  paymentMethods,
} from "@/lib/data";

export default function ExpensesPage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <ExpensesList
        initialExpenses={expenses}
        categories={categories}
        paymentMethods={paymentMethods}
      />
    </div>
  );
}
