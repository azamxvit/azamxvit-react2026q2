'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n';
import { ThemeToggle } from '@/components/theme';
import { LanguageSwitcher } from './LanguageSwitcher';

type AppHeaderProps = {
  title: string;
};

export function AppHeader({ title }: AppHeaderProps) {
  const t = useTranslations('app.nav');
  const pathname = usePathname();

  return (
    <header className="app-header">
      <Link href="/" className="app-title">
        <Image src="/favicon.svg" alt="" width={28} height={28} className="app-title__icon" />
        {title}
      </Link>
      <LanguageSwitcher />
      <ThemeToggle />
      <nav className="app-nav" aria-label="Main">
        <Link href="/" className={pathname === '/' ? 'active' : undefined}>
          {t('home')}
        </Link>
        <Link href="/about" className={pathname === '/about' ? 'active' : undefined}>
          {t('about')}
        </Link>
      </nav>
    </header>
  );
}
