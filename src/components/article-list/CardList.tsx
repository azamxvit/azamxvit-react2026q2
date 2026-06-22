import { Card } from '@/components/article-card';
import type { Character } from '@/types';
import './CardList.css';

interface Props {
  items: Character[];
}

export function CardList({ items }: Props) {
  return (
    <div className="card-list">
      {items.map((item) => (
        <Card key={item.url} {...item} />
      ))}
    </div>
  );
}
