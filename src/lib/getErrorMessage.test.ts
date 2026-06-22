import { describe, expect, it } from 'vitest';
import { getErrorMessage } from '@/lib';

describe('getErrorMessage', () => {
  it('returns the error message from Error instances', () => {
    expect(getErrorMessage(new Error('Network interruption'))).toBe('Network interruption');
  });

  it('returns string errors as-is', () => {
    expect(getErrorMessage('boom')).toBe('boom');
  });
});
