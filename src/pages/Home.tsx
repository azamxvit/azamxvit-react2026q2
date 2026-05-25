import { useCallback, useEffect, useState } from 'react';
import type { MouseEvent } from 'react';
import { Outlet, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { CardList } from '../components/article-list/CardList';
import { Loader } from '../components/skeleton/Loader';
import { Pagination } from '../components/pagination/Pagination';
import { Search } from '../components/search/Search';
import { fetchCharacters } from '../api/swapi';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Character } from '../types/character';

const SEARCH_STORAGE_KEY = 'rss_search_term';

interface HomeState {
  results: Character[];
  count: number;
  hasPrevious: boolean;
  hasNext: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: HomeState = {
  results: [],
  count: 0,
  hasPrevious: false,
  hasNext: false,
  isLoading: false,
  error: null,
};

export function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { id: detailsId } = useParams();

  const [searchTerm, setSearchTerm] = useLocalStorage(SEARCH_STORAGE_KEY, '');
  const [state, setState] = useState<HomeState>(initialState);
  const [triggerError, setTriggerError] = useState(false);

  const pageParam = Number(searchParams.get('page'));
  const currentPage = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

  useEffect(() => {
    if (!searchParams.get('page')) {
      const next = new URLSearchParams(searchParams);
      next.set('page', '1');
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const data = await fetchCharacters(searchTerm, currentPage);
        if (cancelled) return;
        setState({
          results: data.results,
          count: data.count,
          hasPrevious: Boolean(data.previous),
          hasNext: Boolean(data.next),
          isLoading: false,
          error: null,
        });
      } catch (error) {
        if (cancelled) return;
        setState({
          results: [],
          count: 0,
          hasPrevious: false,
          hasNext: false,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Unknown error occurred',
        });
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [searchTerm, currentPage]);

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

  const handleThrowError = () => setTriggerError(true);
  if (triggerError) {
    throw new Error('This is a simulated application error!');
  }

  const showPagination = !state.isLoading && !state.error && state.results.length > 0;

  return (
    <div className={detailsId ? 'home home--split' : 'home'}>
      <section
        className="home__main"
        onClick={handleCloseDetails}
        data-testid="main-panel"
      >
        <div className="top-controls">
          <Search initialValue={searchTerm} onSearch={handleSearch} />
        </div>

        <div className="results-section">
          {state.error ? (
            <div className="api-error">{state.error}</div>
          ) : state.isLoading ? (
            <Loader />
          ) : (
            <CardList items={state.results} />
          )}
        </div>

        {showPagination && (
          <Pagination
            currentPage={currentPage}
            hasPrevious={state.hasPrevious}
            hasNext={state.hasNext}
            onPageChange={handlePageChange}
          />
        )}

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
