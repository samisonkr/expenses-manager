
"use client";
import React from "react";
import {
  Card,
  CardContent,
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

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export default function JournalPage() {
  const { expenses, incomes, transfers, getCategoryName, getSubcategoryName, getPaymentMethodName, getAccountName } = useAppData();

  const transactions = [
    ...expenses.map((e) => ({ ...e, type: "expense" as const })),
    ...incomes.map((i) => ({ ...i, type: "income" as const })),
    ...transfers.map((t) => ({ ...t, type: "transfer" as const })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="flex flex-1 flex-col gap-6">
      <h1 className="font-headline text-2xl font-bold md:text-3xl">Journal</h1>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">All Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category / Type</TableHead>
                <TableHead>Account</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => {
                let category, account, amountDisplay;
                const isExpense = tx.type === "expense";
                const isIncome = tx.type === "income";
                const isTransfer = tx.type === "transfer";

                if (isExpense) {
                  const subcategory = getSubcategoryName(
                    tx.categoryId,
                    tx.subcategoryId
                  );
                  category = `${getCategoryName(tx.categoryId)}: ${subcategory}`;
                  account = getPaymentMethodName(tx.paymentMethodId);
                  amountDisplay = `-${formatCurrency(tx.amount)}`;
                } else if (isIncome) {
                    const subcategory = getSubcategoryName(
                        tx.categoryId,
                        tx.subcategoryId
                      );
                      category = `${getCategoryName(tx.categoryId)}: ${subcategory}`;
                      account = getPaymentMethodName(tx.paymentMethodId);
                      amountDisplay = `+${formatCurrency(tx.amount)}`;
                } else if (isTransfer) {
                  category = "Transfer";
                  account = `${getAccountName(tx.fromAccountId)} → ${getAccountName(tx.toAccountId)}`;
                  amountDisplay = formatCurrency(tx.amount);
                }

                return (
                  <TableRow key={tx.id}>
                    <TableCell>
                      {new Date(tx.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium">{tx.description}</TableCell>
                    <TableCell>
                      {category}
                    </TableCell>
                    <TableCell>
                      {account}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-right font-mono",
                        isIncome && "text-primary",
                        isExpense && "text-destructive"
                      )}
                    >
                      {amountDisplay}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
