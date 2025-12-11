
"use client";
import React, { useMemo, useState } from "react";
import {
  isWithinInterval,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  parseISO,
} from "date-fns";
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
import { Button } from "@/components/ui/button";

export default function JournalPage() {
  const { expenses, incomes, transfers, accounts, getCategoryName, getSubcategoryName, getPaymentMethodName, currency } = useAppData();
  const [filter, setFilter] = useState<"all" | "monthly" | "yearly">("all");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const allTransactions = useMemo(() => {
    return [
      ...expenses.map((e) => ({ ...e, type: "expense" as const, sortDate: parseISO(e.date) })),
      ...incomes.map((i) => ({ ...i, type: "income" as const, sortDate: parseISO(i.date) })),
      ...transfers.map((t) => ({ ...t, type: "transfer" as const, sortDate: parseISO(t.date) })),
    ].sort((a, b) => a.sortDate.getTime() - b.sortDate.getTime());
  }, [expenses, incomes, transfers]);

  const filteredTransactions = useMemo(() => {
    if (filter === 'all') return allTransactions;
    const now = new Date();
    let interval;
    if (filter === "monthly") {
      interval = { start: startOfMonth(now), end: endOfMonth(now) };
    } else { // yearly
      interval = { start: startOfYear(now), end: endOfYear(now) };
    }
    return allTransactions.filter((tx) => isWithinInterval(tx.sortDate, interval));
  }, [allTransactions, filter]);

  const transactionsWithBalance = useMemo(() => {
    const currentTotalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    const netEffectOfAllTransactions = allTransactions.reduce((acc, tx) => {
      if (tx.type === 'income') return acc + tx.amount;
      if (tx.type === 'expense') return acc - tx.amount;
      return acc; // Transfers are neutral to total balance
    }, 0);

    let startingBalance = currentTotalBalance - netEffectOfAllTransactions;

    let runningBalance = startingBalance;
    const processedTransactions = filteredTransactions.map(tx => {
      if (tx.type === 'income') {
        runningBalance += tx.amount;
      } else if (tx.type === 'expense') {
        runningBalance -= tx.amount;
      }
      return { ...tx, balance: runningBalance };
    });
    return processedTransactions.sort((a,b) => b.sortDate.getTime() - a.sortDate.getTime());
  }, [filteredTransactions, accounts, allTransactions]);


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
          <div className="mb-4 flex space-x-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            <Button
              variant={filter === "monthly" ? "default" : "outline"}
              onClick={() => setFilter("monthly")}
            >
              Monthly
            </Button>
            <Button
              variant={filter === "yearly" ? "default" : "outline"}
              onClick={() => setFilter("yearly")}
            >
              Yearly
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category / Type</TableHead>
                <TableHead>Account</TableHead>
                <TableHead className="text-right">Debit</TableHead>
                <TableHead className="text-right">Credit</TableHead>
                <TableHead className="text-right">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactionsWithBalance.map((tx) => (
                <TableRow key={`${tx.type}-${tx.id}`}>
                  <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{tx.description}</TableCell>
                  <TableCell>
                    {tx.type === 'transfer' ? 'Transfer' : 
                     `${getCategoryName(tx.categoryId)}: ${getSubcategoryName(tx.categoryId, tx.subcategoryId)}`}
                  </TableCell>
                  <TableCell>
                    {tx.type === 'transfer' ? `${getPaymentMethodName(tx.fromAccountId)} -> ${getPaymentMethodName(tx.toAccountId)}` : getPaymentMethodName(tx.paymentMethodId)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-destructive">
                    {tx.type === 'expense' || tx.type === 'transfer' ? formatCurrency(tx.amount) : '-'}
                  </TableCell>
                  <TableCell className="text-right font-mono text-primary">
                    {tx.type === 'income' ? formatCurrency(tx.amount) : '-'}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(tx.balance)}
                  </TableCell>
                </TableRow>
              ))}
              {transactionsWithBalance.length === 0 && (
                  <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">No transactions found for this period.</TableCell>
                  </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
