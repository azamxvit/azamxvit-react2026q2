import type { ApiResponse, CharacterDetails } from '@/types';

const PRIMARY_BASE_URL = 'https://swapi.py4e.com/api/people';
const FALLBACK_BASE_URL = 'https://swapi.dev/api/people';

const getBaseUrl = () => process.env.SWAPI_PEOPLE_BASE_URL ?? PRIMARY_BASE_URL;

const buildSwapiUrl = (baseUrl: string, path: string) => `${baseUrl}${path}`;

const requestSwapi = async (path: string): Promise<Response> => {
  const primaryBaseUrl = getBaseUrl();
  const init: RequestInit = {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'StarWarsExplorer/1.0 (Next.js)',
    },
    next: { revalidate: 300 },
  };

  const primaryUrl = buildSwapiUrl(primaryBaseUrl, path);
  const primaryResponse = await fetch(primaryUrl, init);

  if (primaryResponse.ok || primaryResponse.status !== 403 || primaryBaseUrl !== PRIMARY_BASE_URL) {
    return primaryResponse;
  }

  return fetch(buildSwapiUrl(FALLBACK_BASE_URL, path), init);
};

export const fetchCharacters = async (query: string, page = 1): Promise<ApiResponse> => {
  const path = `/?search=${encodeURIComponent(query)}&page=${page}`;
  const response = await requestSwapi(path);

  if (!response.ok) {
    throw new Error(`Server returned status: ${response.status}`);
  }

  return (await response.json()) as ApiResponse;
};

export const fetchCharacterById = async (id: string): Promise<CharacterDetails> => {
  const response = await requestSwapi(`/${encodeURIComponent(id)}/`);

  if (!response.ok) {
    throw new Error(`Server returned status: ${response.status}`);
  }

  return (await response.json()) as CharacterDetails;
};

export const getCharacterId = (url: string): string => {
  const match = url.match(/\/people\/(\d+)\/?$/);
  return match ? match[1] : '';
};
