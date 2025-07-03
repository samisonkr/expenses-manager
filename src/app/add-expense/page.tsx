import { ExpenseForm } from "@/components/expenses/expense-form";
import { categories, paymentMethods } from "@/lib/data";

export default function AddExpensePage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <h1 className="font-headline text-2xl font-bold md:text-3xl">
        Add New Expense
      </h1>
      <div className="max-w-2xl">
        <ExpenseForm categories={categories} paymentMethods={paymentMethods} />
      </div>
    </div>
  );
}
