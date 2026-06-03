import type { Character } from '@/types/character';
import { Card } from '@/components/article-card/Card';
import './CardList.css';

interface Props {
  items: Character[];
}

export function CardList({ items }: Props) {
  if (items.length === 0) {
    return <p>No results found.</p>;
  }

  return (
    <div className="card-list">
      {items.map((item) => (
        <Card key={item.url} {...item} />
      ))}
    </div>
  );
}
