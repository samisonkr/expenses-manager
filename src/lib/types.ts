export interface Account {
  id: string;
  name: string;
  type: "cash" | "bank" | "credit-card";
  balance: number;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: "cash" | "debit-card" | "credit-card";
  accountId?: string;
}

export interface Category {
  id: string;
  name: string;
  type: "expense" | "income";
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
}

export interface Expense {
  id: string;
  date: string;
  description: string;
  amount: number;
  categoryId: string;
  subcategoryId: string;
  paymentMethodId: string;
}

export interface Income {
  id: string;
  date: string;
  description: string;
  amount: number;
  categoryId: string;
  subcategoryId: string;
  paymentMethodId: string; // The account where income is deposited
}

export interface Transfer {
  id: string;
  date: string;
  description: string;
  amount: number;
  fromAccountId: string;
  toAccountId: string;
}
