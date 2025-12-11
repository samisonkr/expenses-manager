
"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppData } from "@/hooks/use-app-data";
import { Separator } from "@/components/ui/separator";

export default function JournalPage() {
  const { expenses, incomes, transfers, getAccountName, currency } = useAppData();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const debitTransactions = [
    ...expenses.map((e) => ({ 
      id: e.id, 
      sortDate: new Date(e.date), 
      description: e.description,
      amount: e.amount 
    })),
    ...transfers.map((t) => ({ 
      id: `${t.id}-debit`,
      sortDate: new Date(t.date),
      description: `Transfer to ${getAccountName(t.toAccountId)}`,
      amount: t.amount,
    })),
  ].sort((a, b) => b.sortDate.getTime() - a.sortDate.getTime());

  const creditTransactions = [
    ...incomes.map((i) => ({ 
      id: i.id, 
      sortDate: new Date(i.date), 
      description: i.description,
      amount: i.amount
    })),
    ...transfers.map((t) => ({
      id: `${t.id}-credit`,
      sortDate: new Date(t.date),
      description: `Transfer from ${getAccountName(t.fromAccountId)}`,
      amount: t.amount,
    })),
  ].sort((a, b) => b.sortDate.getTime() - a.sortDate.getTime());


  const totalDebits = debitTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  const totalCredits = creditTransactions.reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="flex flex-1 flex-col gap-6">
      <h1 className="font-headline text-2xl font-bold md:text-3xl">Journal</h1>
      <Card>
        <CardHeader className="items-center text-center">
          <CardTitle className="font-headline text-2xl">
            General Journal
          </CardTitle>
          <CardDescription>
            A T-Account view of all your financial transactions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* T-Account Structure */}
          <div className="border-b-2 border-t-2 border-foreground">
            <div className="grid grid-cols-2">
              {/* Debit Column */}
              <div className="border-r-2 border-foreground p-4">
                <h3 className="mb-4 text-center font-bold text-lg">Debit (Dr)</h3>
                <ul className="space-y-2">
                  {debitTransactions.map((tx) => (
                    <li key={tx.id} className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">{tx.sortDate.toLocaleDateString(undefined, { month: '2-digit', day: '2-digit' })}</span>
                      <span className="flex-1 px-2 truncate" title={tx.description}>{tx.description}</span>
                      <span className="font-mono text-destructive">{formatCurrency(tx.amount)}</span>
                    </li>
                  ))}
                  {debitTransactions.length === 0 && (
                      <li className="text-center text-muted-foreground">No debit transactions.</li>
                  )}
                </ul>
              </div>

              {/* Credit Column */}
              <div className="p-4">
                <h3 className="mb-4 text-center font-bold text-lg">Credit (Cr)</h3>
                <ul className="space-y-2">
                   {creditTransactions.map((tx) => (
                    <li key={tx.id} className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">{tx.sortDate.toLocaleDateString(undefined, { month: '2-digit', day: '2-digit' })}</span>
                      <span className="flex-1 px-2 truncate" title={tx.description}>{tx.description}</span>
                      <span className="font-mono text-primary">{formatCurrency(tx.amount)}</span>
                    </li>
                  ))}
                   {creditTransactions.length === 0 && (
                      <li className="text-center text-muted-foreground">No credit transactions.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
           {/* Totals Section */}
          <div className="grid grid-cols-2 mt-2">
            <div className="border-r-2 border-foreground p-4">
                 <div className="flex justify-between font-bold text-lg">
                    <span>Total Debits</span>
                    <span className="font-mono">{formatCurrency(totalDebits)}</span>
                </div>
            </div>
             <div className="p-4">
                 <div className="flex justify-between font-bold text-lg">
                    <span>Total Credits</span>
                    <span className="font-mono">{formatCurrency(totalCredits)}</span>
                </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
