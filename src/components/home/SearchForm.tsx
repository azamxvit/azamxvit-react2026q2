'use client';

import { useTranslations } from 'next-intl';
import { searchCharactersAction } from '@/actions';

export function SearchForm({ initialQuery }: { initialQuery: string }) {
  const t = useTranslations('search');

  return (
    <form className="search-section" action={searchCharactersAction}>
      <input
        type="text"
        name="q"
        defaultValue={initialQuery}
        placeholder={t('placeholder')}
      />
      <button type="submit">{t('submit')}</button>
    </form>
  );
}
