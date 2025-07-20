
"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { db } from "@/lib/firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"
import type { Account, Category, Expense, Income, PaymentMethod, Subcategory, Transfer } from "@/lib/types"
import { accounts as defaultAccounts, categories as defaultCategories, incomeCategories as defaultIncomeCategories, paymentMethods as defaultPaymentMethods } from "@/lib/data"
import { useLocalStorage } from "./use-local-storage"

type DataCollections = {
  expenses: Expense[];
  incomes: Income[];
  transfers: Transfer[];
  'expense-categories': Category[];
  'income-categories': Category[];
  accounts: Account[];
  'payment-methods': PaymentMethod[];
}

const collectionNames: (keyof DataCollections)[] = [
  'expenses', 'incomes', 'transfers', 
  'expense-categories', 'income-categories', 
  'accounts', 'payment-methods'
];

const defaultData: DataCollections = {
  'expense-categories': defaultCategories,
  'income-categories': defaultIncomeCategories,
  'accounts': defaultAccounts,
  'payment-methods': defaultPaymentMethods,
  expenses: [],
  incomes: [],
  transfers: [],
};

// This new hook manages data source based on auth state
export function useAppData() {
  const { user, authMode } = useAuth();
  
  // States for local and firestore data
  const [localData, setLocalData] = useState<DataCollections | null>(null);
  const [firestoreData, setFirestoreData] = useState<DataCollections | null>(null);
  const [loading, setLoading] = useState(true);

  // --- Local Storage Management for Guest Mode ---
  const [localExpenses, setLocalExpenses] = useLocalStorage<Expense[]>('app-data-expenses', defaultData.expenses);
  const [localIncomes, setLocalIncomes] = useLocalStorage<Income[]>('app-data-incomes', defaultData.incomes);
  const [localTransfers, setLocalTransfers] = useLocalStorage<Transfer[]>('app-data-transfers', defaultData.transfers);
  const [localExpenseCategories, setLocalExpenseCategories] = useLocalStorage<Category[]>('app-data-expense-categories', defaultData['expense-categories']);
  const [localIncomeCategories, setLocalIncomeCategories] = useLocalStorage<Category[]>('app-data-income-categories', defaultData['income-categories']);
  const [localAccounts, setLocalAccounts] = useLocalStorage<Account[]>('app-data-accounts', defaultData.accounts);
  const [localPaymentMethods, setLocalPaymentMethods] = useLocalStorage<PaymentMethod[]>('app-data-payment-methods', defaultData['payment-methods']);
  const [localCurrency, setLocalCurrency] = useLocalStorage<string>('app-data-currency', 'USD');


  useEffect(() => {
    if (authMode === 'guest') {
      setLocalData({
        expenses: localExpenses,
        incomes: localIncomes,
        transfers: localTransfers,
        'expense-categories': localExpenseCategories,
        'income-categories': localIncomeCategories,
        accounts: localAccounts,
        'payment-methods': localPaymentMethods,
      });
    }
  }, [authMode, localExpenses, localIncomes, localTransfers, localExpenseCategories, localIncomeCategories, localAccounts, localPaymentMethods]);

  // --- Firestore Management for Authenticated Mode ---
  const [firestoreCurrency, setFirestoreCurrency] = useState('USD');

  const fetchFromFirestore = useCallback(async (collectionName: keyof DataCollections) => {
    if (!user) return [];
    try {
      const docRef = doc(db, `users/${user.uid}/data`, collectionName);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data().items || [] : defaultData[collectionName] || [];
    } catch (error) {
      console.error(`Error fetching ${collectionName} from Firestore:`, error);
      return defaultData[collectionName] || [];
    }
  }, [user]);

  const saveToFirestore = useCallback(async (collectionName: keyof DataCollections, items: any[]) => {
    if (!user) return;
    try {
      const docRef = doc(db, `users/${user.uid}/data`, collectionName);
      await setDoc(docRef, { items });
    } catch (error) {
      console.error(`Error saving ${collectionName} to Firestore:`, error);
    }
  }, [user]);

  const fetchSettingsFromFirestore = useCallback(async () => {
    if (!user) return { currency: 'USD' };
    try {
        const docRef = doc(db, `users/${user.uid}/data`, 'settings');
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data() : { currency: 'USD' };
    } catch (error) {
        console.error(`Error fetching settings from Firestore:`, error);
        return { currency: 'USD' };
    }
  }, [user]);

  const saveSettingsToFirestore = useCallback(async (settings: { currency: string }) => {
    if (!user) return;
    try {
        const docRef = doc(db, `users/${user.uid}/data`, 'settings');
        await setDoc(docRef, settings);
    } catch (error) {
        console.error(`Error saving settings to Firestore:`, error);
    }
  }, [user]);

  useEffect(() => {
    if (authMode === 'authenticated' && user) {
      setLoading(true);
      const fetchAllData = async () => {
        const allDataPromise = Promise.all(
          collectionNames.map(name => fetchFromFirestore(name))
        );
        const settingsPromise = fetchSettingsFromFirestore();

        const [allData, settings] = await Promise.all([allDataPromise, settingsPromise]);

        setFirestoreData({
          expenses: allData[0],
          incomes: allData[1],
          transfers: allData[2],
          'expense-categories': allData[3],
          'income-categories': allData[4],
          accounts: allData[5],
          'payment-methods': allData[6],
        });
        setFirestoreCurrency(settings.currency);
        setLoading(false);
      };
      fetchAllData();
    }
  }, [authMode, user, fetchFromFirestore, fetchSettingsFromFirestore]);
  
  // --- Unified Data Source Logic ---
  const data = authMode === 'guest' ? localData : firestoreData;
  const currency = authMode === 'guest' ? localCurrency : firestoreCurrency;

  useEffect(() => {
    if (authMode !== 'loading') {
      if (authMode === 'guest' && localData) setLoading(false);
      if (authMode === 'authenticated' && firestoreData) setLoading(false);
    } else {
      setLoading(true);
    }
  }, [authMode, localData, firestoreData]);

  const setCurrency = async (newCurrency: string) => {
    if (authMode === 'guest') {
        setLocalCurrency(newCurrency);
    } else if (authMode === 'authenticated') {
        setFirestoreCurrency(newCurrency);
        await saveSettingsToFirestore({ currency: newCurrency });
    }
  };


  const updateCollection = async <T>(name: keyof DataCollections, updateFn: (prev: T[]) => T[]) => {
      if (authMode === 'guest') {
          const setters: Record<keyof DataCollections, Function> = {
            expenses: setLocalExpenses,
            incomes: setLocalIncomes,
            transfers: setLocalTransfers,
            'expense-categories': setLocalExpenseCategories,
            'income-categories': setLocalIncomeCategories,
            accounts: setLocalAccounts,
            'payment-methods': setLocalPaymentMethods,
          };
          setters[name]((prev: T[]) => updateFn(prev || []));
      } else if (authMode === 'authenticated' && data) {
          const currentItems = (data[name] as T[]) || [];
          const updatedItems = updateFn(currentItems);
          setFirestoreData(prev => prev ? ({ ...prev, [name]: updatedItems }) : null);
          await saveToFirestore(name, updatedItems);
      }
  };

  const updateAccountBalance = (paymentMethodId: string, amount: number, transactionType: 'add' | 'subtract') => {
    const paymentMethod = data?.['payment-methods'].find(pm => pm.id === paymentMethodId);
    if (!paymentMethod || !paymentMethod.accountId) return;
    
    updateCollection<Account>('accounts', prevAccounts =>
      prevAccounts.map(account => {
        if (account.id === paymentMethod.accountId) {
          const newBalance = transactionType === 'add' ? account.balance + amount : account.balance - amount;
          return { ...account, balance: newBalance };
        }
        return account;
      })
    );
  };

  if (loading || !data) {
    return { loading: true, expenses: [], incomes: [], transfers: [], categories: [], incomeCategories: [], accounts: [], paymentMethods: [], allCategories: [], currency: 'USD', setCurrency: () => {}, addExpense: () => {}, updateExpense: () => {}, deleteExpense: () => {}, addIncome: () => {}, updateIncome: () => {}, deleteIncome: () => {}, addTransfer: () => {}, addCategory: () => {}, addSubcategory: () => {}, setAccounts: () => {}, setPaymentMethods: () => {}, getCategoryName: () => '', getSubcategoryName: () => '', getPaymentMethodName: () => '', getAccountName: () => '' };
  }

  const allCategories = [...data['expense-categories'], ...data['income-categories']];

  const getCategoryName = (id: string) => allCategories.find((c) => c.id === id)?.name ?? "N/A";
  const getSubcategoryName = (catId: string, subId: string) =>
    allCategories
      .find((c) => c.id === catId)
      ?.subcategories.find((s) => s.id === subId)?.name ?? "N/A";
  const getPaymentMethodName = (id: string) =>
    data['payment-methods'].find((p) => p.id === id)?.name ?? "N/A";
  const getAccountName = (id: string) => data.accounts.find((a) => a.id === id)?.name ?? "N/A";

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
    updateAccountBalance(newExpense.paymentMethodId, newExpense.amount, 'subtract');
  };
  const updateExpense = (expenseData: Omit<Expense, "id" | "date"> & { id: string; date: Date }) => {
    const originalExpense = data.expenses.find(e => e.id === expenseData.id);
    if (!originalExpense) return;

    const updatedExpense: Expense = { ...expenseData, date: expenseData.date.toISOString().split("T")[0] };
    
    // Revert original transaction and apply new one
    updateAccountBalance(originalExpense.paymentMethodId, originalExpense.amount, 'add');
    updateAccountBalance(updatedExpense.paymentMethodId, updatedExpense.amount, 'subtract');

    updateCollection<Expense>('expenses', prev => prev.map((e) => (e.id === updatedExpense.id ? updatedExpense : e)));
  };
  const deleteExpense = (expenseId: string) => {
    const expenseToDelete = data.expenses.find(e => e.id === expenseId);
    if (!expenseToDelete) return;
    
    updateAccountBalance(expenseToDelete.paymentMethodId, expenseToDelete.amount, 'add');
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
    updateAccountBalance(newIncome.paymentMethodId, newIncome.amount, 'add');
  };
  const updateIncome = (incomeData: Omit<Income, "id" | "date"> & { id: string; date: Date }) => {
    const originalIncome = data.incomes.find(i => i.id === incomeData.id);
    if (!originalIncome) return;

    const updatedIncome: Income = { ...incomeData, date: incomeData.date.toISOString().split("T")[0] };

    // Revert original and apply new
    updateAccountBalance(originalIncome.paymentMethodId, originalIncome.amount, 'subtract');
    updateAccountBalance(updatedIncome.paymentMethodId, updatedIncome.amount, 'add');

    updateCollection<Income>('incomes', prev => prev.map((i) => (i.id === updatedIncome.id ? updatedIncome : i)));
  };
  const deleteIncome = (incomeId: string) => {
    const incomeToDelete = data.incomes.find(i => i.id === incomeId);
    if (!incomeToDelete) return;

    updateAccountBalance(incomeToDelete.paymentMethodId, incomeToDelete.amount, 'subtract');
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
    currency,
    setCurrency,
    getCategoryName,
    getSubcategoryName,
    getPaymentMethodName,
    getAccountName,
    loading,
  };
}
