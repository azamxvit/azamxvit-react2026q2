import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from '@/routes';
import * as swapi from '@/api/swapi';
import { QueryProvider } from '@/context/QueryProvider';
import { ThemeProvider } from '@/context/ThemeProvider';
import { useSelectedItemsStore } from '@/store/selectedItemsStore';
import { installLocalStorageMock } from '@/test-utils/localStorage';
import { createTestQueryClient } from '@/test-utils/queryClient';

vi.mock('@/api/swapi', async () => {
  const actual = await vi.importActual<typeof swapi>('@/api/swapi');
  return {
    ...actual,
    fetchCharacters: vi.fn(),
    fetchCharacterById: vi.fn(),
  };
});

const fetchCharacters = vi.mocked(swapi.fetchCharacters);
const fetchCharacterById = vi.mocked(swapi.fetchCharacterById);

const sampleCharacter = {
  name: 'Luke Skywalker',
  birth_year: '19BBY',
  gender: 'male',
  url: 'https://swapi.py4e.com/api/people/1/',
};

const renderApp = (route = '/') =>
  render(
    <QueryProvider client={createTestQueryClient()}>
      <ThemeProvider>
        <MemoryRouter initialEntries={[route]}>
          <AppRoutes />
        </MemoryRouter>
      </ThemeProvider>
    </QueryProvider>,
  );

