export const UI_LABELS = {
  pagination: {
    ariaLabel: 'Pagination',
    prev: 'Prev',
    next: 'Next',
    page: (currentPage: number) => `Page ${currentPage}`,
  },
  search: {
    placeholder: 'Search Star Wars characters...',
    submit: 'Search',
  },
  theme: {
    label: 'Theme:',
  },
  refresh: {
    list: 'Refresh',
    listAria: 'Refresh character list',
    details: 'Refresh',
    detailsAria: 'Refresh character details',
  },
  details: {
    closeAria: 'Close details',
    loading: 'Loading details...',
  },
  errors: {
    unknown: 'Unknown error occurred',
  },
} as const;
