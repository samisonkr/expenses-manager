"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
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
import type { Income, Category, PaymentMethod } from "@/lib/types";
import { IncomeForm } from "./income-form";
import { z } from "zod";

const incomeFormSchema = z.object({
  description: z.string().min(2, "Description must be at least 2 characters."),
  amount: z.coerce.number().positive("Amount must be a positive number."),
  date: z.date(),
  categoryId: z.string().min(1, "Please select a category."),
  subcategoryId: z.string().min(1, "Please select a subcategory."),
  paymentMethodId: z.string().min(1, "Please select a payment method."),
});
type IncomeFormValues = z.infer<typeof incomeFormSchema>;

interface IncomesListProps {
  initialIncomes: Income[];
  categories: Category[];
  paymentMethods: PaymentMethod[];
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export function IncomesList({
  initialIncomes,
  categories,
  paymentMethods,
}: IncomesListProps) {
  const [incomes, setIncomes] = useState<Income[]>(initialIncomes);
  const [filter, setFilter] = useState<"monthly" | "yearly">("monthly");
  const [incomeToEdit, setIncomeToEdit] = useState<Income | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [incomeToDelete, setIncomeToDelete] = useState<Income | null>(null);

  const { toast } = useToast();

  const filteredIncomes = useMemo(() => {
    const now = new Date();
    let interval;
    if (filter === "monthly") {
      interval = { start: startOfMonth(now), end: endOfMonth(now) };
    } else {
      interval = { start: startOfYear(now), end: endOfYear(now) };
    }
    return incomes.filter((i) => isWithinInterval(parseISO(i.date), interval));
  }, [incomes, filter]);

  const handleEdit = (income: Income) => {
    setIncomeToEdit(income);
    setIsEditDialogOpen(true);
  };

  const handleDelete = () => {
    if (!incomeToDelete) return;
    setIncomes(incomes.filter((i) => i.id !== incomeToDelete.id));
    toast({ title: "Income Deleted", description: `"${incomeToDelete.description}" was removed.` });
    setIncomeToDelete(null);
  };

  const handleEditSubmit = (values: IncomeFormValues) => {
    if (!incomeToEdit) return;
    const updatedIncome = {
      ...incomeToEdit,
      ...values,
      date: values.date.toISOString().split('T')[0],
    };
    setIncomes(incomes.map(i => i.id === updatedIncome.id ? updatedIncome : i));
    toast({ title: "Income Updated", description: "Your income has been successfully updated." });
    setIsEditDialogOpen(false);
    setIncomeToEdit(null);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-headline text-2xl font-bold md:text-3xl">Incomes</CardTitle>
          <Button asChild>
            <Link href="/add-income">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Income
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex space-x-2">
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
                <TableHead>Category</TableHead>
                <TableHead>Account</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIncomes.map((income) => (
                <TableRow key={income.id}>
                  <TableCell>
                    {new Date(income.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-medium">
                    {income.description}
                  </TableCell>
                  <TableCell>
                    {getCategoryName(income.categoryId)}:{" "}
                    {getSubcategoryName(
                      income.categoryId,
                      income.subcategoryId
                    )}
                  </TableCell>
                  <TableCell>
                    {getPaymentMethodName(income.paymentMethodId)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-primary">
                    +{formatCurrency(income.amount)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(income)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIncomeToDelete(income)}
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
            <DialogTitle>Edit Income</DialogTitle>
          </DialogHeader>
          {incomeToEdit && (
            <IncomeForm 
                categories={categories}
                paymentMethods={paymentMethods}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!incomeToDelete}
        onOpenChange={() => setIncomeToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              income: "{incomeToDelete?.description}".
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
