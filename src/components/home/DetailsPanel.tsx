import { Suspense } from 'react';
import { fetchCharacterById } from '@/services';
import { getErrorMessage } from '@/lib';
import { DetailsToolbar } from './DetailsToolbar';
import { getTranslations } from 'next-intl/server';

type DetailsPanelProps = {
  characterId: string;
};

export async function DetailsPanel({ characterId }: DetailsPanelProps) {
  const t = await getTranslations('details');

  let character = null;
  let errorMessage: string | null = null;

  try {
    character = await fetchCharacterById(characterId);
  } catch (error) {
    errorMessage = getErrorMessage(error);
  }

  return (
    <div className="details">
      <Suspense fallback={<div className="details__toolbar" />}>
        <DetailsToolbar />
      </Suspense>

      {errorMessage ? (
        <div className="api-error">{errorMessage}</div>
      ) : character ? (
        <article>
          <h2>{character.name}</h2>
          <p>
            <strong>{t('birthYear')}:</strong> {character.birth_year}
          </p>
          <p>
            <strong>{t('gender')}:</strong> {character.gender}
          </p>
          <p>
            <strong>{t('height')}:</strong> {character.height}
          </p>
          <p>
            <strong>{t('mass')}:</strong> {character.mass}
          </p>
          <p>
            <strong>{t('hairColor')}:</strong> {character.hair_color}
          </p>
          <p>
            <strong>{t('skinColor')}:</strong> {character.skin_color}
          </p>
          <p>
            <strong>{t('eyeColor')}:</strong> {character.eye_color}
          </p>
        </article>
      ) : (
        <p>{t('loading')}</p>
      )}
    </div>
  );
}
