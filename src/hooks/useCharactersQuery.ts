import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchCharacters } from '../api/swapi';
import { queryKeys } from '../api/queryKeys';

export const useCharactersQuery = (search: string, page: number) =>
  useQuery({
    queryKey: queryKeys.characters.list(search, page),
    queryFn: () => fetchCharacters(search, page),
  });

export const useInvalidateCharacters = () => {
  const queryClient = useQueryClient();

  return (search: string, page: number) =>
    queryClient.invalidateQueries({
      queryKey: queryKeys.characters.list(search, page),
    });
};
