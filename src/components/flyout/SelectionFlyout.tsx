import { useSelectedItemsStore } from '@/store/selectedItemsStore';
import { downloadSelectedItemsAsCsv } from '@/utils/downloadCsv';

export function SelectionFlyout() {
  const itemsByUrl = useSelectedItemsStore((state) => state.itemsByUrl);
  const clearAll = useSelectedItemsStore((state) => state.clearAll);
  const selectedItems = Object.values(itemsByUrl);
  const count = selectedItems.length;

  if (count === 0) {
    return null;
  }

  const handleDownload = () => {
    downloadSelectedItemsAsCsv(selectedItems);
  };

  return (
    <aside className="selection-flyout" data-testid="selection-flyout" aria-live="polite">
      <p className="selection-flyout__count">
        {count} {count === 1 ? 'item' : 'items'} selected
      </p>
      <div className="selection-flyout__actions">
        <button type="button" onClick={clearAll}>
          Unselect all
        </button>
        <button type="button" onClick={handleDownload}>
          Download
        </button>
      </div>
    </aside>
  );
}
