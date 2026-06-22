'use client';

import { useTranslations } from 'next-intl';
import { THEME, useTheme } from '@/context';

const themeOptions = Object.values(THEME);

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations('theme');

  return (
    <div className="theme-toggle" data-testid="theme-toggle">
      <span className="theme-toggle__label">{t('label')}</span>
      {themeOptions.map((option) => (
        <label key={option} className="theme-toggle__option">
          <input
            type="radio"
            name="theme"
            value={option}
            checked={theme === option}
            onChange={() => setTheme(option)}
          />
          {t(option)}
        </label>
      ))}
    </div>
  );
}
