import { describe, expect, it } from 'vitest';
import { COUNTRIES } from '@/constants/countries';
import { createFormSchema } from '@/lib/formSchema';
const schema = createFormSchema(COUNTRIES);

const validValues = {
  name: 'John',
  age: '30',
  email: 'john@example.com',
  gender: 'male' as const,
  acceptTerms: true,
  password: 'Abcdef1!',
  confirmPassword: 'Abcdef1!',
  country: 'United States',
  imageBase64: 'data:image/jpeg;base64,abc',
};

describe('createFormSchema', () => {
  it('accepts valid form values', () => {
    expect(schema.safeParse(validValues).success).toBe(true);
  });

  it('rejects names without an uppercase first letter', () => {
    const result = schema.safeParse({ ...validValues, name: 'john' });
    expect(result.success).toBe(false);
  });

  it('rejects negative ages', () => {
    const result = schema.safeParse({ ...validValues, age: '-1' });
    expect(result.success).toBe(false);
  });

  it('rejects passwords that do not match', () => {
    const result = schema.safeParse({ ...validValues, confirmPassword: 'Different1!' });
    expect(result.success).toBe(false);
  });

  it('rejects countries that are not in the list', () => {
    const result = schema.safeParse({ ...validValues, country: 'Atlantis' });
    expect(result.success).toBe(false);
  });
});
