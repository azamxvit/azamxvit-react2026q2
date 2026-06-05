import { describe, expect, it } from 'vitest';
import { readFileAsBase64 } from './imageToBase64';
import { createTestImageFile } from '@/test-utils/formTestHelpers';

describe('readFileAsBase64', () => {
  it('converts a file to a base64 data url', async () => {
    const file = createTestImageFile();
    const result = await readFileAsBase64(file);

    expect(result.startsWith('data:image/jpeg;base64,')).toBe(true);
  });
});
