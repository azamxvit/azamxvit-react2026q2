import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE_BYTES } from '@/lib/formSchema';

export const validateImageFile = (file: File | undefined | null): string | null => {
  if (!file || file.size === 0) {
    return 'Image is required';
  }

  if (!ACCEPTED_IMAGE_TYPES.includes(file.type as (typeof ACCEPTED_IMAGE_TYPES)[number])) {
    return 'Only PNG and JPEG images are allowed';
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return 'Image must be 5 MB or smaller';
  }

  return null;
};
