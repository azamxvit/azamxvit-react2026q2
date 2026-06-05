import { describe, expect, it } from 'vitest';
import { isValidEmail } from './emailValidation';

describe('isValidEmail', () => {
  it('accepts a basic valid email', () => {
    expect(isValidEmail('john@example.com')).toBe(true);
  });

  it('rejects emails without exactly one @', () => {
    expect(isValidEmail('john.example.com')).toBe(false);
    expect(isValidEmail('john@@example.com')).toBe(false);
  });

  it('rejects emails with an empty local part', () => {
    expect(isValidEmail('@example.com')).toBe(false);
  });

  it('rejects domains without a dot', () => {
    expect(isValidEmail('john@example')).toBe(false);
  });
});
