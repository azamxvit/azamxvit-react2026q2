import { setRequestLocale } from 'next-intl/server';
import { HomePage } from '@/features';

type HomeRouteProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HomeRoute({ params, searchParams }: HomeRouteProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const resolvedSearchParams = await searchParams;

  return <HomePage searchParams={resolvedSearchParams} />;
}
