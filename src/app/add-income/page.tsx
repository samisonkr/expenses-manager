
"use client"
import { IncomeForm } from "@/components/income/income-form";
import { useRouter } from "next/navigation";

export default function AddIncomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col gap-6">
      <h1 className="font-headline text-2xl font-bold md:text-3xl">
        Add New Income
      </h1>
      <div className="max-w-2xl">
        <IncomeForm onSave={() => router.push("/incomes")} />
      </div>
    </div>
  );
}
