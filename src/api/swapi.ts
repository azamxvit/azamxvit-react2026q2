import type { ApiResponse, CharacterDetails } from '@/types/character';

const BASE_URL = 'https://swapi.py4e.com/api/people';

export const fetchCharacters = async (query: string, page = 1): Promise<ApiResponse> => {
  const url = `${BASE_URL}/?search=${encodeURIComponent(query)}&page=${page}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Server returned status: ${response.status}`);
  }

  return (await response.json()) as ApiResponse;
};

export const fetchCharacterById = async (id: string): Promise<CharacterDetails> => {
  const response = await fetch(`${BASE_URL}/${encodeURIComponent(id)}/`);

  if (!response.ok) {
    throw new Error(`Server returned status: ${response.status}`);
  }

  return (await response.json()) as CharacterDetails;
};

export const getCharacterId = (url: string): string => {
  const match = url.match(/\/people\/(\d+)\/?$/);
  return match ? match[1] : '';
};
