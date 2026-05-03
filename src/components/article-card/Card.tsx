import { Component } from 'react';
import type { Character } from '../../types/character';

interface Props { item: Character; }

export class Card extends Component<Props> {
  render() {
    const { item } = this.props;
    return (
      <div className="card">
        <h3>{item.name}</h3>
        <p><strong>Birth Year:</strong> {item.birth_year}</p>
        <p><strong>Gender:</strong> {item.gender}</p>
      </div>
    );
  }
}