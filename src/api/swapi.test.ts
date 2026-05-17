import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchCharacterById, fetchCharacters, getCharacterId } from './swapi';

const okResponse = (payload: unknown) =>
  ({ ok: true, status: 200, json: async () => payload }) as Response;

const failResponse = (status: number) =>
  ({ ok: false, status, json: async () => ({}) }) as Response;

describe('fetchCharacters', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(okResponse({ count: 0, next: null, previous: null, results: [] }))));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('requests the Star Wars API with an encoded search query and page', async () => {
    await fetchCharacters('darth vader', 3);

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('search=darth%20vader'));
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('page=3'));
  });

  it('defaults to page 1 when none is provided', async () => {
    await fetchCharacters('luke');

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('page=1'));
  });

  it('returns parsed JSON on success', async () => {
    const payload = {
      count: 1,
      next: null,
      previous: null,
      results: [{ name: 'Luke', birth_year: '19BBY', gender: 'male', url: 'u' }],
    };
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(okResponse(payload))));

    await expect(fetchCharacters('luke')).resolves.toEqual(payload);
  });

  it('throws when the server responds with an error status', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(failResponse(503))));

    await expect(fetchCharacters('')).rejects.toThrow(/503/);
  });

  it('surfaces HTTP 404 style failures', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(failResponse(404))));

    await expect(fetchCharacters('missing')).rejects.toThrow(/404/);
  });
});

describe('fetchCharacterById', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('requests the people resource by id', async () => {
    const payload = { name: 'Luke', birth_year: '19BBY', gender: 'male', url: '', height: '', mass: '', hair_color: '', skin_color: '', eye_color: '' };
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(okResponse(payload))));

    await expect(fetchCharacterById('1')).resolves.toEqual(payload);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/people/1/'));
  });

  it('throws on non-ok responses', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(failResponse(500))));

    await expect(fetchCharacterById('99')).rejects.toThrow(/500/);
  });
});

describe('getCharacterId', () => {
  it('extracts numeric id from a SWAPI url', () => {
    expect(getCharacterId('https://swapi.py4e.com/api/people/42/')).toBe('42');
    expect(getCharacterId('https://swapi.py4e.com/api/people/42')).toBe('42');
  });

  it('returns an empty string for unrecognized urls', () => {
    expect(getCharacterId('not-a-url')).toBe('');
  });
});
