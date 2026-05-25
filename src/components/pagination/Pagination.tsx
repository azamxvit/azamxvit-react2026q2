interface Props {
  currentPage: number;
  hasPrevious: boolean;
  hasNext: boolean;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, hasPrevious, hasNext, onPageChange }: Props) {
  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevious}
      >
        Prev
      </button>
      <span className="pagination__current" data-testid="current-page">
        Page {currentPage}
      </span>
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
      >
        Next
      </button>
    </nav>
  );
}
