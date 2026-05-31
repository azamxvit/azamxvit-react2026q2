import { afterEach, describe, expect, it, vi } from 'vitest';
import { getCacheTtlMs } from './cacheConfig';

describe('getCacheTtlMs', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns the default TTL when the env variable is missing', () => {
    vi.stubEnv('VITE_CACHE_TTL_MS', '');

    expect(getCacheTtlMs()).toBe(5 * 60 * 1000);
  });

  it('returns the configured TTL from VITE_CACHE_TTL_MS', () => {
    vi.stubEnv('VITE_CACHE_TTL_MS', '120000');

    expect(getCacheTtlMs()).toBe(120000);
  });

  it('falls back to the default TTL for invalid values', () => {
    vi.stubEnv('VITE_CACHE_TTL_MS', '-1');

    expect(getCacheTtlMs()).toBe(5 * 60 * 1000);
  });
});
