import { IncomeForm } from "@/components/income/income-form";
import { incomeCategories, paymentMethods } from "@/lib/data";

export default function AddIncomePage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <h1 className="font-headline text-2xl font-bold md:text-3xl">
        Add New Income
      </h1>
      <div className="max-w-2xl">
        <IncomeForm categories={incomeCategories} paymentMethods={paymentMethods} />
      </div>
    </div>
  );
}
