import { useState, useEffect } from "react";

/**
 * Custom hook to debounce values (e.g. search input fields).
 * Prevents rapid subsequent API calls by waiting for user typing to pause.
 * 
 * @param value The value to debounce
 * @param delay The debounce delay in milliseconds (default: 300ms)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
