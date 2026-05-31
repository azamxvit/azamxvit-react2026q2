import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions, RenderResult } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryProvider } from '@/context/QueryProvider';
import { ThemeProvider } from '@/context/ThemeProvider';
import { createTestQueryClient } from '@/test-utils/queryClient';

interface Options extends Omit<RenderOptions, 'wrapper'> {
  route?: string;
}

export function renderWithProviders(
  ui: ReactElement,
  { route = '/', ...options }: Options = {},
): RenderResult {
  const queryClient = createTestQueryClient();

  return render(ui, {
    wrapper: ({ children }) => (
      <QueryProvider client={queryClient}>
        <ThemeProvider>
          <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
        </ThemeProvider>
      </QueryProvider>
    ),
    ...options,
  });
}
