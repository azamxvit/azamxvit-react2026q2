import { fireEvent } from '@testing-library/react';

export const createTestImageFile = (sizeInBytes = 128) =>
  new File([new Uint8Array(sizeInBytes)], 'profile.jpeg', { type: 'image/jpeg' });

const setInputFiles = (input: HTMLInputElement, file: File) => {
  Object.defineProperty(input, 'files', {
    value: [file],
    configurable: true,
  });
};

export const uploadImageToInput = (input: HTMLInputElement, file: File) => {
  setInputFiles(input, file);
  input.dispatchEvent(new Event('change', { bubbles: true }));
};

export const uploadImageToControlledInput = (input: HTMLInputElement, file: File) => {
  setInputFiles(input, file);
  fireEvent.change(input);
};

export const VALID_FORM_INPUT = {
  name: 'John',
  age: '30',
  email: 'john@example.com',
  gender: 'male' as const,
  password: 'Abcdef1!',
  confirmPassword: 'Abcdef1!',
  country: 'United States',
};
