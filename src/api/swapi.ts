import type { ApiResponse } from '../types/character';

export const fetchCharacters = async (query: string): Promise<ApiResponse> => {
  const response = await fetch(`https://swapi.dev/api/people/?search=${encodeURIComponent(query)}`);
  
  if (!response.ok) {
    throw new Error(`Server returned status: ${response.status}`);
  }

  return await response.json();
};