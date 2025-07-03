import type { Account, Category, Expense, Income, PaymentMethod } from "./types";

export const accounts: Account[] = [
  { id: "acc_cash", name: "Cash", type: "cash", balance: 500 },
  { id: "acc_bank1", name: "Checking Account", type: "bank", balance: 5000 },
  { id: "acc_bank2", name: "Savings Account", type: "bank", balance: 15000 },
  { id: "acc_cc1", name: "Visa Card", type: "credit-card", balance: -1200 }, // Negative balance represents amount owed
];

export const paymentMethods: PaymentMethod[] = [
  { id: "pm_cash", name: "Cash", type: "cash", accountId: "acc_cash" },
  {
    id: "pm_debit1",
    name: "Checking Debit Card",
    type: "debit-card",
    accountId: "acc_bank1",
  },
  {
    id: "pm_cc1",
    name: "Visa **** 1234",
    type: "credit-card",
    accountId: "acc_cc1",
  },
];

export const categories: Category[] = [
  {
    id: "cat_food",
    name: "Food & Dining",
    type: "expense",
    subcategories: [
      { id: "sub_groceries", name: "Groceries" },
      { id: "sub_restaurants", name: "Restaurants" },
      { id: "sub_coffee", name: "Coffee Shops" },
    ],
  },
  {
    id: "cat_transport",
    name: "Transportation",
    type: "expense",
    subcategories: [
      { id: "sub_gas", name: "Gasoline" },
      { id: "sub_public", name: "Public Transit" },
      { id: "sub_rideshare", name: "Rideshare" },
    ],
  },
  {
    id: "cat_shopping",
    name: "Shopping",
    type: "expense",
    subcategories: [
      { id: "sub_clothes", name: "Clothing" },
      { id: "sub_electronics", name: "Electronics" },
      { id: "sub_gifts", name: "Gifts" },
    ],
  },
  {
    id: "cat_bills",
    name: "Bills & Utilities",
    type: "expense",
    subcategories: [
      { id: "sub_rent", name: "Rent" },
      { id: "sub_internet", name: "Internet" },
      { id: "sub_phone", name: "Phone Bill" },
    ],
  },
];

export const incomeCategories: Category[] = [
  {
    id: "cat_salary",
    name: "Salary",
    type: "income",
    subcategories: [{ id: "sub_salary_monthly", name: "Monthly" }],
  },
  {
    id: "cat_bonus",
    name: "Bonus",
    type: "income",
    subcategories: [{ id: "sub_bonus_performance", name: "Performance" }],
  },
  {
    id: "cat_gift",
    name: "Gift",
    type: "income",
    subcategories: [{ id: "sub_gift_received", name: "Received" }],
  },
  {
    id: "cat_investment",
    name: "Investment",
    type: "income",
    subcategories: [{ id: "sub_investment_dividends", name: "Dividends" }],
  },
];

export const expenses: Expense[] = [
  {
    id: "exp_1",
    date: "2024-07-20",
    description: "Weekly groceries",
    amount: 150.75,
    categoryId: "cat_food",
    subcategoryId: "sub_groceries",
    paymentMethodId: "pm_debit1",
  },
  {
    id: "exp_2",
    date: "2024-07-20",
    description: "Dinner with friends",
    amount: 85.5,
    categoryId: "cat_food",
    subcategoryId: "sub_restaurants",
    paymentMethodId: "pm_cc1",
  },
  {
    id: "exp_3",
    date: "2024-07-19",
    description: "Morning coffee",
    amount: 4.25,
    categoryId: "cat_food",
    subcategoryId: "sub_coffee",
    paymentMethodId: "pm_cash",
  },
  {
    id: "exp_4",
    date: "2024-07-18",
    description: "Fuel for car",
    amount: 60.0,
    categoryId: "cat_transport",
    subcategoryId: "sub_gas",
    paymentMethodId: "pm_cc1",
  },
  {
    id: "exp_5",
    date: "2024-07-17",
    description: "New headphones",
    amount: 199.99,
    categoryId: "cat_shopping",
    subcategoryId: "sub_electronics",
    paymentMethodId: "pm_cc1",
  },
  {
    id: "exp_6",
    date: "2024-07-15",
    description: "Monthly rent",
    amount: 1200.0,
    categoryId: "cat_bills",
    subcategoryId: "sub_rent",
    paymentMethodId: "pm_debit1",
  },
];

export const incomes: Income[] = [
  {
    id: "inc_1",
    date: "2024-07-01",
    description: "Monthly Salary",
    amount: 4000,
    categoryId: "cat_salary",
    subcategoryId: "sub_salary_monthly",
    paymentMethodId: "pm_debit1",
  },
  {
    id: "inc_2",
    date: "2024-07-15",
    description: "Birthday Gift",
    amount: 100,
    categoryId: "cat_gift",
    subcategoryId: "sub_gift_received",
    paymentMethodId: "pm_cash",
  },
];
