import type { Account, Category, Expense, PaymentMethod } from "./types";

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
    subcategories: [
      { id: "sub_groceries", name: "Groceries" },
      { id: "sub_restaurants", name: "Restaurants" },
      { id: "sub_coffee", name: "Coffee Shops" },
    ],
  },
  {
    id: "cat_transport",
    name: "Transportation",
    subcategories: [
      { id: "sub_gas", name: "Gasoline" },
      { id: "sub_public", name: "Public Transit" },
      { id: "sub_rideshare", name: "Rideshare" },
    ],
  },
  {
    id: "cat_shopping",
    name: "Shopping",
    subcategories: [
      { id: "sub_clothes", name: "Clothing" },
      { id: "sub_electronics", name: "Electronics" },
      { id: "sub_gifts", name: "Gifts" },
    ],
  },
  {
    id: "cat_bills",
    name: "Bills & Utilities",
    subcategories: [
      { id: "sub_rent", name: "Rent" },
      { id: "sub_internet", name: "Internet" },
      { id: "sub_phone", name: "Phone Bill" },
    ],
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

export const getCategoryName = (id: string) =>
  categories.find((c) => c.id === id)?.name ?? "N/A";
export const getSubcategoryName = (catId: string, subId: string) =>
  categories
    .find((c) => c.id === catId)
    ?.subcategories.find((s) => s.id === subId)?.name ?? "N/A";
export const getPaymentMethodName = (id: string) =>
  paymentMethods.find((p) => p.id === id)?.name ?? "N/A";
