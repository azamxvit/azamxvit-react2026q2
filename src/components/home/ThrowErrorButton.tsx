'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

export function ThrowErrorButton() {
  const t = useTranslations('error');
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error('This is a simulated application error!');
  }

  return (
    <button type="button" className="error-btn" onClick={() => setShouldThrow(true)}>
      {t('throw')}
    </button>
  );
}
