'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ErrorBoundary } from '@/components/error-boundary';
import { SelectionFlyout } from '@/components/flyout';
import { ThemeProvider } from '@/context';
import { AppHeader } from './AppHeader';
import type { ReactNode } from 'react';

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const t = useTranslations('app');

  return (
    <ThemeProvider>
      <div className="app-container">
        <AppHeader title={t('title')} />
        <main>
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
        <SelectionFlyout />
        <Image
          src="/favicon.svg"
          alt=""
          width={1}
          height={1}
          aria-hidden
          className="app-sr-image"
        />
      </div>
    </ThemeProvider>
  );
}
