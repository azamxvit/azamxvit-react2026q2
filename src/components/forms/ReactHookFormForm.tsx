import { useId, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormField } from '@/components/forms/FormField';
import { CountryAutocomplete } from '@/components/forms/CountryAutocomplete';
import { PasswordStrengthIndicator } from '@/components/forms/PasswordStrengthIndicator';
import { FORM_LABELS } from '@/constants/labels';
import { createFormSchema } from '@/lib/formSchema';
import { useFormStore } from '@/store/formStore';
import type { FormFieldValues, FormSource } from '@/types/form';
import { readFileAsBase64 } from '@/utils/imageToBase64';
import { validateImageFile } from '@/utils/validateImageFile';

interface ReactHookFormFormProps {
  onSuccess: () => void;
}

const FORM_SOURCE: FormSource = 'react-hook-form';

const defaultValues: FormFieldValues = {
  name: '',
  age: '',
  email: '',
  gender: 'male',
  acceptTerms: false,
  password: '',
  confirmPassword: '',
  country: '',
  imageBase64: '',
};

export function ReactHookFormForm({ onSuccess }: ReactHookFormFormProps) {
  const countries = useFormStore((state) => state.countries);
  const addSubmission = useFormStore((state) => state.addSubmission);
  const countryListId = useId();
  const schema = useMemo(() => createFormSchema(countries), [countries]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormFieldValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues,
  });

  const passwordValue = watch('password');

  const handleImageChange = async (fileList: FileList | null) => {
    const file = fileList?.[0];
    const imageError = validateImageFile(file);

    if (imageError) {
      setValue('imageBase64', '', { shouldValidate: true, shouldDirty: true });
      setError('imageBase64', { type: 'manual', message: imageError });
      return;
    }

    clearErrors('imageBase64');
    const imageBase64 = await readFileAsBase64(file as File);
    setValue('imageBase64', imageBase64, { shouldValidate: true, shouldDirty: true });
  };

  const onSubmit = handleSubmit(async (values) => {
    addSubmission({
      source: FORM_SOURCE,
      name: values.name,
      age: Number(values.age),
      email: values.email,
      gender: values.gender,
      country: values.country,
      imageBase64: values.imageBase64,
    });

    reset(defaultValues);
    onSuccess();
  });

  return (
    <form className="profile-form" onSubmit={(event) => void onSubmit(event)} noValidate>
      <FormField id="rhf-name" label={FORM_LABELS.fields.name} error={errors.name?.message}>
        <input id="rhf-name" type="text" className="form-input" {...register('name')} />
      </FormField>

      <FormField id="rhf-age" label={FORM_LABELS.fields.age} error={errors.age?.message}>
        <input id="rhf-age" type="number" min="0" className="form-input" {...register('age')} />
      </FormField>

      <FormField id="rhf-email" label={FORM_LABELS.fields.email} error={errors.email?.message}>
        <input id="rhf-email" type="email" className="form-input" {...register('email')} />
      </FormField>

      <fieldset className="form-fieldset">
        <legend className="form-field__label">{FORM_LABELS.fields.gender}</legend>
        <label className="form-radio">
          <input type="radio" value="male" {...register('gender')} />
          {FORM_LABELS.gender.male}
        </label>
        <label className="form-radio">
          <input type="radio" value="female" {...register('gender')} />
          {FORM_LABELS.gender.female}
        </label>
        <label className="form-radio">
          <input type="radio" value="other" {...register('gender')} />
          {FORM_LABELS.gender.other}
        </label>
        <p className="form-field__error" role="alert">
          {errors.gender?.message ?? '\u00A0'}
        </p>
      </fieldset>

      <FormField
        id="rhf-password"
        label={FORM_LABELS.fields.password}
        error={errors.password?.message}
      >
        <input id="rhf-password" type="password" className="form-input" {...register('password')} />
      </FormField>

      <PasswordStrengthIndicator password={passwordValue} />

      <FormField
        id="rhf-confirmPassword"
        label={FORM_LABELS.fields.confirmPassword}
        error={errors.confirmPassword?.message}
      >
        <input
          id="rhf-confirmPassword"
          type="password"
          className="form-input"
          {...register('confirmPassword')}
        />
      </FormField>

      <FormField id="rhf-country" label={FORM_LABELS.fields.country} error={errors.country?.message}>
        <CountryAutocomplete
          id="rhf-country"
          countries={countries}
          listId={countryListId}
          {...register('country')}
        />
      </FormField>

      <FormField
        id="rhf-image"
        label={FORM_LABELS.fields.image}
        error={errors.imageBase64?.message}
      >
        <input
          id="rhf-image"
          type="file"
          accept="image/png,image/jpeg"
          onChange={(event) => void handleImageChange(event.target.files)}
        />
      </FormField>

      <div className="form-checkbox-field">
        <input id="rhf-acceptTerms" type="checkbox" {...register('acceptTerms')} />
        <label htmlFor="rhf-acceptTerms">{FORM_LABELS.fields.acceptTerms}</label>
        <p className="form-field__error" role="alert">
          {errors.acceptTerms?.message ?? '\u00A0'}
        </p>
      </div>

      <button type="submit" className="form-submit" disabled={!isValid || isSubmitting}>
        {FORM_LABELS.submit}
      </button>
    </form>
  );
}
