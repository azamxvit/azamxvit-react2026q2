import { Link, useSearchParams } from 'react-router-dom';
import type { MouseEvent } from 'react';
import type { Character } from '../../types/character';
import { getCharacterId } from '../../api/swapi';

interface Props {
  item: Character;
}

export function Card({ item }: Props) {
  const [searchParams] = useSearchParams();
  const id = getCharacterId(item.url);

  const params = new URLSearchParams(searchParams);
  params.set('details', id);

  const stopPropagation = (e: MouseEvent<HTMLAnchorElement>) => {
    e.stopPropagation();
  };

  return (
    <Link
      to={`/details/${id}?${params.toString()}`}
      className="card"
      onClick={stopPropagation}
      data-testid="character-card"
    >
      <h3>{item.name}</h3>
      <p>
        <strong>Birth Year:</strong> {item.birth_year}
      </p>
      <p>
        <strong>Gender:</strong> {item.gender}
      </p>
    </Link>
  );
}
