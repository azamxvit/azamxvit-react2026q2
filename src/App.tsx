import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from './components/error-boundary/ErrorBoundary';
import { QueryProvider } from './context/QueryProvider';
import { ThemeProvider } from './context/ThemeProvider';
import { AppRoutes } from './routes';
import '@/styles/index.css';

export default function App() {
  return (
    <QueryProvider>
      <ThemeProvider>
        <ErrorBoundary>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ErrorBoundary>
      </ThemeProvider>
    </QueryProvider>
  );
}
