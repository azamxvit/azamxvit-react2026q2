import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  useCharacterDetailsQuery,
  useInvalidateCharacterDetails,
} from '../hooks/useCharacterDetailsQuery';
import { Loader } from '../components/skeleton/Loader';
import type { CharacterDetails } from '../types/character';

export function Details() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const characterId = id ?? '';

  const { data, isLoading, isFetching, isError, error } =
    useCharacterDetailsQuery(characterId);
  const invalidateCharacterDetails = useInvalidateCharacterDetails();

  const handleClose = () => {
    navigate({ pathname: '/', search: `?${searchParams.toString()}` });
  };

  const handleRefresh = () => {
    if (!characterId) return;
    void invalidateCharacterDetails(characterId);
  };

  const errorMessage = isError
    ? error instanceof Error
      ? error.message
      : 'Unknown error occurred'
    : null;
  const showLoader = isLoading || (isFetching && !data);

  const renderDetailsContent = (character: CharacterDetails) => (
    <article>
      <h2>{character.name}</h2>
      <p>
        <strong>Birth Year:</strong> {character.birth_year}
      </p>
      <p>
        <strong>Gender:</strong> {character.gender}
      </p>
      <p>
        <strong>Height:</strong> {character.height}
      </p>
      <p>
        <strong>Mass:</strong> {character.mass}
      </p>
      <p>
        <strong>Hair color:</strong> {character.hair_color}
      </p>
      <p>
        <strong>Skin color:</strong> {character.skin_color}
      </p>
      <p>
        <strong>Eye color:</strong> {character.eye_color}
      </p>
    </article>
  );

  const renderBody = () => {
    if (showLoader) {
      return <Loader label="Loading details..." />;
    }

    if (errorMessage) {
      return <div className="api-error">{errorMessage}</div>;
    }

    if (data) {
      return renderDetailsContent(data);
    }

    return null;
  };

  return (
    <div className="details">
      <div className="details__toolbar">
        <button
          type="button"
          className="refresh-btn"
          onClick={handleRefresh}
          disabled={isFetching || !characterId}
          aria-label="Refresh character details"
        >
          Refresh
        </button>
        <button
          type="button"
          className="details__close"
          onClick={handleClose}
          aria-label="Close details"
        >
          ×
        </button>
      </div>

      {renderBody()}
    </div>
  );
}
