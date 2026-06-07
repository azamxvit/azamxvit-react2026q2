import { useEffect } from 'react';
import { SubmissionCard } from '@/components/forms/SubmissionCard';
import { FORM_LABELS } from '@/constants/labels';
import { useFormStore } from '@/store/formStore';

const HIGHLIGHT_DURATION_MS = 3000;

export function SubmissionList() {
  const submissions = useFormStore((state) => state.submissions);
  const highlightedId = useFormStore((state) => state.highlightedId);
  const clearHighlight = useFormStore((state) => state.clearHighlight);

  useEffect(() => {
    if (!highlightedId) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      clearHighlight();
    }, HIGHLIGHT_DURATION_MS);

    return () => window.clearTimeout(timeoutId);
  }, [highlightedId, clearHighlight]);

  if (submissions.length === 0) {
    return (
      <p className="submission-list__empty" data-testid="submission-list-empty">
        {FORM_LABELS.submissions.empty}
      </p>
    );
  }

  return (
    <div className="submission-list" data-testid="submission-list">
      {submissions.map((submission) => (
        <SubmissionCard
          key={submission.id}
          submission={submission}
          isHighlighted={submission.id === highlightedId}
        />
      ))}
    </div>
  );
}
