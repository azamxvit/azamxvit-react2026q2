import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';

interface InvalidateDashboardOptions {
  search: string;
  page: number;
  detailsId?: string;
}

export const useInvalidateDashboard = () => {
  const queryClient = useQueryClient();

  return async ({ search, page, detailsId }: InvalidateDashboardOptions) => {
    const invalidations = [
      queryClient.invalidateQueries({
        queryKey: queryKeys.characters.list(search, page),
      }),
    ];

    if (detailsId) {
      invalidations.push(
        queryClient.invalidateQueries({
          queryKey: queryKeys.character.detail(detailsId),
        }),
      );
    }

    await Promise.all(invalidations);
  };
};
