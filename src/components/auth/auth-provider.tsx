
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User, signOut as firebaseSignOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db, initializeFirebaseApp, isFirebaseInitialized as firebaseIsReady } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { doc, setDoc, getDoc, writeBatch } from 'firebase/firestore';
import { accounts as defaultAccounts, categories as defaultCategories, incomeCategories as defaultIncomeCategories, paymentMethods as defaultPaymentMethods } from '@/lib/data';

// This configuration is now built inside the provider
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

type AuthMode = 'loading' | 'guest' | 'authenticated';

interface AuthContextType {
  user: User | null;
  authMode: AuthMode;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => void;
  continueAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GUEST_KEY = 'is-guest-user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>('loading');
  const [isFirebaseInitialized, setIsFirebaseInitialized] = useState(firebaseIsReady);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Initialize Firebase here, passing the config object
    if (!isFirebaseInitialized) {
      initializeFirebaseApp(firebaseConfig);
      // We read the initialized status back from the module
      setIsFirebaseInitialized(firebaseIsReady);
    }
  }, [isFirebaseInitialized]);

  useEffect(() => {
    // This effect runs only after firebase is initialized (or initialization was attempted).
    if (!isFirebaseInitialized || !auth) {
      // If firebase isn't ready or failed to init, default to guest mode
      const isGuest = sessionStorage.getItem(GUEST_KEY) === 'true';
      if (!isGuest && pathname !== '/login') {
        continueAsGuest(); // Put user in guest mode
      }
      setAuthMode('guest');
      return;
    }
    
    const isGuest = sessionStorage.getItem(GUEST_KEY) === 'true';

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        sessionStorage.removeItem(GUEST_KEY);
        setUser(user);
        setAuthMode('authenticated');
        await checkAndSeedUserData(user.uid);
        if (pathname === '/login') {
          router.push('/');
        }
      } else {
        if (isGuest) {
          setAuthMode('guest');
          if (pathname === '/login') {
            router.push('/');
          }
        } else {
          setAuthMode('loading'); // Not guest, not logged in, so show loading/redirect
          if (pathname !== '/login') {
            router.push('/login');
          }
        }
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [router, pathname, isFirebaseInitialized]);


  const continueAsGuest = () => {
    sessionStorage.setItem(GUEST_KEY, 'true');
    setAuthMode('guest');
    setUser(null);
  };

  const signInWithGoogle = async () => {
    if (!isFirebaseInitialized || !auth) {
        console.error("Firebase is not initialized, cannot sign in.");
        return;
    }
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // The onAuthStateChanged listener will handle the redirect and state changes
    } catch (error) {
      console.error('Error signing in with Google: ', error);
    }
  };

  const signOut = async () => {
    sessionStorage.removeItem(GUEST_KEY);
    if (auth) {
      await firebaseSignOut(auth);
    }
    setAuthMode('loading'); // This will trigger the useEffect to redirect to /login
    setUser(null);
    router.push('/login');
  };

  const loading = authMode === 'loading' && pathname !== '/login';

  const value = { user, authMode, loading, signInWithGoogle, signOut, continueAsGuest };

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
  if (!db) return;
  const userDocRef = doc(db, 'users', userId);
  const userDocSnap = await getDoc(userDocRef);

  if (!userDocSnap.exists()) {
    // User is new, let's see if there's local data to migrate
    const localDataCollections = ['expenses', 'incomes', 'transfers', 'expense-categories', 'income-categories', 'accounts', 'payment-methods'];
    let hasLocalData = false;
    const localData: Record<string, any> = {};

    for (const name of localDataCollections) {
      const localJson = localStorage.getItem(`app-data-${name}`);
      if (localJson) {
        const items = JSON.parse(localJson);
        if (items && items.length > 0) {
          hasLocalData = true;
          localData[name] = items;
        }
      }
    }

    const batch = writeBatch(db);
    
    if (hasLocalData) {
      console.log(`New user (${userId}), migrating local data to Firestore.`);
      Object.entries(localData).forEach(([name, items]) => {
        const collectionDocRef = doc(db, `users/${userId}/data`, name);
        batch.set(collectionDocRef, { items });
      });
      // Clear local storage after migration
      localDataCollections.forEach(name => localStorage.removeItem(`app-data-${name}`));
    } else {
      console.log(`New user (${userId}), seeding initial data.`);
      const collectionsToSeed = {
        'expense-categories': defaultCategories,
        'income-categories': defaultIncomeCategories,
        'accounts': defaultAccounts,
        'payment-methods': defaultPaymentMethods,
        'expenses': [],
        'incomes': [],
        'transfers': [],
      };
      Object.entries(collectionsToSeed).forEach(([name, data]) => {
        const collectionDocRef = doc(db, `users/${userId}/data`, name);
        batch.set(collectionDocRef, { items: data });
      });
    }

    try {
      await batch.commit();
      console.log("Data migration/seeding completed successfully.");
    } catch (error) {
      console.error("Error writing batch data: ", error);
    }
  }
}
