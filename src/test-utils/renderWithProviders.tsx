import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions, RenderResult } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from '@/context';
import messages from '../../messages/en.json';

interface Options extends Omit<RenderOptions, 'wrapper'> {
  locale?: 'en' | 'ru';
}

export function renderWithProviders(
  ui: ReactElement,
  { locale = 'en', ...options }: Options = {},
): RenderResult {
  return render(ui, {
    wrapper: ({ children }) => (
      <NextIntlClientProvider locale={locale} messages={messages}>
        <ThemeProvider>{children}</ThemeProvider>
      </NextIntlClientProvider>
    ),
    ...options,
  });
}
