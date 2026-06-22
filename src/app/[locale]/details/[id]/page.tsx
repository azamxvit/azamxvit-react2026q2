import { setRequestLocale } from 'next-intl/server';
import { HomePage } from '@/features';

type DetailsRouteProps = {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DetailsRoute({ params, searchParams }: DetailsRouteProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const resolvedSearchParams = await searchParams;

  return <HomePage searchParams={resolvedSearchParams} detailsId={id} />;
}
