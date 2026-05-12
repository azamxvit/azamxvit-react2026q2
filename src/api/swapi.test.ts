import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchCharacters } from './swapi';

describe('fetchCharacters', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({
            count: 0,
            next: null,
            previous: null,
            results: [],
          }),
        } as Response),
      ),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('requests the Star Wars API with an encoded search query', async () => {
    await fetchCharacters('darth vader');

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('people/?search=darth%20vader'));
  });

  it('returns parsed JSON on success', async () => {
    const payload = {
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
    };

    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => payload,
        } as Response),
      ),
    );

    await expect(fetchCharacters('luke')).resolves.toEqual(payload);
  });

  it('throws when the server responds with an error status', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 503,
          json: async () => ({}),
        } as Response),
      ),
    );

    await expect(fetchCharacters('')).rejects.toThrow(/503/);
  });

  it('surfaces HTTP 404 style failures', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 404,
          json: async () => ({}),
        } as Response),
      ),
    );

    await expect(fetchCharacters('missing')).rejects.toThrow(/404/);
  });
});
