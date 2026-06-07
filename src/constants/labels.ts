export const UI_LABELS = {
  pagination: {
    ariaLabel: 'Pagination',
    prev: 'Prev',
    next: 'Next',
    page: (currentPage: number) => `Page ${currentPage}`,
  },
  search: {
    placeholder: 'Search Star Wars characters...',
    submit: 'Search',
  },
  theme: {
    label: 'Theme:',
  },
  refresh: {
    list: 'Refresh',
    listAria: 'Refresh character list',
    details: 'Refresh',
    detailsAria: 'Refresh character details',
  },
  details: {
    closeAria: 'Close details',
    loading: 'Loading details...',
  },
  errors: {
    unknown: 'Unknown error occurred',
  },
} as const;

export const FORM_LABELS = {
  sectionTitle: 'Profile Submissions',
  openUncontrolled: 'Open Uncontrolled Form',
  openReactHookForm: 'Open React Hook Form',
  submit: 'Submit',
  modals: {
    uncontrolled: 'Uncontrolled Profile Form',
    reactHookForm: 'React Hook Form Profile',
  },
  fields: {
    name: 'Name',
    age: 'Age',
    email: 'Email',
    gender: 'Gender',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    country: 'Country',
    image: 'Profile Image',
    acceptTerms: 'I accept Terms and Conditions',
  },
  gender: {
    male: 'Male',
    female: 'Female',
    other: 'Other',
  },
  sources: {
    uncontrolled: 'Submitted via uncontrolled form',
    reactHookForm: 'Submitted via React Hook Form',
  },
  display: {
    age: 'Age:',
    email: 'Email:',
    gender: 'Gender:',
    country: 'Country:',
  },
  submissions: {
    empty: 'No submissions yet. Open a form to add your profile.',
  },
} as const;
