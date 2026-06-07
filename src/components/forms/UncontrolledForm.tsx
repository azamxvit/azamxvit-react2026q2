import { useId, useState } from 'react';
import type { FormEvent } from 'react';
import { FormField } from '@/components/forms/FormField';
import { CountryAutocomplete } from '@/components/forms/CountryAutocomplete';
import { PasswordStrengthIndicator } from '@/components/forms/PasswordStrengthIndicator';
import { FORM_LABELS } from '@/constants/labels';
import { createFormSchema, mapZodErrors } from '@/lib/formSchema';
import { useFormStore } from '@/store/formStore';
import type { FormSource } from '@/types/form';
import { readFileAsBase64 } from '@/utils/imageToBase64';
import { validateImageFile } from '@/utils/validateImageFile';

interface UncontrolledFormProps {
  onSuccess: () => void;
}

const FORM_SOURCE: FormSource = 'uncontrolled';

export function UncontrolledForm({ onSuccess }: UncontrolledFormProps) {
  const countries = useFormStore((state) => state.countries);
  const addSubmission = useFormStore((state) => state.addSubmission);
  const countryListId = useId();
  const [formKey, setFormKey] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordValue, setPasswordValue] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const imageInput = form.querySelector<HTMLInputElement>('input[name="image"]');
    const imageFile = imageInput?.files?.[0];

    const imageError = validateImageFile(imageFile);
    const imageBase64 =
      !imageError && imageFile ? await readFileAsBase64(imageFile) : '';

    const rawValues = {
      name: String(formData.get('name') ?? ''),
      age: String(formData.get('age') ?? ''),
      email: String(formData.get('email') ?? ''),
      gender: String(formData.get('gender') ?? ''),
      acceptTerms: formData.get('acceptTerms') === 'on' ? true : false,
      password: String(formData.get('password') ?? ''),
      confirmPassword: String(formData.get('confirmPassword') ?? ''),
      country: String(formData.get('country') ?? ''),
      imageBase64,
    };

    const schema = createFormSchema(countries);
    const result = schema.safeParse(rawValues);

    if (!result.success || imageError) {
      const fieldErrors = result.success ? {} : mapZodErrors(result.error);
      if (imageError) {
        fieldErrors.image = imageError;
      }
      setErrors(fieldErrors);
      return;
    }

    addSubmission({
      source: FORM_SOURCE,
      name: result.data.name,
      age: Number(result.data.age),
      email: result.data.email,
      gender: result.data.gender,
      country: result.data.country,
      imageBase64: result.data.imageBase64,
    });

    setErrors({});
    setPasswordValue('');
    setFormKey((value) => value + 1);
    onSuccess();
  };

  return (
    <form
      key={formKey}
      className="profile-form"
      onSubmit={(event) => void handleSubmit(event)}
      noValidate
    >
      <FormField id="name" label={FORM_LABELS.fields.name} error={errors.name}>
        <input id="name" name="name" type="text" className="form-input" />
      </FormField>

      <FormField id="age" label={FORM_LABELS.fields.age} error={errors.age}>
        <input id="age" name="age" type="number" min="0" className="form-input" />
      </FormField>

      <FormField id="email" label={FORM_LABELS.fields.email} error={errors.email}>
        <input id="email" name="email" type="email" className="form-input" />
      </FormField>

      <fieldset className="form-fieldset">
        <legend className="form-field__label">{FORM_LABELS.fields.gender}</legend>
        <label className="form-radio">
          <input type="radio" name="gender" value="male" />
          {FORM_LABELS.gender.male}
        </label>
        <label className="form-radio">
          <input type="radio" name="gender" value="female" />
          {FORM_LABELS.gender.female}
        </label>
        <label className="form-radio">
          <input type="radio" name="gender" value="other" />
          {FORM_LABELS.gender.other}
        </label>
        <p className="form-field__error" role="alert">
          {errors.gender ?? '\u00A0'}
        </p>
      </fieldset>

      <FormField id="password" label={FORM_LABELS.fields.password} error={errors.password}>
        <input
          id="password"
          name="password"
          type="password"
          className="form-input"
          onChange={(event) => setPasswordValue(event.target.value)}
        />
      </FormField>

      <PasswordStrengthIndicator password={passwordValue} />

      <FormField
        id="confirmPassword"
        label={FORM_LABELS.fields.confirmPassword}
        error={errors.confirmPassword}
      >
        <input id="confirmPassword" name="confirmPassword" type="password" className="form-input" />
      </FormField>

      <FormField id="country" label={FORM_LABELS.fields.country} error={errors.country}>
        <CountryAutocomplete
          id="country"
          name="country"
          countries={countries}
          listId={countryListId}
        />
      </FormField>

      <FormField id="image" label={FORM_LABELS.fields.image} error={errors.image}>
        <input id="image" name="image" type="file" accept="image/png,image/jpeg" />
      </FormField>

      <div className="form-checkbox-field">
        <input id="acceptTerms" name="acceptTerms" type="checkbox" />
        <label htmlFor="acceptTerms">{FORM_LABELS.fields.acceptTerms}</label>
        <p className="form-field__error" role="alert">
          {errors.acceptTerms ?? '\u00A0'}
        </p>
      </div>

      <button type="submit" className="form-submit">
        {FORM_LABELS.submit}
      </button>
    </form>
  );
}
