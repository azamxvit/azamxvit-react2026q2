import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { QueryClientProvider } from '@tanstack/react-query';
import type { QueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import { createTestQueryClient } from '@/test-utils/queryClient';
import { useInvalidateDashboard } from './useInvalidateDashboard';

describe('useInvalidateDashboard', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createTestQueryClient();
    vi.spyOn(queryClient, 'invalidateQueries');
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('invalidates the current list query', async () => {
    const { result } = renderHook(() => useInvalidateDashboard(), { wrapper });

    await result.current({ search: 'luke', page: 2 });

    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: queryKeys.characters.list('luke', 2),
    });
  });

  it('invalidates open character details when detailsId is provided', async () => {
    const { result } = renderHook(() => useInvalidateDashboard(), { wrapper });

    await result.current({ search: '', page: 1, detailsId: '1' });

    await waitFor(() => {
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: queryKeys.character.detail('1'),
      });
    });
  });
});
