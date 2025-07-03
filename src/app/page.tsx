
"use client";

import { CreditCard, Landmark, Wallet } from "lucide-react";
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
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Cell, Pie, PieChart } from "recharts";
import { useAppData } from "@/hooks/use-app-data";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export default function DashboardPage() {
  const { accounts, expenses, categories, getPaymentMethodName } = useAppData();
  const cashBalance = accounts.find((a) => a.type === "cash")?.balance ?? 0;
  const bankBalance = accounts
    .filter((a) => a.type === "bank")
    .reduce((sum, acc) => sum + acc.balance, 0);
  const creditCardDue = accounts
    .filter((a) => a.type === "credit-card")
    .reduce((sum, acc) => sum + acc.balance, 0);

  const recentExpenses = expenses.slice(0, 5);

  const expenseByCategory = expenses.reduce((acc, expense) => {
    const category = categories.find((c) => c.id === expense.categoryId);
    if (category) {
      acc[category.name] = (acc[category.name] || 0) + expense.amount;
    }
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(expenseByCategory).map(([name, value]) => ({
    name,
    value: Math.round(value),
  }));

  const chartConfig = chartData.reduce((acc, { name }, index) => {
    acc[name] = {
      label: name,
      color: `hsl(var(--chart-${(index % 5) + 1}))`,
    };
    return acc;
  }, {} as ChartConfig);

  return (
    <div className="flex flex-1 flex-col gap-6">
      <h1 className="font-headline text-2xl font-bold md:text-3xl">
        Dashboard
      </h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-headline text-sm font-medium">
              Cash Balance
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(cashBalance)}
            </div>
            <p className="text-xs text-muted-foreground">
              Available cash on hand
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-headline text-sm font-medium">
              Bank Accounts Total
            </CardTitle>
            <Landmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(bankBalance)}
            </div>
            <p className="text-xs text-muted-foreground">
              Sum of all bank accounts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-headline text-sm font-medium">
              Credit Card Due
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {formatCurrency(creditCardDue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total outstanding balance
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <h2 className="font-headline text-xl font-bold md:text-2xl mb-4">
            Recent Expenses
          </h2>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium">
                      {expense.description}
                    </TableCell>
                    <TableCell>
                      {new Date(expense.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {getPaymentMethodName(expense.paymentMethodId)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(expense.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <h2 className="font-headline text-xl font-bold md:text-2xl mb-4">
            Expenses by Category
          </h2>
          <Card>
            <CardContent className="p-6">
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square h-full max-h-[250px]"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    strokeWidth={5}
                  >
                    {chartData.map((entry) => (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={
                          entry.name in chartConfig
                            ? chartConfig[entry.name].color
                            : ""
                        }
                      />
                    ))}
                  </Pie>
                  <ChartLegend
                    content={<ChartLegendContent />}
                    className="-mt-4 flex-wrap justify-center gap-y-1"
                  />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