describe('App routing & home page', () => {
  beforeEach(() => {
    useSelectedItemsStore.setState({ itemsByUrl: {} });
    vi.clearAllMocks();
    fetchCharacters.mockResolvedValue({
      count: 12,
      next: 'next-page',
      previous: null,
      results: [sampleCharacter],
    });
    fetchCharacterById.mockResolvedValue({
      ...sampleCharacter,
      height: '172',
      mass: '77',
      hair_color: 'blond',
      skin_color: 'fair',
      eye_color: 'blue',
    });
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches characters on mount using the stored search term', async () => {
    const { seed } = installLocalStorageMock();
    seed('rss_search_term', 'r2');

    renderApp('/');

    await waitFor(() => expect(fetchCharacters).toHaveBeenCalledWith('r2', 1));
    expect(await screen.findByText('Luke Skywalker')).toBeInTheDocument();
  });

  it('renders an empty search input when nothing is stored yet', async () => {
    installLocalStorageMock();
    renderApp('/');

    await waitFor(() => expect(fetchCharacters).toHaveBeenCalledWith('', 1));
    expect(screen.getByPlaceholderText(/search star wars/i)).toHaveValue('');
  });

  it('persists a new search term to localStorage and resets to page 1', async () => {
    const user = userEvent.setup();
    const { mockStorage } = installLocalStorageMock();
    renderApp('/?page=3');

    await waitFor(() => expect(fetchCharacters).toHaveBeenCalledWith('', 3));

    const input = screen.getByPlaceholderText(/search star wars/i);
    await user.clear(input);
    await user.type(input, 'han');
    await user.click(screen.getByRole('button', { name: /^search$/i }));

    await waitFor(() =>
      expect(mockStorage.setItem).toHaveBeenCalledWith('rss_search_term', 'han'),
    );
    await waitFor(() => expect(fetchCharacters).toHaveBeenLastCalledWith('han', 1));
  });

  it('shows a friendly API error message when the request fails', async () => {
    installLocalStorageMock();
    fetchCharacters.mockRejectedValueOnce(new Error('Network interruption'));

    renderApp('/');

    expect(await screen.findByText('Network interruption')).toBeInTheDocument();
  });

  it('shows the loader while data is loading', async () => {
    installLocalStorageMock();
    let finish!: (value: Awaited<ReturnType<typeof swapi.fetchCharacters>>) => void;
    fetchCharacters.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    );

    renderApp('/');

    expect(await screen.findByRole('status')).toHaveAccessibleName(/loading data/i);

    finish({ count: 0, next: null, previous: null, results: [] });

    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument());
    expect(screen.getByText('No results found.')).toBeInTheDocument();
  });

  it('renders pagination only after items are loaded and updates the URL on next/prev', async () => {
    installLocalStorageMock();
    const user = userEvent.setup();
    renderApp('/?page=1');

    await screen.findByText('Luke Skywalker');

    const pagination = await screen.findByRole('navigation', { name: /pagination/i });
    expect(within(pagination).getByTestId('current-page')).toHaveTextContent('Page 1');

    await user.click(within(pagination).getByRole('button', { name: /next/i }));
    await waitFor(() => expect(fetchCharacters).toHaveBeenLastCalledWith('', 2));
    await waitFor(() =>
      expect(
        within(screen.getByRole('navigation', { name: /pagination/i })).getByTestId(
          'current-page',
        ),
      ).toHaveTextContent('Page 2'),
    );
  });

  it('hides pagination while loading or when an error happens', async () => {
    installLocalStorageMock();
    fetchCharacters.mockRejectedValueOnce(new Error('boom'));

    renderApp('/');

    expect(await screen.findByText('boom')).toBeInTheDocument();
    expect(screen.queryByRole('navigation', { name: /pagination/i })).not.toBeInTheDocument();
  });

  it('opens the details panel via an Outlet route and shows a loading indicator', async () => {
    installLocalStorageMock();
    let resolveDetails!: (value: Awaited<ReturnType<typeof swapi.fetchCharacterById>>) => void;
    fetchCharacterById.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveDetails = resolve;
        }),
    );

    renderApp('/details/1?page=1');

    await screen.findByTestId('details-panel');
    const detailsPanel = screen.getByTestId('details-panel');
    expect(within(detailsPanel).getByRole('status')).toHaveAccessibleName(/loading details/i);

    resolveDetails({
      ...sampleCharacter,
      height: '172',
      mass: '77',
      hair_color: 'blond',
      skin_color: 'fair',
      eye_color: 'blue',
    });

    expect(await within(detailsPanel).findByRole('heading', { name: 'Luke Skywalker' })).toBeInTheDocument();
  });

  it('does not show the details panel on initial load', async () => {
    installLocalStorageMock();
    renderApp('/');

    await screen.findByText('Luke Skywalker');
    expect(screen.queryByTestId('details-panel')).not.toBeInTheDocument();
    expect(fetchCharacterById).not.toHaveBeenCalled();
  });

  it('closes the details panel via the close button', async () => {
    installLocalStorageMock();
    const user = userEvent.setup();
    renderApp('/details/1?page=1');

    await screen.findByTestId('details-panel');
    await user.click(screen.getByRole('button', { name: /close details/i }));

    await waitFor(() => expect(screen.queryByTestId('details-panel')).not.toBeInTheDocument());
  });

  it('closes the details panel when clicking the main panel background', async () => {
    installLocalStorageMock();
    const user = userEvent.setup();
    renderApp('/details/1?page=1');

    await screen.findByTestId('details-panel');
    await user.click(screen.getByTestId('main-panel'));

    await waitFor(() => expect(screen.queryByTestId('details-panel')).not.toBeInTheDocument());
  });

  it('clicking a card does not bubble up and close the details panel', async () => {
    installLocalStorageMock();
    const user = userEvent.setup();
    renderApp('/details/1?page=1');

    await screen.findByTestId('details-panel');

    const card = (await screen.findAllByTestId('character-card'))[0];
    await user.click(card);

    expect(screen.getByTestId('details-panel')).toBeInTheDocument();
  });

  it('routes thrown errors to the error boundary fallback UI', async () => {
    const user = userEvent.setup();
    installLocalStorageMock();
    renderApp('/');

    await screen.findByText('Luke Skywalker');

    await user.click(screen.getByRole('button', { name: /throw error/i }));

    expect(
      await screen.findByRole('heading', { name: /something went wrong/i }),
    ).toBeInTheDocument();
  });

  it('renders the About page and shows a course link', async () => {
    installLocalStorageMock();
    renderApp('/about');

    expect(await screen.findByRole('heading', { name: /about/i })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /rolling scopes school react course/i }),
    ).toBeInTheDocument();
  });

  it('renders the 404 page for unknown routes', async () => {
    installLocalStorageMock();
    renderApp('/some/unknown/path');

    expect(await screen.findByRole('heading', { name: /404/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to home/i })).toHaveAttribute('href', '/');
  });

  it('ensures ?page=1 is added to the URL when missing on initial load', async () => {
    installLocalStorageMock();
    renderApp('/');

    await waitFor(() => expect(fetchCharacters).toHaveBeenCalledWith('', 1));
    expect(await screen.findByText('Page 1')).toBeInTheDocument();
  });

  it('persists selected items across page navigation', async () => {
    const user = userEvent.setup();
    installLocalStorageMock();
    renderApp('/');

    await screen.findByText('Luke Skywalker');
    await user.click(screen.getByTestId('character-checkbox'));

    expect(screen.getByTestId('selection-flyout')).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: /^about$/i }));
    expect(await screen.findByRole('heading', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByText('1 item selected')).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: /^home$/i }));
    await screen.findByText('Luke Skywalker');
    expect(screen.getByTestId('character-checkbox')).toBeChecked();
  });

  it('unselects all items from the flyout', async () => {
    const user = userEvent.setup();
    installLocalStorageMock();
    renderApp('/');

    await screen.findByText('Luke Skywalker');
    await user.click(screen.getByTestId('character-checkbox'));
    await user.click(screen.getByRole('button', { name: /unselect all/i }));

    expect(screen.queryByTestId('selection-flyout')).not.toBeInTheDocument();
  });

  it('switches theme from the header control', async () => {
    const user = userEvent.setup();
    installLocalStorageMock();
    renderApp('/');

    await screen.findByTestId('theme-toggle');
    await user.click(screen.getByRole('radio', { name: /dark/i }));

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('reuses cached list data when returning to a previously visited page', async () => {
    installLocalStorageMock();
    const user = userEvent.setup();
    renderApp('/?page=1');

    await screen.findByText('Luke Skywalker');
    expect(fetchCharacters).toHaveBeenCalledTimes(1);

    const pagination = screen.getByRole('navigation', { name: /pagination/i });
    await user.click(within(pagination).getByRole('button', { name: /next/i }));
    await waitFor(() => expect(fetchCharacters).toHaveBeenCalledTimes(2));

    await user.click(within(pagination).getByRole('button', { name: /prev/i }));
    await screen.findByText('Luke Skywalker');
    expect(fetchCharacters).toHaveBeenCalledTimes(2);
  });

  it('refetches list data when Refresh is clicked', async () => {
    installLocalStorageMock();
    const user = userEvent.setup();
    renderApp('/');

    await screen.findByText('Luke Skywalker');
    expect(fetchCharacters).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: /refresh character list/i }));
    await waitFor(() => expect(fetchCharacters).toHaveBeenCalledTimes(2));
  });

  it('reuses cached character details when reopening the same item', async () => {
    installLocalStorageMock();
    const user = userEvent.setup();
    renderApp('/details/1?page=1');

    await screen.findByRole('heading', { name: 'Luke Skywalker' });
    expect(fetchCharacterById).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: /close details/i }));
    await waitFor(() => expect(screen.queryByTestId('details-panel')).not.toBeInTheDocument());

    await user.click(screen.getByTestId('character-card'));
    await screen.findByTestId('details-panel');
    expect(fetchCharacterById).toHaveBeenCalledTimes(1);
  });

  it('refetches details when Refresh is clicked', async () => {
    installLocalStorageMock();
    const user = userEvent.setup();
    renderApp('/details/1?page=1');

    await screen.findByRole('heading', { name: 'Luke Skywalker' });
    expect(fetchCharacterById).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: /refresh character details/i }));
    await waitFor(() => expect(fetchCharacterById).toHaveBeenCalledTimes(2));
  });
});
