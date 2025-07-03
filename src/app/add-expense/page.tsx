
"use client"
import { ExpenseForm } from "@/components/expenses/expense-form";
import { useRouter } from "next/navigation";

export default function AddExpensePage() {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col gap-6">
      <h1 className="font-headline text-2xl font-bold md:text-3xl">
        Add New Expense
      </h1>
      <div className="max-w-2xl">
        <ExpenseForm onSave={() => router.push("/expenses")} />
      </div>
    </div>
  );
}
