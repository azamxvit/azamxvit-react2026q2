import { useCallback, useEffect, useState } from 'react';
import type { MouseEvent } from 'react';
import { useIsFetching } from '@tanstack/react-query';
import { Outlet, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { queryKeys } from '@/api/queryKeys';
import { CardList } from '@/components/article-list/CardList';
import { FormsSection } from '@/components/forms/FormsSection';
import { Loader } from '@/components/skeleton/Loader';
import { Pagination } from '@/components/pagination/Pagination';
import { Search } from '@/components/search/Search';
import { UI_LABELS } from '@/constants/labels';
import { useCharactersQuery } from '@/hooks/useCharactersQuery';
import { useInvalidateDashboard } from '@/hooks/useInvalidateDashboard';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { getErrorMessage } from '@/lib/getErrorMessage';

const SEARCH_STORAGE_KEY = 'rss_search_term';

export function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { id: detailsId } = useParams();

  const [searchTerm, setSearchTerm] = useLocalStorage(SEARCH_STORAGE_KEY, '');
  const [triggerError, setTriggerError] = useState(false);

  const pageParam = Number(searchParams.get('page'));
  const currentPage = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

  const { data, isLoading, isFetching, isError, error } = useCharactersQuery(
    searchTerm,
    currentPage,
  );
  const invalidateDashboard = useInvalidateDashboard();
  const isDetailsFetching = useIsFetching(
    detailsId ? { queryKey: queryKeys.character.detail(detailsId) } : { queryKey: [] },
  );
  const isRefreshing = isFetching || (detailsId ? isDetailsFetching > 0 : false);

  useEffect(() => {
    if (!searchParams.get('page')) {
      const next = new URLSearchParams(searchParams);
      next.set('page', '1');
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleSearch = useCallback(
    (newSearchTerm: string) => {
      setSearchTerm(newSearchTerm);
      const next = new URLSearchParams(searchParams);
      next.set('page', '1');
      setSearchParams(next);
      if (detailsId) {
        navigate({ pathname: '/', search: `?${next.toString()}` });
      }
    },
    [detailsId, navigate, searchParams, setSearchParams, setSearchTerm],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      const next = new URLSearchParams(searchParams);
      next.set('page', String(page));
      const search = `?${next.toString()}`;
      const pathname = detailsId ? location.pathname : '/';
      navigate({ pathname, search });
    },
    [detailsId, location.pathname, navigate, searchParams],
  );

  const handleCloseDetails = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (e.target !== e.currentTarget) return;
      if (!detailsId) return;
      navigate({ pathname: '/', search: `?${searchParams.toString()}` });
    },
    [detailsId, navigate, searchParams],
  );

  const handleRefresh = () => {
    void invalidateDashboard({
      search: searchTerm,
      page: currentPage,
      detailsId,
    });
  };

  const handleThrowError = () => setTriggerError(true);
  if (triggerError) {
    throw new Error('This is a simulated application error!');
  }

  const results = data?.results ?? [];
  const errorMessage = isError ? getErrorMessage(error) : null;
  const showPagination = !isLoading && !errorMessage && results.length > 0;
  const showLoader = isLoading || (isFetching && !data);

  const renderResultsContent = () => {
    if (errorMessage) {
      return <div className="api-error">{errorMessage}</div>;
    }

    if (showLoader) {
      return <Loader />;
    }

    return <CardList items={results} />;
  };

  const renderPagination = () => {
    if (!showPagination || !data) {
      return null;
    }

    return (
      <Pagination
        currentPage={currentPage}
        hasPrevious={Boolean(data.previous)}
        hasNext={Boolean(data.next)}
        onPageChange={handlePageChange}
      />
    );
  };

  return (
    <div className={detailsId ? 'home home--split' : 'home'}>
      <section
        className="home__main"
        onClick={handleCloseDetails}
        data-testid="main-panel"
      >
        <FormsSection />

        <div className="top-controls">
          <Search initialValue={searchTerm} onSearch={handleSearch} />
          <button
            type="button"
            className="refresh-btn"
            onClick={handleRefresh}
            disabled={isRefreshing}
            aria-label={UI_LABELS.refresh.listAria}
          >
            {UI_LABELS.refresh.list}
          </button>
        </div>

        <div className="results-section">{renderResultsContent()}</div>

        {renderPagination()}

        <button type="button" className="error-btn" onClick={handleThrowError}>
          Throw Error
        </button>
      </section>

      {detailsId && (
        <aside className="home__details" data-testid="details-panel">
          <Outlet />
        </aside>
      )}
    </div>
  );
}
