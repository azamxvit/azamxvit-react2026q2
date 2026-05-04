import { Component } from 'react';
import type { Character } from '../../types/character';
import { Card } from '../article-card/Card';

interface Props { items: Character[]; }

export class CardList extends Component<Props> {
  render() {
    const { items } = this.props;
    if (items.length === 0) return <p>No results found.</p>;
    return (
      <div className="card-list">
        {items.map((item) => (
          <Card key={item.url} item={item} />
        ))}
      </div>
    );
  }
}