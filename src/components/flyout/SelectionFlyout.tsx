'use client';

import { useActionState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { downloadCsvAction } from '@/actions';
import { useSelectedItemsStore } from '@/store';

export function SelectionFlyout() {
  const t = useTranslations('flyout');
  const itemsByUrl = useSelectedItemsStore((state) => state.itemsByUrl);
  const clearAll = useSelectedItemsStore((state) => state.clearAll);
  const selectedItems = Object.values(itemsByUrl);
  const count = selectedItems.length;
  const [state, formAction, isPending] = useActionState(downloadCsvAction, null);

  useEffect(() => {
    if (!state?.csv) {
      return;
    }

    const blob = new Blob([state.csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = state.fileName;
    link.click();
    URL.revokeObjectURL(url);
  }, [state]);

  if (count === 0) {
    return null;
  }

  return (
    <aside className="selection-flyout" data-testid="selection-flyout" aria-live="polite">
      <p className="selection-flyout__count">{t('selected', { count })}</p>
      <div className="selection-flyout__actions">
        <button type="button" onClick={clearAll}>
          {t('unselectAll')}
        </button>
        <form action={formAction}>
          <input type="hidden" name="items" value={JSON.stringify(selectedItems)} />
          <button type="submit" disabled={isPending}>
            {t('download')}
          </button>
        </form>
      </div>
    </aside>
  );
}
