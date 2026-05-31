import { UI_LABELS } from '@/constants/labels';

export const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : UI_LABELS.errors.unknown;
