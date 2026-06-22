import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n';

export default async function NotFoundPage() {
  const locale = await getLocale();
  setRequestLocale(locale);
  const t = await getTranslations('notFound');

  return (
    <section className="not-found">
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
      <Link href="/" className="not-found__link">
        {t('back')}
      </Link>
    </section>
  );
}
