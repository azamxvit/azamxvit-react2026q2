import { describe, expect, it } from 'vitest';
import { createTestImageFile } from '@/test-utils/formTestHelpers';
import { validateImageFile } from './validateImageFile';

describe('validateImageFile', () => {
  it('returns null for a valid jpeg file', () => {
    expect(validateImageFile(createTestImageFile())).toBeNull();
  });

  it('rejects missing files', () => {
    expect(validateImageFile(undefined)).toBe('Image is required');
  });

  it('rejects unsupported file types', () => {
    const file = new File(['text'], 'notes.txt', { type: 'text/plain' });
    expect(validateImageFile(file)).toBe('Only PNG and JPEG images are allowed');
  });
});
