"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  isWithinInterval,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  parseISO,
} from "date-fns";
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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  getCategoryName,
  getSubcategoryName,
  getPaymentMethodName,
} from "@/lib/data";
import type { Expense, Category, PaymentMethod } from "@/lib/types";
import { ExpenseForm } from "./expense-form";
import { z } from "zod";

const expenseFormSchema = z.object({
  description: z.string().min(2, "Description must be at least 2 characters."),
  amount: z.coerce.number().positive("Amount must be a positive number."),
  date: z.date(),
  categoryId: z.string().min(1, "Please select a category."),
  subcategoryId: z.string().min(1, "Please select a subcategory."),
  paymentMethodId: z.string().min(1, "Please select a payment method."),
});
type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

interface ExpensesListProps {
  initialExpenses: Expense[];
  categories: Category[];
  paymentMethods: PaymentMethod[];
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export function ExpensesList({
  initialExpenses,
  categories,
  paymentMethods,
}: ExpensesListProps) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [filter, setFilter] = useState<"daily" | "weekly" | "monthly">(
    "monthly"
  );
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);

  const { toast } = useToast();

  const filteredExpenses = useMemo(() => {
    const now = new Date();
    let interval;
    if (filter === "daily") {
      interval = { start: startOfDay(now), end: endOfDay(now) };
    } else if (filter === "weekly") {
      interval = { start: startOfWeek(now), end: endOfWeek(now) };
    } else {
      interval = { start: startOfMonth(now), end: endOfMonth(now) };
    }
    return expenses.filter((e) => isWithinInterval(parseISO(e.date), interval));
  }, [expenses, filter]);

  const handleEdit = (expense: Expense) => {
    setExpenseToEdit(expense);
    setIsEditDialogOpen(true);
  };

  const handleDelete = () => {
    if (!expenseToDelete) return;
    setExpenses(expenses.filter((e) => e.id !== expenseToDelete.id));
    toast({ title: "Expense Deleted", description: `"${expenseToDelete.description}" was removed.` });
    setExpenseToDelete(null);
  };
  
  const handleEditSubmit = (values: ExpenseFormValues) => {
    if (!expenseToEdit) return;
    const updatedExpense = {
        ...expenseToEdit,
        ...values,
        date: values.date.toISOString().split("T")[0],
    };
    setExpenses(expenses.map(e => e.id === updatedExpense.id ? updatedExpense : e));
    toast({ title: "Expense Updated", description: "Your expense has been successfully updated."});
    setIsEditDialogOpen(false);
    setExpenseToEdit(null);
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-headline text-2xl font-bold md:text-3xl">Expenses</CardTitle>
          <Button asChild>
            <Link href="/add-expense">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Expense
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex space-x-2">
            <Button
              variant={filter === "daily" ? "default" : "outline"}
              onClick={() => setFilter("daily")}
            >
              Daily
            </Button>
            <Button
              variant={filter === "weekly" ? "default" : "outline"}
              onClick={() => setFilter("weekly")}
            >
              Weekly
            </Button>
            <Button
              variant={filter === "monthly" ? "default" : "outline"}
              onClick={() => setFilter("monthly")}
            >
              Monthly
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Account</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>
                    {new Date(expense.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-medium">
                    {expense.description}
                  </TableCell>
                  <TableCell>
                    {getCategoryName(expense.categoryId)}:{" "}
                    {getSubcategoryName(
                      expense.categoryId,
                      expense.subcategoryId
                    )}
                  </TableCell>
                  <TableCell>
                    {getPaymentMethodName(expense.paymentMethodId)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-destructive">
                    -{formatCurrency(expense.amount)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(expense)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setExpenseToDelete(expense)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
          </DialogHeader>
          {expenseToEdit && (
            <ExpenseForm 
                categories={categories}
                paymentMethods={paymentMethods}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!expenseToDelete}
        onOpenChange={() => setExpenseToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              expense: "{expenseToDelete?.description}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}