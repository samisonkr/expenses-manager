import { PaymentMethods } from "@/components/settings/payment-methods";
import { accounts } from "@/lib/data";

export default function SettingsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <h1 className="font-headline text-2xl font-bold md:text-3xl">
        Settings
      </h1>
      <PaymentMethods accounts={accounts} />
    </div>
  );
}
