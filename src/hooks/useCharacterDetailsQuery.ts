import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchCharacterById } from '../api/swapi';
import { queryKeys } from '../api/queryKeys';

export const useCharacterDetailsQuery = (id: string) =>
  useQuery({
    queryKey: queryKeys.character.detail(id),
    queryFn: () => fetchCharacterById(id),
    enabled: Boolean(id),
  });

export const useInvalidateCharacterDetails = () => {
  const queryClient = useQueryClient();

  return (id: string) =>
    queryClient.invalidateQueries({
      queryKey: queryKeys.character.detail(id),
    });
};
