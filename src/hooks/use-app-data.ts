
"use client"

import { useLocalStorage } from "./use-local-storage"
import {
  accounts as initialAccounts,
  categories as initialCategories,
  incomeCategories as initialIncomeCategories,
  expenses as initialExpenses,
  incomes as initialIncomes,
  paymentMethods as initialPaymentMethods,
} from "@/lib/data"
import type { Account, Category, Expense, Income, PaymentMethod, Subcategory } from "@/lib/types"

export function useAppData() {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>("expenses", initialExpenses)
  const [incomes, setIncomes] = useLocalStorage<Income[]>("incomes", initialIncomes)
  const [categories, setCategories] = useLocalStorage<Category[]>("expense-categories", initialCategories)
  const [incomeCategories, setIncomeCategories] = useLocalStorage<Category[]>("income-categories", initialIncomeCategories)
  const [accounts, setAccounts] = useLocalStorage<Account[]>("accounts", initialAccounts)
  const [paymentMethods, setPaymentMethods] = useLocalStorage<PaymentMethod[]>("payment-methods", initialPaymentMethods)

  const allCategories = [...categories, ...incomeCategories]
  
  const getCategoryName = (id: string) => allCategories.find((c) => c.id === id)?.name ?? "N/A";
  const getSubcategoryName = (catId: string, subId: string) =>
    allCategories
      .find((c) => c.id === catId)
      ?.subcategories.find((s) => s.id === subId)?.name ?? "N/A";
  const getPaymentMethodName = (id: string) =>
    paymentMethods.find((p) => p.id === id)?.name ?? "N/A";

  // Expense functions
  const addExpense = (expenseData: Omit<Expense, "id" | "date"> & { date: Date }) => {
    const newExpense: Expense = {
      ...expenseData,
      id: `exp_${Date.now()}`,
      date: expenseData.date.toISOString().split("T")[0],
    }
    setExpenses((prev) => [newExpense, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
  }

  const updateExpense = (expenseData: Omit<Expense, "id" | "date"> & { id: string; date: Date }) => {
    const updatedExpense: Expense = {
      ...expenseData,
      date: expenseData.date.toISOString().split("T")[0],
    }
    setExpenses((prev) => prev.map((e) => (e.id === updatedExpense.id ? updatedExpense : e)))
  }

  const deleteExpense = (expenseId: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== expenseId))
  }

  // Income functions
  const addIncome = (incomeData: Omit<Income, "id" | "date"> & { date: Date }) => {
    const newIncome: Income = {
      ...incomeData,
      id: `inc_${Date.now()}`,
      date: incomeData.date.toISOString().split("T")[0],
    }
    setIncomes((prev) => [newIncome, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
  }

  const updateIncome = (incomeData: Omit<Income, "id" | "date"> & { id: string; date: Date }) => {
    const updatedIncome: Income = {
      ...incomeData,
      date: incomeData.date.toISOString().split("T")[0],
    }
    setIncomes((prev) => prev.map((i) => (i.id === updatedIncome.id ? updatedIncome : i)))
  }

  const deleteIncome = (incomeId: string) => {
    setIncomes((prev) => prev.filter((i) => i.id !== incomeId))
  }

  // Category functions
  const addCategory = (category: Omit<Category, 'id' | 'subcategories'>) => {
      const newCategory: Category = {
          ...category,
          id: `cat_${category.name.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}`,
          subcategories: [],
      };
      if (category.type === 'expense') {
          setCategories(prev => [...prev, newCategory]);
      } else {
          setIncomeCategories(prev => [...prev, newCategory]);
      }
  };

  const addSubcategory = (parentCategory: Category, subcategoryName: string) => {
    const newSubcategory: Subcategory = {
        id: `sub_${subcategoryName.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}`,
        name: subcategoryName.trim(),
    };
    
    const update = (cats: Category[]) => cats.map(cat => 
        cat.id === parentCategory.id ? { ...cat, subcategories: [...cat.subcategories, newSubcategory] } : cat
    );

    if (parentCategory.type === "expense") {
        setCategories(update);
    } else {
        setIncomeCategories(update);
    }
  };

  return {
    expenses, addExpense, updateExpense, deleteExpense,
    incomes, addIncome, updateIncome, deleteIncome,
    categories, incomeCategories, addCategory, addSubcategory,
    accounts, setAccounts,
    paymentMethods, setPaymentMethods,
    allCategories,
    getCategoryName,
    getSubcategoryName,
    getPaymentMethodName,
  }
}
