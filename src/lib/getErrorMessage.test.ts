import { describe, expect, it } from 'vitest';
import { getErrorMessage } from '@/lib/getErrorMessage';
import { UI_LABELS } from '@/constants/labels';

describe('getErrorMessage', () => {
  it('returns the error message from Error instances', () => {
    expect(getErrorMessage(new Error('Network interruption'))).toBe('Network interruption');
  });

  it('returns the fallback message for unknown errors', () => {
    expect(getErrorMessage('boom')).toBe(UI_LABELS.errors.unknown);
  });
});
