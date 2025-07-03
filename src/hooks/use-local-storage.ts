
"use client"

import { useState, useEffect, Dispatch, SetStateAction } from "react"

// A custom hook to synchronize state with localStorage
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    // Prevent build errors from server-side rendering
    if (typeof window === "undefined") {
      return initialValue
    }
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(error)
      return initialValue
    }
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue]
}
