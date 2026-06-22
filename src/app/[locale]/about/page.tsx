import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';

type AboutPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');

  return (
    <section className="about">
      <Image
        src="/favicon.svg"
        alt={t('title')}
        width={72}
        height={72}
        priority
        className="about__logo"
      />
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
      <p>
        <strong>{t('author')}</strong> {t('authorName')}
      </p>
      <p>
        {t('source')}{' '}
        <a
          href="https://github.com/rolling-scopes-school/tasks/tree/master/react"
          target="_blank"
          rel="noreferrer"
        >
          {t('sourceLabel')}
        </a>
        .
      </p>
      <p>
        <a href="https://rs.school/courses/reactjs" target="_blank" rel="noreferrer">
          {t('courseLink')}
        </a>
      </p>
      <Image
        src="https://rs.school/images/rs-school_js_black.svg"
        alt="RS School"
        width={160}
        height={48}
        className="about__badge"
      />
    </section>
  );
}
