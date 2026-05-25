import type { ChangeEvent, KeyboardEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getCharacterId } from '../../api/swapi';
import { useSelectedItemsStore } from '../../store/selectedItemsStore';
import type { Character } from '../../types/character';

interface Props {
  item: Character;
}

export function Card({ item }: Props) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = getCharacterId(item.url);

  const isSelected = useSelectedItemsStore((state) => state.isSelected(item.url));
  const toggleItem = useSelectedItemsStore((state) => state.toggleItem);

  const openDetails = () => {
    const params = new URLSearchParams(searchParams);
    params.set('details', id);
    navigate(`/details/${id}?${params.toString()}`);
  };

  const handleCardClick = () => {
    openDetails();
  };

  const handleCardKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openDetails();
    }
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    toggleItem(item);
  };

  return (
    <div
      className="card"
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      role="button"
      tabIndex={0}
      data-testid="character-card"
    >
      <label className="card__checkbox" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleCheckboxChange}
          onClick={(e) => e.stopPropagation()}
          aria-label={`Select ${item.name}`}
          data-testid="character-checkbox"
        />
      </label>
      <h3>{item.name}</h3>
      <p>
        <strong>Birth Year:</strong> {item.birth_year}
      </p>
      <p>
        <strong>Gender:</strong> {item.gender}
      </p>
    </div>
  );
}
