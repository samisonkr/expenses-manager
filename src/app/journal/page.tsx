
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
import { Separator } from "@/components/ui/separator";

export default function JournalPage() {
  const { expenses, incomes, transfers, getAccountName, currency } = useAppData();

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

  const totalDebits = allTransactions
    .filter(tx => tx.type === 'expense' || tx.type === 'transfer')
    .reduce((sum, tx) => sum + tx.amount, 0);
  
  const totalCredits = allTransactions
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0)
    + allTransactions
    .filter(tx => tx.type === 'transfer')
    .reduce((sum, tx) => sum + tx.amount, 0)


  return (
    <div className="flex flex-1 flex-col gap-6">
      <h1 className="font-headline text-2xl font-bold md:text-3xl">Journal</h1>
      <Card>
        <CardHeader className="items-center text-center">
          <CardTitle className="font-headline text-2xl">
            General Journal
          </CardTitle>
          <CardDescription>
            A chronological record of all your financial transactions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Account</TableHead>
                <TableHead className="text-right">Debit</TableHead>
                <TableHead className="text-right">Credit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allTransactions.map((tx) => {
                let description, account, debit, credit;

                if (tx.type === "expense") {
                  description = tx.description;
                  account = getAccountName(tx.paymentMethodId);
                  debit = formatCurrency(tx.amount);
                } else if (tx.type === "income") {
                  description = tx.description;
                  account = getAccountName(tx.paymentMethodId);
                  credit = formatCurrency(tx.amount);
                } else if (tx.type === "transfer") {
                  // For a transfer, we create two rows in the view, one for debit, one for credit
                  return (
                    <React.Fragment key={tx.id}>
                      <TableRow>
                        <TableCell>{tx.sortDate.toLocaleDateString()}</TableCell>
                        <TableCell className="font-medium">
                          Transfer to {getAccountName(tx.toAccountId)}
                        </TableCell>
                        <TableCell>{getAccountName(tx.fromAccountId)}</TableCell>
                        <TableCell className="text-right font-mono text-destructive">
                          {formatCurrency(tx.amount)}
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                       <TableRow>
                        <TableCell></TableCell>
                        <TableCell className="font-medium pl-6 text-muted-foreground">
                          Transfer from {getAccountName(tx.fromAccountId)}
                        </TableCell>
                        <TableCell>{getAccountName(tx.toAccountId)}</TableCell>
                        <TableCell></TableCell>
                        <TableCell className="text-right font-mono text-primary">
                          {formatCurrency(tx.amount)}
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                }
                
                return (
                  <TableRow key={tx.id}>
                    <TableCell>{tx.sortDate.toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{description}</TableCell>
                    <TableCell>{account}</TableCell>
                    <TableCell className="text-right font-mono text-destructive">{debit}</TableCell>
                    <TableCell className="text-right font-mono text-primary">{credit}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <Separator className="my-4" />
          <div className="flex justify-end">
              <div className="w-1/2">
                <div className="flex justify-between font-bold text-lg p-4 border-t">
                    <span>Total Debits</span>
                    <span className="font-mono">{formatCurrency(totalDebits)}</span>
                </div>
                 <div className="flex justify-between font-bold text-lg p-4 border-t">
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
