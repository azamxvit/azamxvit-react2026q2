'use client';

import { useLocale, useTranslations } from 'next-intl';
import { routing, usePathname, useRouter } from '@/i18n';
import type { AppLocale } from '@/i18n';

export function LanguageSwitcher() {
  const t = useTranslations('app.language');
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (nextLocale: AppLocale) => {
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <div className="language-switcher" data-testid="language-switcher">
      <span className="language-switcher__label">{t('label')}</span>
      {routing.locales.map((option) => (
        <label key={option} className="language-switcher__option">
          <input
            type="radio"
            name="language"
            value={option}
            checked={locale === option}
            onChange={() => handleChange(option)}
          />
          {t(option)}
        </label>
      ))}
    </div>
  );
}
