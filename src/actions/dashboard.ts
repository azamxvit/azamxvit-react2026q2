'use server';

import { revalidatePath } from 'next/cache';
import { getLocale } from 'next-intl/server';
import { redirect } from '@/i18n';
import { buildCsvContent } from '@/lib';
import type { Character } from '@/types';

export async function searchCharactersAction(formData: FormData) {
  const query = formData.get('q')?.toString().trim() ?? '';
  const locale = await getLocale();

  redirect({
    href: {
      pathname: '/',
      query: {
        q: query,
        page: '1',
      },
    },
    locale,
  });
}

export async function refreshDashboardAction(formData: FormData) {
  const pathname = formData.get('pathname')?.toString() ?? '/';

  revalidatePath(pathname);
}

export type CsvDownloadState = {
  csv: string;
  fileName: string;
} | null;

export async function downloadCsvAction(
  _prevState: CsvDownloadState,
  formData: FormData,
): Promise<CsvDownloadState> {
  const itemsJson = formData.get('items')?.toString();

  if (!itemsJson) {
    return null;
  }

  const items = JSON.parse(itemsJson) as Character[];

  if (items.length === 0) {
    return null;
  }

  const locale = await getLocale();
  const origin = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
  const csv = buildCsvContent(items, origin, locale);

  return {
    csv,
    fileName: `${items.length}_items.csv`,
  };
}
