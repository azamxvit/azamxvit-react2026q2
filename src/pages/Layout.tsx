import { Link, NavLink, Outlet } from 'react-router-dom';
import { ErrorBoundary } from '../components/error-boundary/ErrorBoundary';

export function Layout() {
  return (
    <div className="app-container">
      <header className="app-header">
        <Link to="/" className="app-title">
          Star Wars Explorer
        </Link>
        <nav className="app-nav" aria-label="Main">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
      </header>

      <main>
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
    </div>
  );
}
