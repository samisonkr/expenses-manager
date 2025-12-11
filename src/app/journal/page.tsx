
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

export default function JournalPage() {
  const { expenses, incomes, transfers, getCategoryName, getSubcategoryName, getPaymentMethodName, currency } = useAppData();

  const formatCurrency = (amount: number, type: 'income' | 'expense') => {
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);

    return type === 'income' ? `+${formatted}` : `-${formatted}`;
  };

  const allTransactions = [
    ...expenses.map((e) => ({ ...e, type: "expense" as const, sortDate: new Date(e.date) })),
    ...incomes.map((i) => ({ ...i, type: "income" as const, sortDate: new Date(i.date) })),
    ...transfers.map((t) => ({ ...t, type: "transfer" as const, sortDate: new Date(t.date) })),
  ].sort((a, b) => b.sortDate.getTime() - a.sortDate.getTime());

  return (
    <div className="flex flex-1 flex-col gap-6">
      <h1 className="font-headline text-2xl font-bold md:text-3xl">Journal</h1>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            All Transactions
          </CardTitle>
          <CardDescription>
            A chronological log of all your financial activities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category / Type</TableHead>
                <TableHead>Account</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allTransactions.map((tx) => (
                <TableRow key={`${tx.type}-${tx.id}`}>
                  <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{tx.description}</TableCell>
                  <TableCell>
                    {tx.type === 'transfer' ? 'Transfer' : 
                     `${getCategoryName(tx.categoryId)}: ${getSubcategoryName(tx.categoryId, tx.subcategoryId)}`}
                  </TableCell>
                  <TableCell>
                    {tx.type === 'transfer' ? getPaymentMethodName(tx.fromAccountId) + ' -> ' + getPaymentMethodName(tx.toAccountId) : getPaymentMethodName(tx.paymentMethodId)}
                  </TableCell>
                  <TableCell className={`text-right font-mono ${tx.type === 'income' ? 'text-primary' : 'text-destructive'}`}>
                    {tx.type !== 'transfer' ? formatCurrency(tx.amount, tx.type) : formatCurrency(tx.amount, 'expense')}
                  </TableCell>
                </TableRow>
              ))}
              {allTransactions.length === 0 && (
                  <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">No transactions recorded.</TableCell>
                  </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
