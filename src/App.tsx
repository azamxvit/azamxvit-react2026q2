import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from './components/error-boundary/ErrorBoundary';
import { ThemeProvider } from './context/ThemeProvider';
import { AppRoutes } from './routes';
import './App.css';

export default function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ErrorBoundary>
    </ThemeProvider>
  );
}
