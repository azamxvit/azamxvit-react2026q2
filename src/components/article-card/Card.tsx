'use client';

import type { ChangeEvent, KeyboardEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { getCharacterId } from '@/services';
import { Link } from '@/i18n';
import { buildDetailsPath } from '@/lib';
import { useSelectedItemsStore } from '@/store';
import type { CardProps } from './Card.types';
import './Card.css';

export function Card({ name, birth_year, gender, url }: CardProps) {
  const searchParams = useSearchParams();
  const id = getCharacterId(url);

  const isSelected = useSelectedItemsStore((state) => state.isSelected(url));
  const toggleItem = useSelectedItemsStore((state) => state.toggleItem);

  const query = {
    q: searchParams?.get('q') ?? '',
    page: searchParams?.get('page') ?? '1',
  };

  const detailsHref = buildDetailsPath(id, query);

  const handleCardKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.currentTarget.querySelector<HTMLAnchorElement>('a.card__link')?.click();
    }
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    toggleItem({ name, birth_year, gender, url });
  };

  return (
    <div
      className="card"
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
      <Link href={detailsHref} className="card__link">
        <h3>{name}</h3>
        <p>
          <strong>Birth Year:</strong> {birth_year}
        </p>
        <p>
          <strong>Gender:</strong> {gender}
        </p>
      </Link>
    </div>
  );
}
