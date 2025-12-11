
"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppData } from "@/hooks/use-app-data";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export default function JournalPage() {
  const { expenses, incomes, transfers, getCategoryName, getSubcategoryName, getPaymentMethodName, getAccountName, currency } = useAppData();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const allTransactions = [
    ...expenses.map((e) => ({ ...e, type: "expense" as const, sortDate: new Date(e.date) })),
    ...incomes.map((i) => ({ ...i, type: "income" as const, sortDate: new Date(i.date) })),
    ...transfers.map((t) => ({ ...t, type: "transfer" as const, sortDate: new Date(t.date) })),
  ].sort((a, b) => b.sortDate.getTime() - a.sortDate.getTime());

  const debits = allTransactions.filter(tx => tx.type === 'expense' || tx.type === 'transfer');
  const credits = allTransactions.filter(tx => tx.type === 'income' || tx.type === 'transfer');

  const totalDebits = debits.reduce((sum, tx) => sum + tx.amount, 0);
  const totalCredits = credits.reduce((sum, tx) => sum + tx.amount, 0);

  const renderTransactionRow = (tx: any, type: 'debit' | 'credit') => {
    let description, account, amountDisplay;

    if (tx.type === "expense") {
        description = tx.description;
        account = getPaymentMethodName(tx.paymentMethodId);
        amountDisplay = formatCurrency(tx.amount);
    } else if (tx.type === "income") {
        description = tx.description;
        account = getPaymentMethodName(tx.paymentMethodId);
        amountDisplay = formatCurrency(tx.amount);
    } else if (tx.type === "transfer") {
      if (type === 'debit') {
        description = `Transfer to ${getAccountName(tx.toAccountId)}`;
        account = getAccountName(tx.fromAccountId);
      } else {
        description = `Transfer from ${getAccountName(tx.fromAccountId)}`;
        account = getAccountName(tx.toAccountId);
      }
      amountDisplay = formatCurrency(tx.amount);
    }
    
    return (
      <TableRow key={`${tx.id}-${type}`}>
        <TableCell>{tx.sortDate.toLocaleDateString()}</TableCell>
        <TableCell className="font-medium">{description}</TableCell>
        <TableCell>{account}</TableCell>
        <TableCell className="text-right font-mono">{amountDisplay}</TableCell>
      </TableRow>
    );
  };

  return (
    <div className="flex flex-1 flex-col gap-6">
      <h1 className="font-headline text-2xl font-bold md:text-3xl">Journal</h1>
      <Card>
        <CardHeader className="items-center text-center">
          <CardTitle className="font-headline text-2xl">
            General Journal
          </CardTitle>
          <CardDescription>
            A T-Account view of all your transactions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2">
            {/* Debits Column */}
            <div className="pr-4">
              <h3 className="font-headline text-lg font-semibold text-center mb-2">Debits (Expenses)</h3>
              <Separator />
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                    {debits.map(tx => renderTransactionRow(tx, 'debit'))}
                </TableBody>
              </Table>
              <Separator className="my-2" />
               <div className="flex justify-between font-bold text-lg p-4">
                    <span>Total Debits</span>
                    <span className="font-mono">{formatCurrency(totalDebits)}</span>
                </div>
            </div>

            {/* Credits Column */}
            <div className="pl-4 border-l">
              <h3 className="font-headline text-lg font-semibold text-center mb-2">Credits (Incomes)</h3>
              <Separator />
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                    {credits.map(tx => renderTransactionRow(tx, 'credit'))}
                </TableBody>
              </Table>
               <Separator className="my-2" />
               <div className="flex justify-between font-bold text-lg p-4">
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
