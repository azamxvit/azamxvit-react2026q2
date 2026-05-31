import type { ChangeEvent, KeyboardEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getCharacterId } from '@/api/swapi';
import { useSelectedItemsStore } from '@/store/selectedItemsStore';
import type { CardProps } from './Card.types';
import './Card.css';

export function Card({ name, birth_year, gender, url }: CardProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = getCharacterId(url);

  const isSelected = useSelectedItemsStore((state) => state.isSelected(url));
  const toggleItem = useSelectedItemsStore((state) => state.toggleItem);

  const openDetails = () => {
    const params = new URLSearchParams(searchParams);
    params.set('details', id);
    navigate(`/details/${id}?${params.toString()}`);
  };

  const handleCardKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openDetails();
    }
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    toggleItem({ name, birth_year, gender, url });
  };

  return (
    <div
      className="card"
      onClick={openDetails}
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
          aria-label={`Select ${name}`}
          data-testid="character-checkbox"
        />
      </label>
      <h3>{name}</h3>
      <p>
        <strong>Birth Year:</strong> {birth_year}
      </p>
      <p>
        <strong>Gender:</strong> {gender}
      </p>
    </div>
  );
}
