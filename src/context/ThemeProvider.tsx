'use client';

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { THEME, ThemeContext, type Theme } from './themeContext';

const STORAGE_KEY = 'rss_theme';

interface ThemeProviderProps {
  children: ReactNode;
}

const readStoredTheme = (): Theme => {
  if (typeof window === 'undefined') {
    return THEME.LIGHT;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === THEME.DARK ? THEME.DARK : THEME.LIGHT;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => readStoredTheme());

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const setTheme = useCallback((nextTheme: Theme) => {
    setThemeState(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT);
  }, [setTheme, theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
    }),
    [theme, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
