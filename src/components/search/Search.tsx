import { Component } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

interface Props {
  initialValue: string;
  onSearch: (searchTerm: string) => void;
}
interface State { inputValue: string; }

export class Search extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { inputValue: props.initialValue };
  }
  handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputValue: e.target.value });
  };
  handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    this.props.onSearch(this.state.inputValue.trim());
  };
  render() {
    return (
      <form className="search-section" onSubmit={this.handleSubmit}>
        <input
          type="text"
          value={this.state.inputValue}
          onChange={this.handleChange}
          placeholder="Search Star Wars characters..."
        />
        <button type="submit">Search</button>
      </form>
    );
  }
}