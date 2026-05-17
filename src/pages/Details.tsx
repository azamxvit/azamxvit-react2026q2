import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { fetchCharacterById } from '../api/swapi';
import { Loader } from '../components/skeleton/Loader';
import type { CharacterDetails } from '../types/character';

interface DetailsState {
  data: CharacterDetails | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: DetailsState = {
  data: null,
  isLoading: false,
  error: null,
};

export function Details() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [state, setState] = useState<DetailsState>(initialState);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    const load = async () => {
      setState({ data: null, isLoading: true, error: null });
      try {
        const data = await fetchCharacterById(id);
        if (cancelled) return;
        setState({ data, isLoading: false, error: null });
      } catch (error) {
        if (cancelled) return;
        setState({
          data: null,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Unknown error occurred',
        });
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleClose = () => {
    navigate({ pathname: '/', search: `?${searchParams.toString()}` });
  };

  return (
    <div className="details">
      <button
        type="button"
        className="details__close"
        onClick={handleClose}
        aria-label="Close details"
      >
        ×
      </button>

      {state.isLoading && <Loader label="Loading details..." />}
      {state.error && <div className="api-error">{state.error}</div>}
      {state.data && (
        <article>
          <h2>{state.data.name}</h2>
          <p>
            <strong>Birth Year:</strong> {state.data.birth_year}
          </p>
          <p>
            <strong>Gender:</strong> {state.data.gender}
          </p>
          <p>
            <strong>Height:</strong> {state.data.height}
          </p>
          <p>
            <strong>Mass:</strong> {state.data.mass}
          </p>
          <p>
            <strong>Hair color:</strong> {state.data.hair_color}
          </p>
          <p>
            <strong>Skin color:</strong> {state.data.skin_color}
          </p>
          <p>
            <strong>Eye color:</strong> {state.data.eye_color}
          </p>
        </article>
      )}
    </div>
  );
}
