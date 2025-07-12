
"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { db } from "@/lib/firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"
import type { Account, Category, Expense, Income, PaymentMethod, Subcategory, Transfer } from "@/lib/types"

type DataCollections = {
  expenses: Expense[];
  incomes: Income[];
  transfers: Transfer[];
  'expense-categories': Category[];
  'income-categories': Category[];
  accounts: Account[];
  'payment-methods': PaymentMethod[];
}

export function useAppData() {
  const { user } = useAuth();
  const [data, setData] = useState<DataCollections>({
    expenses: [],
    incomes: [],
    transfers: [],
    'expense-categories': [],
    'income-categories': [],
    accounts: [],
    'payment-methods': [],
  });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (collectionName: keyof DataCollections) => {
    if (!user) return [];
    try {
      const docRef = doc(db, `users/${user.uid}/data`, collectionName);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data().items || [];
      }
      return [];
    } catch (error) {
      console.error(`Error fetching ${collectionName}:`, error);
      return [];
    }
  }, [user]);

  const saveData = useCallback(async (collectionName: keyof DataCollections, items: any[]) => {
    if (!user) return;
    try {
      const docRef = doc(db, `users/${user.uid}/data`, collectionName);
      await setDoc(docRef, { items });
    } catch (error) {
      console.error(`Error saving ${collectionName}:`, error);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
        setLoading(false);
        return;
    };
    
    setLoading(true);
    const fetchAllData = async () => {
      const collections: (keyof DataCollections)[] = [
        'expenses', 'incomes', 'transfers', 
        'expense-categories', 'income-categories', 
        'accounts', 'payment-methods'
      ];
      const allData = await Promise.all(
        collections.map(name => fetchData(name))
      );
      setData({
        expenses: allData[0],
        incomes: allData[1],
        transfers: allData[2],
        'expense-categories': allData[3],
        'income-categories': allData[4],
        accounts: allData[5],
        'payment-methods': allData[6],
      });
      setLoading(false);
    };
    fetchAllData();
  }, [user, fetchData]);

  const allCategories = [...data['expense-categories'], ...data['income-categories']];

  const getCategoryName = (id: string) => allCategories.find((c) => c.id === id)?.name ?? "N/A";
  const getSubcategoryName = (catId: string, subId: string) =>
    allCategories
      .find((c) => c.id === catId)
      ?.subcategories.find((s) => s.id === subId)?.name ?? "N/A";
  const getPaymentMethodName = (id: string) =>
    data['payment-methods'].find((p) => p.id === id)?.name ?? "N/A";
  const getAccountName = (id: string) => data.accounts.find((a) => a.id === id)?.name ?? "N/A";

  const updateCollection = async <T>(name: keyof DataCollections, updateFn: (prev: T[]) => T[]) => {
      const currentItems = (data[name] as T[]) || [];
      const updatedItems = updateFn(currentItems);
      setData(prev => ({ ...prev, [name]: updatedItems }));
      await saveData(name, updatedItems);
  };
  
  // Expense functions
  const addExpense = (expenseData: Omit<Expense, "id" | "date"> & { date: Date }) => {
    const newExpense: Expense = {
      ...expenseData,
      id: `exp_${Date.now()}`,
      date: expenseData.date.toISOString().split("T")[0],
    };
    updateCollection<Expense>('expenses', prev => 
        [newExpense, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    );
  };

  const updateExpense = (expenseData: Omit<Expense, "id" | "date"> & { id: string; date: Date }) => {
    const updatedExpense: Expense = { ...expenseData, date: expenseData.date.toISOString().split("T")[0] };
    updateCollection<Expense>('expenses', prev => prev.map((e) => (e.id === updatedExpense.id ? updatedExpense : e)));
  };

  const deleteExpense = (expenseId: string) => {
    updateCollection<Expense>('expenses', prev => prev.filter((e) => e.id !== expenseId));
  };

  // Income functions
  const addIncome = (incomeData: Omit<Income, "id" | "date"> & { date: Date }) => {
    const newIncome: Income = {
      ...incomeData,
      id: `inc_${Date.now()}`,
      date: incomeData.date.toISOString().split("T")[0],
    };
    updateCollection<Income>('incomes', prev => 
        [newIncome, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    );
  };

  const updateIncome = (incomeData: Omit<Income, "id" | "date"> & { id: string; date: Date }) => {
    const updatedIncome: Income = { ...incomeData, date: incomeData.date.toISOString().split("T")[0] };
    updateCollection<Income>('incomes', prev => prev.map((i) => (i.id === updatedIncome.id ? updatedIncome : i)));
  };

  const deleteIncome = (incomeId: string) => {
    updateCollection<Income>('incomes', prev => prev.filter((i) => i.id !== incomeId));
  };
  
  // Category functions
  const addCategory = (category: Omit<Category, 'id' | 'subcategories'>) => {
    const newCategory: Category = {
      ...category,
      id: `cat_${category.name.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}`,
      subcategories: [],
    };
    const collectionName = category.type === 'expense' ? 'expense-categories' : 'income-categories';
    updateCollection<Category>(collectionName, prev => [...prev, newCategory]);
  };

  const addSubcategory = (parentCategory: Category, subcategoryName: string) => {
    const newSubcategory: Subcategory = {
      id: `sub_${subcategoryName.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}`,
      name: subcategoryName.trim(),
    };
    const collectionName = parentCategory.type === "expense" ? 'expense-categories' : 'income-categories';
    updateCollection<Category>(collectionName, cats => cats.map(cat => 
        cat.id === parentCategory.id ? { ...cat, subcategories: [...cat.subcategories, newSubcategory] } : cat
    ));
  };

  // Transfer functions
  const addTransfer = (transferData: Omit<Transfer, "id" | "date"> & { date: Date }) => {
    const newTransfer: Transfer = {
      ...transferData,
      id: `trn_${Date.now()}`,
      date: transferData.date.toISOString().split("T")[0],
    };
    updateCollection<Transfer>('transfers', prev => [newTransfer, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    updateCollection<Account>('accounts', prevAccounts => prevAccounts.map(account => {
      if (account.id === newTransfer.fromAccountId) {
        return { ...account, balance: account.balance - newTransfer.amount };
      }
      if (account.id === newTransfer.toAccountId) {
        return { ...account, balance: account.balance + newTransfer.amount };
      }
      return account;
    }));
  };

  return {
    expenses: data.expenses, addExpense, updateExpense, deleteExpense,
    incomes: data.incomes, addIncome, updateIncome, deleteIncome,
    transfers: data.transfers, addTransfer,
    categories: data['expense-categories'], incomeCategories: data['income-categories'], 
    addCategory, addSubcategory,
    accounts: data.accounts, setAccounts: (updater) => updateCollection<Account>('accounts', updater),
    paymentMethods: data['payment-methods'], setPaymentMethods: (updater) => updateCollection<PaymentMethod>('payment-methods', updater),
    allCategories,
    getCategoryName,
    getSubcategoryName,
    getPaymentMethodName,
    getAccountName,
    loading,
  };
}
