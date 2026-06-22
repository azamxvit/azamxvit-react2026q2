import type { ApiResponse, CharacterDetails } from '@/types';

const DEFAULT_BASE_URL = 'https://swapi.py4e.com/api/people';

const getBaseUrl = () => process.env.SWAPI_PEOPLE_BASE_URL ?? DEFAULT_BASE_URL;

const requestSwapi = async (path: string): Promise<Response> => {
  return fetch(`${getBaseUrl()}${path}`, {
    headers: {
      Accept: 'application/json',
      'User-Agent':
        'Mozilla/5.0 (compatible; StarWarsExplorer/1.0; +https://azamxvit-react2026q2.vercel.app)',
    },
    next: { revalidate: 300 },
  });
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
