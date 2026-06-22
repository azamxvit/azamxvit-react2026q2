import { createContext } from 'react';

export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

export type Theme = (typeof THEME)[keyof typeof THEME];

export interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);
