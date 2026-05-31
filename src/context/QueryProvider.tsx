import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { createQueryClient } from '../lib/queryClient';

interface QueryProviderProps {
  children: ReactNode;
  client?: ReturnType<typeof createQueryClient>;
}

export function QueryProvider({ children, client }: QueryProviderProps) {
  const queryClient = client ?? createQueryClient();

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
