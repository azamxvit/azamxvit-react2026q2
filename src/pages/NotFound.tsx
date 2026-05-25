import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <section className="not-found">
      <h1>404 — Page not found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" className="not-found__link">
        Back to home
      </Link>
    </section>
  );
}
