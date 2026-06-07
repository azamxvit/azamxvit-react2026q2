import { describe, expect, it } from 'vitest';
import { getPasswordCriteria } from './passwordStrength';

describe('getPasswordCriteria', () => {
  it('returns all criteria as false for an empty password', () => {
    expect(getPasswordCriteria('')).toEqual({
      hasNumber: false,
      hasUppercase: false,
      hasLowercase: false,
      hasSpecialChar: false,
    });
  });

  it('detects satisfied password criteria', () => {
    expect(getPasswordCriteria('Abcdef1!')).toEqual({
      hasNumber: true,
      hasUppercase: true,
      hasLowercase: true,
      hasSpecialChar: true,
    });
  });
});
