import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n';
import { buildDetailsPath, buildHomePath } from '@/lib';

type PaginationNavProps = {
  currentPage: number;
  hasPrevious: boolean;
  hasNext: boolean;
  query: string;
  detailsId?: string;
};

const buildQuery = (query: string, page: number) => ({
  q: query,
  page: String(page),
});

export async function PaginationNav({
  currentPage,
  hasPrevious,
  hasNext,
  query,
  detailsId,
}: PaginationNavProps) {
  const t = await getTranslations('pagination');

  const previousHref = detailsId
    ? buildDetailsPath(detailsId, buildQuery(query, currentPage - 1))
    : buildHomePath(buildQuery(query, currentPage - 1));

  const nextHref = detailsId
    ? buildDetailsPath(detailsId, buildQuery(query, currentPage + 1))
    : buildHomePath(buildQuery(query, currentPage + 1));

  return (
    <nav className="pagination" aria-label={t('ariaLabel')}>
      {hasPrevious ? (
        <Link href={previousHref}>{t('prev')}</Link>
      ) : (
        <span className="pagination__disabled">{t('prev')}</span>
      )}
      <span className="pagination__current" data-testid="current-page">
        {t('page', { page: currentPage })}
      </span>
      {hasNext ? (
        <Link href={nextHref}>{t('next')}</Link>
      ) : (
        <span className="pagination__disabled">{t('next')}</span>
      )}
    </nav>
  );
}
