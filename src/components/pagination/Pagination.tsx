import { UI_LABELS } from '@/constants/labels';

interface Props {
  currentPage: number;
  hasPrevious: boolean;
  hasNext: boolean;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, hasPrevious, hasNext, onPageChange }: Props) {
  const { pagination } = UI_LABELS;

  return (
    <nav className="pagination" aria-label={pagination.ariaLabel}>
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevious}
      >
        {pagination.prev}
      </button>
      <span className="pagination__current" data-testid="current-page">
        {pagination.page(currentPage)}
      </span>
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
      >
        {pagination.next}
      </button>
    </nav>
  );
}
