'use client';

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('error');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="error-container">
      <h2>{t('title')}</h2>
      <p>{error.message}</p>
      <button type="button" onClick={() => reset()}>
        {t('reload')}
      </button>
    </div>
  );
}
