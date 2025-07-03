"use client";

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
import type { Account } from "@/lib/types";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";

interface PaymentMethodsProps {
  accounts: Account[];
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export function PaymentMethods({ accounts }: PaymentMethodsProps) {
  const cashAccounts = accounts.filter((a) => a.type === "cash");
  const bankAccounts = accounts.filter((a) => a.type === "bank");
  const creditCardAccounts = accounts.filter((a) => a.type === "credit-card");

  return (
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
                    <TableHead className="text-right">
                      Outstanding Balance
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {creditCardAccounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell className="font-medium">
                        {account.name}
                      </TableCell>
                      <TableCell className="text-right text-destructive">
                        {formatCurrency(account.balance)}
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
  );
}
