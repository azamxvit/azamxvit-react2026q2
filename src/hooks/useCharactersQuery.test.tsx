import type { ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import * as swapi from '../api/swapi';
import { QueryProvider } from '../context/QueryProvider';
import { useCharactersQuery } from './useCharactersQuery';
import { createTestQueryClient } from '../test-utils/queryClient';

vi.mock('../api/swapi', async () => {
  const actual = await vi.importActual<typeof swapi>('../api/swapi');
  return {
    ...actual,
    fetchCharacters: vi.fn(),
  };
});

const fetchCharacters = vi.mocked(swapi.fetchCharacters);

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryProvider client={createTestQueryClient()}>{children}</QueryProvider>
);

describe('useCharactersQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchCharacters.mockResolvedValue({
      count: 1,
      next: null,
      previous: null,
      results: [
        {
          name: 'Luke Skywalker',
          birth_year: '19BBY',
          gender: 'male',
          url: 'https://swapi.py4e.com/api/people/1/',
        },
      ],
    });
  });

  it('loads character list data', async () => {
    const { result } = renderHook(() => useCharactersQuery('luke', 1), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchCharacters).toHaveBeenCalledWith('luke', 1);
    expect(result.current.data?.results[0]?.name).toBe('Luke Skywalker');
  });

  it('exposes loading and error states', async () => {
    fetchCharacters.mockRejectedValueOnce(new Error('Query failed'));

    const { result } = renderHook(() => useCharactersQuery('', 1), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeInstanceOf(Error);
    expect((result.current.error as Error).message).toBe('Query failed');
  });
});
