import { useRef, useState } from 'react';
import { Modal } from '@/components/modal/Modal';
import { ReactHookFormForm } from '@/components/forms/ReactHookFormForm';
import { SubmissionList } from '@/components/forms/SubmissionList';
import { UncontrolledForm } from '@/components/forms/UncontrolledForm';
import { FORM_LABELS } from '@/constants/labels';

type ActiveForm = 'uncontrolled' | 'react-hook-form' | null;

export function FormsSection() {
  const [activeForm, setActiveForm] = useState<ActiveForm>(null);
  const uncontrolledTriggerRef = useRef<HTMLButtonElement>(null);
  const rhfTriggerRef = useRef<HTMLButtonElement>(null);

  const closeModal = () => {
    setActiveForm(null);
  };

  const handleSuccess = () => {
    const trigger =
      activeForm === 'uncontrolled' ? uncontrolledTriggerRef.current : rhfTriggerRef.current;
    closeModal();
    trigger?.focus();
  };

  const modalTitle =
    activeForm === 'uncontrolled'
      ? FORM_LABELS.modals.uncontrolled
      : FORM_LABELS.modals.reactHookForm;

  return (
    <section className="forms-section" aria-labelledby="forms-section-title">
      <div className="forms-section__header">
        <h2 id="forms-section-title" className="forms-section__title">
          {FORM_LABELS.sectionTitle}
        </h2>
        <div className="forms-section__actions">
          <button
            ref={uncontrolledTriggerRef}
            type="button"
            className="form-open-btn"
            onClick={() => setActiveForm('uncontrolled')}
          >
            {FORM_LABELS.openUncontrolled}
          </button>
          <button
            ref={rhfTriggerRef}
            type="button"
            className="form-open-btn"
            onClick={() => setActiveForm('react-hook-form')}
          >
            {FORM_LABELS.openReactHookForm}
          </button>
        </div>
      </div>

      <SubmissionList />

      <Modal isOpen={activeForm !== null} title={modalTitle} onClose={closeModal}>
        {activeForm === 'uncontrolled' && <UncontrolledForm onSuccess={handleSuccess} />}
        {activeForm === 'react-hook-form' && <ReactHookFormForm onSuccess={handleSuccess} />}
      </Modal>
    </section>
  );
}
