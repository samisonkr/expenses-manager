"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import type { Category, PaymentMethod } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

const incomeFormSchema = z.object({
  description: z.string().min(2, "Description must be at least 2 characters."),
  amount: z.coerce.number().positive("Amount must be a positive number."),
  date: z.date(),
  categoryId: z.string().min(1, "Please select a category."),
  subcategoryId: z.string().min(1, "Please select a subcategory."),
  paymentMethodId: z.string().min(1, "Please select a payment method."),
});

type IncomeFormValues = z.infer<typeof incomeFormSchema>;

interface IncomeFormProps {
  categories: Category[];
  paymentMethods: PaymentMethod[];
}

export function IncomeForm({ categories, paymentMethods }: IncomeFormProps) {
  const [subcategories, setSubcategories] = useState<
    { id: string; name: string }[]
  >([]);
  const { toast } = useToast();

  const form = useForm<IncomeFormValues>({
    resolver: zodResolver(incomeFormSchema),
    defaultValues: {
      description: "",
      amount: 0,
      date: new Date(),
      categoryId: "",
      subcategoryId: "",
      paymentMethodId: "",
    },
  });

  const handleCategoryChange = (categoryId: string) => {
    form.setValue("categoryId", categoryId);
    form.setValue("subcategoryId", ""); // Reset subcategory
    const category = categories.find((c) => c.id === categoryId);
    setSubcategories(category ? category.subcategories : []);
  };

  function onSubmit(data: IncomeFormValues) {
    console.log(data);
    toast({
      title: "Income Added!",
      description: `Added "${data.description}" for ${formatCurrency(data.amount)}.`,
    });
    form.reset();
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., Monthly Salary" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="0.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of Income</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={handleCategoryChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subcategoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subcategory</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={!form.getValues("categoryId")}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subcategory" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {subcategories.map((sub) => (
                    <SelectItem key={sub.id} value={sub.id}>
                      {sub.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="paymentMethodId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deposit to</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an account" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {paymentMethods
                    .filter((pm) => pm.type !== "credit-card")
                    .map((pm) => (
                      <SelectItem key={pm.id} value={pm.id}>
                        {pm.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Add Income</Button>
      </form>
    </Form>
  );
}
