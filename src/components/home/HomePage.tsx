import { Suspense } from 'react';
import { fetchCharacters } from '@/services';
import { getErrorMessage } from '@/lib';
import { DetailsPanel } from './DetailsPanel';
import { PaginationNav } from './PaginationNav';
import { RefreshButton } from './RefreshButton';
import { ResultsSection } from './ResultsSection';
import { SearchForm } from './SearchForm';
import { ThrowErrorButton } from './ThrowErrorButton';

type HomePageProps = {
  searchParams: Record<string, string | string[] | undefined>;
  detailsId?: string;
};

const getQueryValue = (value: string | string[] | undefined): string => {
  if (Array.isArray(value)) {
    return value[0] ?? '';
  }

  return value ?? '';
};

const getPageNumber = (value: string | string[] | undefined): number => {
  const pageParam = Number(getQueryValue(value));
  return Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
};

export async function HomePage({ searchParams, detailsId }: HomePageProps) {
  const query = getQueryValue(searchParams.q);
  const currentPage = getPageNumber(searchParams.page);

  let data = null;
  let errorMessage: string | null = null;

  try {
    data = await fetchCharacters(query, currentPage);
  } catch (error) {
    errorMessage = getErrorMessage(error);
  }

  const results = data?.results ?? [];
  const showPagination = !errorMessage && results.length > 0;

  return (
    <div className={detailsId ? 'home home--split' : 'home'}>
      <section className="home__main" data-testid="main-panel">
        <div className="top-controls">
          <SearchForm initialQuery={query} />
          <RefreshButton />
        </div>

        <ResultsSection items={results} errorMessage={errorMessage} />

        {showPagination && data ? (
          <PaginationNav
            currentPage={currentPage}
            hasPrevious={Boolean(data.previous)}
            hasNext={Boolean(data.next)}
            query={query}
            detailsId={detailsId}
          />
        ) : null}

        <ThrowErrorButton />
      </section>

      <aside className="home__details" data-testid="details-panel">
        {detailsId ? (
          <Suspense fallback={<div className="details" />}>
            <DetailsPanel characterId={detailsId} />
          </Suspense>
        ) : null}
      </aside>
    </div>
  );
}
