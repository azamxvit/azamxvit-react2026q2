'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { refreshDashboardAction } from '@/actions';

export function RefreshButton() {
  const t = useTranslations('refresh');
  const pathname = usePathname();

  return (
    <form action={refreshDashboardAction}>
      <input type="hidden" name="pathname" value={pathname ?? '/'} />
      <button type="submit" className="refresh-btn" aria-label={t('listAria')}>
        {t('list')}
      </button>
    </form>
  );
}
