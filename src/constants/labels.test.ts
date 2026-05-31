import { describe, expect, it } from 'vitest';
import { UI_LABELS } from '@/constants/labels';

describe('UI_LABELS', () => {
  it('builds pagination page labels', () => {
    expect(UI_LABELS.pagination.page(2)).toBe('Page 2');
  });
});
