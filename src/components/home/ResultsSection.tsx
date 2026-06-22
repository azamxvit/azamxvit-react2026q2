import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { CardList } from '@/components/article-list';
import type { Character } from '@/types';

type ResultsSectionProps = {
  items: Character[];
  errorMessage: string | null;
};

export async function ResultsSection({ items, errorMessage }: ResultsSectionProps) {
  const t = await getTranslations('results');

  if (errorMessage) {
    return <div className="api-error">{errorMessage}</div>;
  }

  if (items.length === 0) {
    return <p>{t('empty')}</p>;
  }

  return (
    <Suspense fallback={<p>{t('empty')}</p>}>
      <CardList items={items} />
    </Suspense>
  );
}
