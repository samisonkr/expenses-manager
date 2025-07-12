
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { accounts, categories, incomeCategories, paymentMethods } from '@/lib/data';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await checkAndSeedUserData(user.uid);
        if (pathname === '/login') {
          router.push('/');
        }
      } else {
        setUser(null);
        if (pathname !== '/login') {
          router.push('/login');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, pathname]);

  const signOut = async () => {
    await firebaseSignOut(auth);
    router.push('/login');
  };

  const value = { user, loading, signOut };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

async function checkAndSeedUserData(userId: string) {
  const userDocRef = doc(db, 'users', userId);
  const userDocSnap = await getDoc(userDocRef);

  if (!userDocSnap.exists()) {
    // User is new, let's seed their data
    console.log(`New user detected (${userId}). Seeding initial data.`);
    const collectionsToSeed = {
      'expense-categories': categories,
      'income-categories': incomeCategories,
      'accounts': accounts,
      'payment-methods': paymentMethods,
      'expenses': [],
      'incomes': [],
      'transfers': [],
    };

    const batchWrites = Object.entries(collectionsToSeed).map(([name, data]) => {
      const collectionDocRef = doc(db, `users/${userId}/data`, name);
      return setDoc(collectionDocRef, { items: data });
    });

    try {
      await Promise.all(batchWrites);
      console.log("Initial data seeded successfully.");
    } catch (error) {
      console.error("Error seeding data: ", error);
    }
  }
}
