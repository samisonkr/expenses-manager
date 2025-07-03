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
import {
  expenses,
  getCategoryName,
  getSubcategoryName,
  getPaymentMethodName,
} from "@/lib/data";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export default function JournalPage() {
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
                <TableHead>Account / Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Debit</TableHead>
                <TableHead className="text-right">Credit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => {
                const category = getCategoryName(expense.categoryId);
                const subcategory = getSubcategoryName(
                  expense.categoryId,
                  expense.subcategoryId
                );
                const paymentMethod = getPaymentMethodName(
                  expense.paymentMethodId
                );

                return (
                  <React.Fragment key={expense.id}>
                    <TableRow className="bg-muted/20">
                      <TableCell>
                        {new Date(expense.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-medium">
                        {expense.description}
                      </TableCell>
                      <TableCell>
                        {category}: {subcategory}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatCurrency(expense.amount)}
                      </TableCell>
                      <TableCell className="text-right font-mono"></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell className="pl-8 text-muted-foreground">
                        {paymentMethod}
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell className="text-right font-mono"></TableCell>
                      <TableCell className="text-right font-mono">
                        {formatCurrency(expense.amount)}
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
