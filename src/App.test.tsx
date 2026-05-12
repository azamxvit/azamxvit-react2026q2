import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import App from './App';
import * as swapi from './api/swapi';
import { installLocalStorageMock } from './test-utils/localStorage';

vi.mock('./api/swapi', () => ({
  fetchCharacters: vi.fn(),
}));

const fetchCharacters = vi.mocked(swapi.fetchCharacters);

const sampleCharacter = {
  name: 'Luke Skywalker',
  birth_year: '19BBY',
  gender: 'male',
  url: 'https://swapi.py4e.com/api/people/1/',
};

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchCharacters.mockResolvedValue({
      count: 1,
      next: null,
      previous: null,
      results: [sampleCharacter],
    });
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches characters on mount', async () => {
    installLocalStorageMock();
    render(<App />);

    await waitFor(() => expect(fetchCharacters).toHaveBeenCalledWith(''));
    await screen.findByText('Luke Skywalker');
  });

  it('uses the search term stored in localStorage for the first fetch', async () => {
    const { seed } = installLocalStorageMock();
    seed('rss_search_term', 'r2');

    fetchCharacters.mockResolvedValue({
      count: 0,
      next: null,
      previous: null,
      results: [],
    });

    render(<App />);

    await waitFor(() => expect(fetchCharacters).toHaveBeenCalledWith('r2'));
    expect(screen.getByPlaceholderText(/search star wars/i)).toHaveValue('r2');
  });

  it('shows an empty search input when nothing is stored yet', async () => {
    installLocalStorageMock();
    render(<App />);

    await waitFor(() => expect(fetchCharacters).toHaveBeenCalled());
    expect(screen.getByPlaceholderText(/search star wars/i)).toHaveValue('');
  });

  it('persists a new search term to localStorage and refreshes results', async () => {
    const user = userEvent.setup();
    const { mockStorage } = installLocalStorageMock();

    render(<App />);
    await screen.findByText('Luke Skywalker');

    fetchCharacters.mockResolvedValueOnce({
      count: 1,
      next: null,
      previous: null,
      results: [
        {
          name: 'Han Solo',
          birth_year: '29BBY',
          gender: 'male',
          url: 'https://swapi.py4e.com/api/people/14/',
        },
      ],
    });

    const input = screen.getByPlaceholderText(/search star wars/i);
    await user.clear(input);
    await user.type(input, 'han');
    await user.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() =>
      expect(mockStorage.setItem).toHaveBeenCalledWith('rss_search_term', 'han'),
    );
    await screen.findByText('Han Solo');
    expect(fetchCharacters).toHaveBeenCalledWith('han');
  });

  it('does not trigger another fetch when submitting the same term again', async () => {
    const user = userEvent.setup();
    installLocalStorageMock();

    render(<App />);
    await screen.findByText('Luke Skywalker');

    const initialCalls = fetchCharacters.mock.calls.length;

    await user.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => expect(fetchCharacters.mock.calls.length).toBe(initialCalls));
  });

  it('shows a friendly API error message when the request fails', async () => {
    installLocalStorageMock();
    fetchCharacters.mockRejectedValueOnce(new Error('Network interruption'));

    render(<App />);

    expect(await screen.findByText('Network interruption')).toBeInTheDocument();
    expect(screen.queryByText('Luke Skywalker')).not.toBeInTheDocument();
  });

  it('shows a generic message when the API rejects with a non-Error value', async () => {
    installLocalStorageMock();
    fetchCharacters.mockRejectedValueOnce('unexpected');

    render(<App />);

    expect(await screen.findByText('Unknown error occurred')).toBeInTheDocument();
  });

  it('shows the loader while data is loading', async () => {
    installLocalStorageMock();

    let finish!: (value: {
      count: number;
      next: null;
      previous: null;
      results: typeof sampleCharacter[];
    }) => void;
    fetchCharacters.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    );

    render(<App />);

    expect(screen.getByText(/loading data/i)).toBeInTheDocument();

    finish({
      count: 0,
      next: null,
      previous: null,
      results: [],
    });

    await waitFor(() => expect(screen.queryByText(/loading data/i)).not.toBeInTheDocument());
    expect(screen.getByText('No results found.')).toBeInTheDocument();
  });

  it('renders the card list after loading completes', async () => {
    installLocalStorageMock();
    render(<App />);

    const main = screen.getByRole('main');
    await waitFor(() =>
      expect(within(main).getByRole('heading', { name: 'Luke Skywalker' })).toBeInTheDocument(),
    );
  });

  it('routes thrown errors through the error boundary', async () => {
    const user = userEvent.setup();
    installLocalStorageMock();
    render(<App />);

    await screen.findByText('Luke Skywalker');

    await user.click(screen.getByRole('button', { name: /throw error/i }));

    expect(await screen.findByRole('heading', { name: /something went wrong/i })).toBeInTheDocument();
    expect(screen.getByText(/simulated application error/i)).toBeInTheDocument();
  });
});
