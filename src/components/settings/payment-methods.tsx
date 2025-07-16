
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "../ui/button";
import { CalendarIcon, PlusCircle } from "lucide-react";
import type { Account } from "@/lib/types";
import { useAppData } from "@/hooks/use-app-data";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "../ui/textarea";

const paymentFormSchema = z.object({
  amount: z.coerce.number().positive("Amount must be a positive number."),
  fromAccountId: z.string().min(1, "Please select an account to pay from."),
  date: z.date(),
  description: z.string().optional(),
});
type PaymentFormValues = z.infer<typeof paymentFormSchema>;

interface PaymentMethodsProps {
  accounts: Account[];
}

export function PaymentMethods({ accounts: allAccounts }: PaymentMethodsProps) {
  const { addTransfer, currency } = useAppData();
  const { toast } = useToast();

  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [accountToPay, setAccountToPay] = useState<Account | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      amount: 0,
      fromAccountId: "",
      date: new Date(),
      description: "",
    },
  });

  const handleOpenPaymentDialog = (account: Account) => {
    setAccountToPay(account);
    form.reset({
      amount: Math.min(Math.abs(account.balance), 500), // Default to a portion or full balance
      fromAccountId: "",
      date: new Date(),
      description: `Payment for ${account.name}`,
    });
    setPaymentDialogOpen(true);
  };

  const onSubmit = (data: PaymentFormValues) => {
    if (!accountToPay) return;
    addTransfer({
      ...data,
      toAccountId: accountToPay.id,
      description: data.description || `Payment to ${accountToPay.name}`,
    });
    toast({
      title: "Payment Successful",
      description: `Transferred ${formatCurrency(data.amount)} to ${accountToPay.name}.`,
    });
    setPaymentDialogOpen(false);
  };

  const cashAccounts = allAccounts.filter((a) => a.type === "cash");
  const bankAccounts = allAccounts.filter((a) => a.type === "bank");
  const creditCardAccounts = allAccounts.filter(
    (a) => a.type === "credit-card"
  );
  const sourceAccounts = allAccounts.filter(
    (a) => a.type === "bank" || a.type === "cash"
  );

  return (
    <>
      <Tabs defaultValue="bank">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bank">Bank Accounts</TabsTrigger>
          <TabsTrigger value="credit-card">Credit Cards</TabsTrigger>
          <TabsTrigger value="cash">Cash</TabsTrigger>
        </TabsList>
        <div className="mt-4">
          <TabsContent value="bank">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="font-headline">Bank Accounts</CardTitle>
                  <CardDescription>
                    Accounts linked to your debit cards.
                  </CardDescription>
                </div>
                <Button size="sm">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Account
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account Name</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bankAccounts.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell className="font-medium">
                          {account.name}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(account.balance)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="credit-card">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="font-headline">Credit Cards</CardTitle>
                  <CardDescription>
                    Your credit card accounts and balances.
                  </CardDescription>
                </div>
                <Button size="sm">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Card
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Card Name</TableHead>
                      <TableHead>Outstanding Balance</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {creditCardAccounts.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell className="font-medium">
                          {account.name}
                        </TableCell>
                        <TableCell className="text-destructive">
                          {formatCurrency(account.balance)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            onClick={() => handleOpenPaymentDialog(account)}
                          >
                            Make Payment
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="cash">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Cash</CardTitle>
                <CardDescription>Your physical cash balance.</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-4">
                <div className="text-3xl font-bold">
                  {formatCurrency(cashAccounts[0]?.balance ?? 0)}
                </div>
                <Button variant="outline">Update Balance</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pay {accountToPay?.name}</DialogTitle>
            <DialogDescription>
              Transfer funds to pay down your credit card balance.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 pt-4"
            >
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fromAccountId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pay From</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an account" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sourceAccounts.map((acc) => (
                          <SelectItem key={acc.id} value={acc.id}>
                            {acc.name} ({formatCurrency(acc.balance)})
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
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Payment Date</FormLabel>
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={`e.g., Payment for ${accountToPay?.name}`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">Submit Payment</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
