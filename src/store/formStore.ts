import { create } from 'zustand';
import { COUNTRIES } from '@/constants/countries';
import type { FormSource, FormSubmission } from '@/types/form';

interface AddSubmissionInput {
  source: FormSource;
  name: string;
  age: number;
  email: string;
  gender: string;
  country: string;
  imageBase64: string;
}

interface FormStoreState {
  countries: readonly string[];
  submissions: FormSubmission[];
  highlightedId: string | null;
  addSubmission: (submission: AddSubmissionInput) => string;
  clearHighlight: () => void;
  resetStore: () => void;
}

const createSubmissionId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export const useFormStore = create<FormStoreState>((set) => ({
  countries: COUNTRIES,
  submissions: [],
  highlightedId: null,

  addSubmission: (submission) => {
    const id = createSubmissionId();
    const entry: FormSubmission = {
      id,
      submittedAt: Date.now(),
      ...submission,
    };

    set((state) => ({
      submissions: [entry, ...state.submissions],
      highlightedId: id,
    }));

    return id;
  },

  clearHighlight: () => set({ highlightedId: null }),

  resetStore: () =>
    set({
      countries: COUNTRIES,
      submissions: [],
      highlightedId: null,
    }),
}));
