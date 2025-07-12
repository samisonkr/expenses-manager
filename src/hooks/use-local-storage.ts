
"use client"

import { useState, useEffect, Dispatch, SetStateAction, useCallback } from "react"

// A custom hook to synchronize state with localStorage
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // We only want to run this effect on the client
  useEffect(() => {
    let item;
    try {
      if (typeof window !== "undefined") {
        item = window.localStorage.getItem(key);
      }
      setStoredValue(item ? JSON.parse(item) : initialValue);
    } catch (error) {
      console.error(error);
      setStoredValue(initialValue);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setValue: Dispatch<SetStateAction<T>> = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);


  return [storedValue, setValue];
}
