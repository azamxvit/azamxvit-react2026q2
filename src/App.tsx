import { Component } from 'react';
import { ErrorBoundary } from './components/error-boundary/ErrorBoundary';
import { Search } from './components/search/Search';
import { CardList } from './components/article-list/CardList';
import { Loader } from './components/skeleton/Loader';
import { fetchCharacters } from './api/swapi';
import type { Character } from './types/character';
import './App.css';

interface AppState {
  searchTerm: string;
  results: Character[];
  isLoading: boolean;
  error: string | null;
  triggerError: boolean;
}

class AppContent extends Component<Record<string, never>, AppState> {
  constructor(props: Record<string, never>) {
    super(props);
    const savedSearch = localStorage.getItem('rss_search_term') || '';
    this.state = {
      searchTerm: savedSearch,
      results: [],
      isLoading: false,
      error: null,
      triggerError: false,
    };
  }

  componentDidMount() {
    this.loadData(this.state.searchTerm);
  }

  loadData = async (query: string) => {
    this.setState({ isLoading: true, error: null });
    try {
      const data = await fetchCharacters(query);
      this.setState({ results: data.results, isLoading: false });
    } catch (error) {
      this.setState({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        isLoading: false,
      });
    }
  };

  handleSearch = (newSearchTerm: string) => {
    if (newSearchTerm === this.state.searchTerm) {
      return;
    }
    localStorage.setItem('rss_search_term', newSearchTerm);
    this.setState({ searchTerm: newSearchTerm }, () => {
      this.loadData(newSearchTerm);
    });
  };

  handleThrowError = () => {
    this.setState({ triggerError: true });
  };

  render() {
    if (this.state.triggerError) {
      throw new Error('This is a simulated application error!');
    }

    return (
      <div className="app-container">
        <header className="top-controls">
          <Search initialValue={this.state.searchTerm} onSearch={this.handleSearch} />
        </header>

        <main className="results-section">
          {this.state.error ? (
            <div className="api-error">{this.state.error}</div>
          ) : this.state.isLoading ? (
            <Loader />
          ) : (
            <CardList items={this.state.results} />
          )}
        </main>

        <button className="error-btn" onClick={this.handleThrowError}>
          Throw Error
        </button>
      </div>
    );
  }
}

export default class App extends Component {
  render() {
    return (
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    );
  }
}