'use client';

import { useTranslations } from 'next-intl';
import { usePathname, useSearchParams } from 'next/navigation';
import { Link } from '@/i18n';
import { refreshDashboardAction } from '@/actions';
import { buildHomePath } from '@/lib';

export function DetailsToolbar() {
  const t = useTranslations('refresh');
  const closeLabel = useTranslations('details');
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const closeQuery = {
    q: searchParams?.get('q') ?? '',
    page: searchParams?.get('page') ?? '1',
  };

  return (
    <div className="details__toolbar">
      <form action={refreshDashboardAction}>
        <input type="hidden" name="pathname" value={pathname ?? '/'} />
        <button type="submit" className="refresh-btn" aria-label={t('detailsAria')}>
          {t('details')}
        </button>
      </form>
      <Link
        href={buildHomePath(closeQuery)}
        className="details__close"
        aria-label={closeLabel('closeAria')}
      >
        ×
      </Link>
    </div>
  );
}
