import { QueryClient } from '@tanstack/react-query';
import { getCacheTtlMs } from '@/lib/cacheConfig';

export const createQueryClient = (): QueryClient => {
  const cacheTtlMs = getCacheTtlMs();

  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: cacheTtlMs,
        gcTime: cacheTtlMs * 2,
        refetchOnWindowFocus: false,
      },
    },
  });
};
