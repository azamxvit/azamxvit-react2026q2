import { useCallback, useEffect, useState } from 'react';

const readFromStorage = (key: string, fallback: string): string => {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ?? fallback;
  } catch {
    return fallback;
  }
};

export function useLocalStorage(
  key: string,
  initialValue = '',
): [string, (value: string) => void] {
  const [value, setValue] = useState<string>(() => readFromStorage(key, initialValue));

  useEffect(() => {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      /* storage unavailable — keep in-memory value only */
    }
  }, [key, value]);

  const updateValue = useCallback((next: string) => {
    setValue(next);
  }, []);

  return [value, updateValue];
}
