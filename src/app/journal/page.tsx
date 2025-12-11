
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
  const { expenses, incomes, transfers, getAccountName, currency } = useAppData();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const allTransactions = [
    ...expenses.map((e) => ({ ...e, type: "expense", sortDate: new Date(e.date) })),
    ...incomes.map((i) => ({ ...i, type: "income", sortDate: new Date(i.date) })),
    ...transfers.map((t) => ({ ...t, type: "transfer", sortDate: new Date(t.date) })),
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
                <TableHead className="text-right">Debit</TableHead>
                <TableHead className="text-right">Credit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allTransactions.map((tx) => {
                  let debit, credit, description;

                  if (tx.type === 'expense') {
                      debit = tx.amount;
                      description = tx.description;
                  } else if (tx.type === 'income') {
                      credit = tx.amount;
                      description = tx.description;
                  } else if (tx.type === 'transfer') {
                      const transfer = tx as any; // Cast to access transfer properties
                      description = `Transfer from ${getAccountName(transfer.fromAccountId)} to ${getAccountName(transfer.toAccountId)}`;
                      // Transfers can be represented as both a debit and a credit in a full journal,
                      // but for a simple log, we'll show it as a neutral movement.
                      // For this simplified view, we can show it on one line or two.
                      // Here we represent the single event. A more formal journal would have two entries.
                  }

                  return (
                      <TableRow key={tx.id}>
                          <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
                          <TableCell className="font-medium">{description}</TableCell>
                          <TableCell className="text-right font-mono text-destructive">
                              {debit ? formatCurrency(debit) : ""}
                          </TableCell>
                          <TableCell className="text-right font-mono text-primary">
                              {credit ? formatCurrency(credit) : ""}
                          </TableCell>
                      </TableRow>
                  )
              })}
              {allTransactions.length === 0 && (
                  <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">No transactions recorded.</TableCell>
                  </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
