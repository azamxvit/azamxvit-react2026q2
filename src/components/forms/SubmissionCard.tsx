import { FORM_LABELS } from '@/constants/labels';
import type { FormSubmission } from '@/types/form';

interface SubmissionCardProps {
  submission: FormSubmission;
  isHighlighted: boolean;
}

export function SubmissionCard({ submission, isHighlighted }: SubmissionCardProps) {
  const sourceLabel =
    submission.source === 'uncontrolled'
      ? FORM_LABELS.sources.uncontrolled
      : FORM_LABELS.sources.reactHookForm;

  return (
    <article
      className={isHighlighted ? 'submission-card submission-card--highlighted' : 'submission-card'}
      data-testid={`submission-card-${submission.id}`}
    >
      <img
        src={submission.imageBase64}
        alt={`${submission.name} profile`}
        className="submission-card__image"
      />
      <div className="submission-card__content">
        <h3 className="submission-card__name">{submission.name}</h3>
        <p>
          <span className="submission-card__label">{FORM_LABELS.display.age}</span>{' '}
          {submission.age}
        </p>
        <p>
          <span className="submission-card__label">{FORM_LABELS.display.email}</span>{' '}
          {submission.email}
        </p>
        <p>
          <span className="submission-card__label">{FORM_LABELS.display.gender}</span>{' '}
          {submission.gender}
        </p>
        <p>
          <span className="submission-card__label">{FORM_LABELS.display.country}</span>{' '}
          {submission.country}
        </p>
        <p className="submission-card__source">{sourceLabel}</p>
      </div>
    </article>
  );
}
