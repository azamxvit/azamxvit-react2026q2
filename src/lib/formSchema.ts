import { z } from 'zod';
import { isValidEmail } from '@/utils/emailValidation';

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg'] as const;

const isUppercaseFirstLetter = (value: string) => {
  const firstChar = value.charAt(0);
  return firstChar === firstChar.toUpperCase() && firstChar !== firstChar.toLowerCase();
};

const isValidImageBase64 = (value: string) =>
  value.startsWith('data:image/png;base64,') || value.startsWith('data:image/jpeg;base64,');

export const createFormSchema = (countries: readonly string[]) =>
  z
    .object({
      name: z
        .string()
        .trim()
        .min(1, 'Name is required')
        .refine(isUppercaseFirstLetter, 'Name must start with an uppercase letter'),
      age: z
        .string()
        .min(1, 'Age is required')
        .refine((value) => !Number.isNaN(Number(value)), 'Age must be a number')
        .refine((value) => Number(value) >= 0, 'Age cannot be negative'),
      email: z
        .string()
        .trim()
        .min(1, 'Email is required')
        .refine(isValidEmail, 'Enter a valid email address'),
      gender: z.enum(['male', 'female', 'other'], { message: 'Select a gender' }),
      acceptTerms: z.boolean().refine((value) => value === true, {
        message: 'You must accept Terms and Conditions',
      }),
      password: z.string().min(1, 'Password is required'),
      confirmPassword: z.string().min(1, 'Confirm password is required'),
      country: z
        .string()
        .trim()
        .min(1, 'Country is required')
        .refine((value) => countries.includes(value), 'Select a country from the list'),
      imageBase64: z
        .string()
        .min(1, 'Image is required')
        .refine(isValidImageBase64, 'Only PNG and JPEG images are allowed'),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords must match',
      path: ['confirmPassword'],
    });

export type FormSchemaInput = z.input<ReturnType<typeof createFormSchema>>;
export type FormSchemaOutput = z.output<ReturnType<typeof createFormSchema>>;

export const mapZodErrors = (error: z.ZodError): Record<string, string> => {
  const fieldErrors: Record<string, string> = {};

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field === 'string' && !fieldErrors[field]) {
      fieldErrors[field] = issue.message;
    }
  }

  return fieldErrors;
};
